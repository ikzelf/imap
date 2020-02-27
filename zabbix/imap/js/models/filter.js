class Filter {
    constructor() {
        this.showSeverity = 0;
        this.hostId = 0;
        this.groupId = 0;
    }

    load(data) {
        Object.assign(this, data);

        return this;
    }
}

export default new Filter();