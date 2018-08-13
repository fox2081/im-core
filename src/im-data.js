let basicData = {
    self: {},
    allUsers: {},
    recentUser: [],
    friends: [],
    groups: []
};

class ImData {
    constructor(config = {}) {
        this.data = basicData;
    }

    getData() {
        return this.data;
    }
}

export default ImData;