// 用户类型，用来区分系统消息(s)/用户(u)/群组(g)
const userType = new Map([
    ['user', 'u'],
    ['group', 'g'],
    ['system', 's']
]);

// 默认配置
const defaultConfig = {
    msgSeq: '^-^',
    url: 'ws://localhost:14001',
    userType
};

class ImConfig {
    constructor(config = {}) {
        this.defaultConfig = defaultConfig;
        this.config = Object.assign(this.defaultConfig, config);
    }

    getConfig() {
        return this.config;
    }

    getDefaultConfig() {
        return this.defaultConfig;
    }

}

export default ImConfig;