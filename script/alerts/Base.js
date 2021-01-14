export default class BaseAlert {
    constructor() {
        this._id = (Date.now() + Math.random()).toString("16");
    }

    get id() {
        return this._id;
    }

    get type() {
        throw new Error('Type getter has not been implemented.');
    }
}