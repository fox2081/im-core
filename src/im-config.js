class ImConfig {
    constructor(config = {}) {
        this.defaultConfig = {
            msgSeq: '^-^',
            url: 'wss://****'
        };
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