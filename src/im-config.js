const userType = new Map([
    ['user', 'u'],
    ['group', 'g'],
    ['system', 's']
]);

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