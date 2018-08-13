import ImUtil from './im-util.js';

const srvList = new Map([['main', 'http://localhost:9999/']]);

class ImHttp {
    constructor(config = {}) {
        this.config = config;
        this.imUtil = new ImUtil(config);
    }

    expandBasicParams() {
        return {
            source: this.config.source
        };
    }

    /**
     * 获取未读消息
     * @param params
     * @param ext
     * @returns {*}
     */
    getUnread(params = {}, ext = {}) {
        params.token = this.imUtil.getToken();
        Object.assign(params, this.expandBasicParams());
        return this.imUtil.request(
            {
                url: srvList.get('main') + 'usr/api/getUnread',
                method: 'GET',
                params
            }
        )
    }

    /**
     * 获取用户信息
     * @param params
     * @param ext
     * @returns {*}
     */
    getUserInfo(params = {}, ext = {}) {
        params.token = this.imUtil.getToken();
        Object.assign(params, this.expandBasicParams());
        return this.imUtil.request(
            {
                url: srvList.get('main') + 'usr/api/listUinfo',
                method: 'GET',
                params
            }
        )
    }

    /**
     * 获取群组用户信息
     * @param params
     * @param ext
     * @returns {*}
     */
    getGroupUserList(params = {}, ext = {}) {
        params.token = this.imUtil.getToken();
        Object.assign(params, this.expandBasicParams());
        return this.imUtil.request(
            {
                url: srvList.get('main') + 'usr/api/listImGroup',
                method: 'GET',
                params
            }
        )
    }

}

export default ImHttp;