import BaseAlert from './Base.js'

export default class Popup extends BaseAlert {
    _e;

    /**
     * Pushes a popup on top of the body
     * @param {Alerts} alerts The the alert managing class
     * @param {string} title The title of the popup
     * @param {string} body The body description of the popup
     * @param {boolean} closable If it should be closable or not, make sure you have some kind of timeout to catch this
     */
    constructor(alerts, title, body, closable) {
        super();

        Object.assign(this, {
            alerts,
            title,
            body,
            closable
        });
    }

    get element() {
        return this._e;
    }

    get type() {
        return 'popup';
    }

    close() {
        this.alerts.remove(this.id);

        if (!this.element) return false;

        this.element.remove();

        return true;
    }

    push() {
        document.body.insertAdjacentHTML('beforeend', `<div id="${this.id}" class="c-popup">
            <div class="c-card c-card--alert u-max-width--lg" data-room="BCE.A.0.001">
                <p class="c-card__title">${this.title}</p>
                <ul class="c-card__content c-measurements">
                    ${this.body}
                </ul>
            </div>
        </div>`);

        this._e = document.getElementById(this.id);

        if (this.closable)
            this._e.addEventListener('click', this.close.bind(this));
    }
}