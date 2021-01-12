import { get } from './util/Data.js'

export default class Router {
    _cache = new Map();
    _handlers = new Map();

    constructor(app) {
        this.app = app;
    }

    get active() {
        return this._active;
    }

    /**
     * @private
     * @param {string} path
     * @returns {Promise<string>}
     */
    async _getPathContents(path) {
        const absPath = `/pages/${path}.html`;

        const res = await get(absPath);
        return res.text();
    }

    async prepare(path) {
        if (this._cache.has(path)) {
            const fileString = this._cache.get(path);
            if (fileString instanceof Promise)
                fileString.then(string => this._cache.set(path, string));

            return fileString;
        }

        const fileString = this._getPathContents(path);
        this._cache.set(path, fileString);

        return fileString;
    }

    async navigate(path) {
        const contents = await this.prepare(path);

        this.app.body.innerHTML = contents;

        const instance = this._handlers.get(path);
        if (instance) instance.run();
        this._active = instance;
    }

    /**
     * Register a handler for a path
     * @param {string} path 
     * @param {Object} instance 
     */
    register(path, instance) {
        this._handlers.set(path, instance);
    }
}