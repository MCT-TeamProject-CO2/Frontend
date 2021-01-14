import Popup from './alerts/Popup.js';

export default class Alerts {
    _cache = new Map();

    constructor() {

    }

    /**
     * Pushes a popup on top of the body
     * @param {string} title 
     * @param {string} body 
     * @param {boolean} [closable = true] 
     */
    pushPopup(title, body, closable = true) {
        const popup = new Popup(this, title, body, closable);
        
        this.setActive(popup);

        return popup;
    }

    remove(id) {
        return this._cache.delete(id);
    }

    setActive(alert) {
        if (this.active)
            this.active.close();
        this.active = alert;

        this._cache.set(alert.id, alert);

        alert.push();
    }
}