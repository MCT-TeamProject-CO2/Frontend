import Alerts from './Alerts.js'
import API from './api/API.js'
import Router from './Router.js'

import Home from './page/Home.js'
import Login from './page/Login.js'

export default class AppRoot {
    _alerts = new Alerts();
    _api = new API(this);
    _router = new Router(this);
    
    _requireLogin = true;
    _rdy = false;

    constructor() {
        this._checkSession();

        this.router.register('home', new Home(this));
        this.router.register('login', new Login(this));
    }

    /**
     * @returns {API}
     */
    get api() {
        return this._api;
    }

    /**
     * @returns {Alerts}
     */
    get alerts() {
        return this._alerts;
    }

    /**
     * If the session has been checked/document is ready
     * @returns {boolean}
     */
    get ready() {
        return this._rdy;
    }

    get requireLogin() {
        return this._requireLogin;
    }

    /**
     * @returns {Router}
     */
    get router() {
        return this._router;
    }

    async _checkSession() {
        this._timeout = setTimeout(() => {
            this.alerts.pushPopup('Communicating', 'Communication with the backend is taking longer than expected...', false);

            this._timeout = setTimeout(() => {
                this.alerts.pushPopup('Communication Error', 'Could not communicate with backend.<br>Try again later...', false);
            }, 5e3);
        }, 500);

        this._requireLogin = !await this._api.auth.valid();

        clearTimeout(this._timeout);

        this.router.prepare(this._requireLogin ? 'login' : 'home');
        this._ready();
    }

    _ready() {
        if (this._rdy)
            this.router.navigate(this.requireLogin ? 'login' : 'home');
        this._rdy = true;
    }

    domReady(e) {
        this.body = document.body;

        this._ready();
    }
}