import { get } from './util/Data.js'

export default class Router {
    _cache = new Map();
    _handlers = new Map();
    _innerHandlers = new Map();
    _search = null;

    constructor(app) {
        this.app = app;
    }

    get active() {
        return this._active;
    }

    get activeInner() {
        return this._innerActive;
    }

    get search() {
        return new URLSearchParams(this._search ? this._search : location.search);
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

    _updateSearch(path) {
        const split_path = path.split('?');

        this._search = split_path[1];
        return split_path[0];
    }

    async prepare(path) {
        path = this._updateSearch(path);

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
        path = this._updateSearch(path);

        document.title = 'AirMonitor | ' + path;

        const contents = await this.prepare(path);

        this.app.body.innerHTML = contents;

        const instance = this._handlers.get(path);
        this._innerActive = undefined;
        if (instance) instance.run();
        this._active = instance;
    }

    async navigateInner(path) {
        path = this._updateSearch(path);

        document.title = 'AirMonitor | ' + path;

        const contents = await this.prepare('inner/' + path);

        const inner = document.querySelector('.c-app__main');
        if (!inner) {
            window.location = '/#/' + path + this._search;
            location.reload();

            console.log('Unable to navigate inner, is the home content loaded?');

            return;
        }
        inner.outerHTML = contents;

        if (this._el) this._el.classList.remove('c-main-nav__item--current');
        this._el = document.querySelector(`[href="/#/${path}"]`)?.parentElement;
        if (this._el) this._el.classList.add('c-main-nav__item--current');

        const instance = this._innerHandlers.get(path);
        if (instance) instance.run();
        this._innerActive = instance;
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