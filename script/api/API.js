import { ApiHost } from '../util/Constants.js'
import Data from '../util/Data.js'
import Alerts from './Alerts.js'
import Auth from './Auth.js'
import Locations from './Locations.js'
/*
import Measurements from './Measurements.js'
import Settings from './Settings.js'
import Users from './Users.js'
*/

export default class API {
    alerts = new Alerts(this);
    auth = new Auth(this);
    locations = new Locations(this);
    /*measurements = new Measurements(this);
    settings = new Settings(this);
    users = new Users(this);
    */

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

    getSession() {
        return sessionStorage.getItem('session');
    }

    /**
     * @param {string} sessionId 
     */
    setSession(sessionId) {
        sessionStorage.setItem('session', sessionId);
    }
}