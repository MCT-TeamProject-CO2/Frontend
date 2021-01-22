import { ApiHost } from '../util/Constants.js'
import Data from '../util/Data.js'
import Alerts from './Alerts.js'
import Auth from './Auth.js'
import Locations from './Locations.js'
import Settings from './Settings.js'
import Users from './Users.js'
/*
import Measurements from './Measurements.js'
*/

export default class API {
    alerts = new Alerts(this);
    auth = new Auth(this);
    locations = new Locations(this);
    settings = new Settings(this);
    users = new Users(this);
    /*measurements = new Measurements(this);
    */

    _user = null;

    constructor(app) {
        this.app = app;

        Object.assign(this, Data);
    }

    /**
     * @returns {string}
     */
    get host() {
        return ApiHost;
    }

    get user() {
        return this._user;
    }

    set user(new_value) {
        this._user = new_value;
    }

    getSession() {
        return sessionStorage.getItem('session');
    }

    /**
     * @param {string} sessionId 
     */
    setSession(sessionId) {
        sessionStorage.setItem('session', sessionId);
    }

    async getUser() {
        if (!this.user) 
            this.user = await this.users.me();
        return this.user;
    }
}