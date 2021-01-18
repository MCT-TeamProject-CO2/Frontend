import { get } from './util/Data.js'

export default class Router {
    _cache = new Map();
    _handlers = new Map();
    _innerHandlers = new Map();

    constructor(app) {
        this.app = app;
    }

    get active() {
        return this._active;
    }

    get search() {
        return new URLSearchParams(location.search);
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
        document.title = 'AirMonitor | ' + path;

        const contents = await this.prepare(path);

        this.app.body.innerHTML = contents;

        const instance = this._handlers.get(path);
        if (instance) instance.run();
        this._active = instance;
    }

    async navigateInner(path) {
        document.title = 'AirMonitor | ' + path;

        const contents = await this.prepare('inner/' + path);

        const inner = document.querySelector('.c-app__main');
        if (!inner) console.log('Unable to navigate inner, is the home content loaded?');
        inner.outerHTML = contents;

        const instance = this._innerHandlers.get(path);
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

    /**
     * Register an inner path handler
     * @param {string} path 
     * @param {Object} instance 
     */
    registerInner(path, instance) {
        this._innerHandlers.set(path, instance);
    }
}