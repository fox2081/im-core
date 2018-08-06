import ImConfig from './im-config.js';
import ImSocket from './im-websocket.js';
import ImUtil from './im-util.js';

/**
 * 即时通讯核心类
 */
class IM {
    constructor(args) {
        this.imConfig = new ImConfig(args);
        this.config = this.imConfig.getConfig();
        this.imSocket = new ImSocket(this.config);
        this.imUtil = new ImUtil(this.config);
        this.bindSocketEvents();
        this.init();
    }

    getApi() {
        return {
            connect: () => {
                this.imSocket.connect();
            }
        };
    }

    bindSocketEvents() {
        this.on = this.imSocket.on.bind(this.imSocket);
        this.send = this.imSocket.sendMessage.bind(this.imSocket);
    }

    init() {
        this.util = this.imUtil;
        this.api = this.getApi();
    }
}

export default IM;