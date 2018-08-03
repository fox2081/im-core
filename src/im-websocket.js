class IM {
    constructor(args) {
        this.url = args.url;
        this.reconnect = !!args.reconnect;
        this.showLog = !!args.log;
        this.msgSeq = args.msgSeq || '^-^';
        this.showLog = args.showLog || false;
        this.events = {};
        this.times = 0;
        this.tdata = '';
        this.closed = true;
        this.msgStore = {};
        this.connect();
    }

    /**
     * log，showLog 控制，默认false
     */
    log() {
        if (!this.showLog) {
            return;
        }
        switch (arguments.length) {
            case 1:
                console.log(arguments[0]);
                break;
            case 2:
                console.log(arguments[0], arguments[1]);
                break;
            case 3:
                console.log(arguments[0], arguments[1], arguments[2]);
                break;
            case 4:
                console.log(arguments[0], arguments[1], arguments[2], arguments[3]);
                break;
            default:
                console.log(arguments[0]);
                break;
        }
    }

    on(name, func) {
        this.events[name] = func;
    }

    trigger(name) {
        let others = Array.prototype.slice.call(arguments, 1);
        if (typeof this.events[name] === 'function') {
            this.events[name].apply(this, others);
        }
    }

    /**
     * 启动连接socket服务器
     */
    connect() {
        this.ws = new WebSocket(this.url);
        this.ws.onerror = (e) => {
            this.onError(e);
        };
        this.ws.onopen = (e) => {
            this.onOpen(e);
        };
        this.ws.onmessage = (e) => {
            this.onMessage(e);
        };
        this.ws.onclose = (e) => {
            this.onClose(e);
        };
        this.log(`[connecting] -> ${this.url}`);
    }

    /**
     * 开启事件
     * @param e
     */
    onError(e) {
        this.log(`[onError] -> ${e}`);
        this.trigger('error', e);
    }

    /**
     * 开启事件
     * @param e
     */
    onOpen(e) {
        this.log(`[onOpen] -> ${this.url}`);
        this.trigger('connect', e);
        this.trigger('open', e);
        this.times = 0;
        this.closed = false;
    }

    /**
     * 消息事件
     * @param e
     */
    onMessage(e) {
        this.log(`*** [ws.onMessage] ***: ${e.data}`);
        // 拼接消息，直到出现换行符，说明一条消息接收完成
        this.tdata += e.data;
        if (this.tdata.substr(this.tdata.length - 1) !== `\n`) {
            return;
        }
        let tdata = this.tdata;
        let cmds = tdata.split(this.msgSeq);
        this.tdata = '';
        if (cmds.length < 2) {
            this.log(`[receive invalid data] -> ${tdata}`);
            return;
        }
        let args = JSON.parse(cmds[1]);
        // m 为普通消息，需要进行解码
        if (cmds[0] === 'm') {
            if (this.msgStore[args.i]) {
                return;
            }
            args.c = Base64.decode(args.c);
            this.msgStore[args.i] = true;
        }
        this.trigger(cmds[0], args);
    }

    /**
     * 关闭事件
     * @param e
     */
    onClose(e) {
        this.log(`[onClose] -> ${e}`);
        this.trigger('close', e);
        this.closed = true;
        this.log(`[ZZZ] ws is closed...`);
        if (this.reconnect) {
            this.log(`ws will reconnect after ${(this.times * 100)} ms`);
            setTimeout(() => {
                this.connect();
            }, this.times * 300);
            this.times++;
        }
    }

    /**
     * ws 消息发送
     * @param name
     * @param args
     */
    emit(name, args) {
        this.ws.send(`${name}${this.msgSeq}${JSON.stringify(args)}\n`);
    }

    /**
     * 标记已读
     * @param ids
     * @param target
     */
    markRead(ids, target) {
        this.emit('mr', {
            i: ids,
            a: target,
        });
    }

    /**
     * 用户发送消息
     * @param r
     * @param t
     * @param i
     * @param c
     */
    sendMessage({r, t, i, c}) {
        if (!r || r.length < 1 || t === undefined || c) {
            this.log(`[sms args error] -> ${{r, t, i, c}}`);
            return;
        }
        this.log(`---------`);
        this.log(`>>> receiver: ${r}`);
        this.log(`>>> msg type: ${t}`);
        this.log(`>>> content: ${c}`);
        this.log(`---------`);

        this.emit('m', {r, t, i, c: Base64.encode(c),});
    }
}

export default IM;
