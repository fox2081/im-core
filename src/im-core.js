import ImConfig from './im-config.js';
import ImSocket from './im-websocket.js';

class IM {
    constructor(args) {
        this.imConfig = new ImConfig(args);
        this.imSocket = new ImSocket(this.imConfig.getConfig());
        this.bindSocketEvents();
        this.init();
    }


    iUtil() {
        return {
            connect: () => {
                this.imSocket.connect();
            }
        }
    }

    bindSocketEvents() {
        this.on = this.imSocket.on.bind(this.imSocket);
        this.send = this.imSocket.sendMessage.bind(this.imSocket);
    }

    init() {
        this.util = this.iUtil();
    }
}

export default IM;