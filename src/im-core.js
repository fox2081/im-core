import ImConfig from './im-config.js';
import ImSocket from './im-websocket.js';
import ImUtil from './im-util.js';
import ImHttp from './im-http.js';
import ImData from "./im-data.js";

/**
 * 即时通讯核心类
 */
class IM {
    constructor(args) {
        this.imConfig = new ImConfig(args);
        this.config = this.imConfig.getConfig();
        this.imSocket = new ImSocket(this.config);
        this.imUtil = new ImUtil(this.config);
        this.imHttp = new ImHttp(this.config);
        this.imData = new ImData(this.config);
        this.bindSocketEvents();
        this.init();
    }

    getApi() {
        return {
            connect: () => {
                this.imSocket.connect();
            },
            markMsgRead: ({i, a}) => {
                this.imSocket.markRead(i, a);
            }
        };
    }

    getHttp() {
        return {
            getUnread: this.imHttp.getUnread.bind(this.imHttp)
        }
    }

    getData() {
        return this.imData.getData();
    }

    bindSocketEvents() {
        this.on = this.imSocket.on.bind(this.imSocket);
        this.send = this.imSocket.sendMessage.bind(this.imSocket);
    }

    init() {
        this.util = this.imUtil;
        this.data = this.getData();
        this.api = this.getApi();
        this.http = this.getHttp();
    }
}

export default IM;