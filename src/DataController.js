class DataController {
    constructor() {
        const instance = this.constructor.instance;
        if (instance) {
            return instance;
        }
        this.constructor.instance = this;
    }

    foo() {
        return 1
    }
}

export default DataController