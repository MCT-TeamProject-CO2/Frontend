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
        document.body.insertAdjacentHTML('beforeend', `<section id="${this.id}" class="c-popup">
            <div class="c-card u-width-max u-width-fit-content-bp1">
                <p class="c-card__title">${this.title}</p>
                <div class="c-card__content">
                    <p>${this.body}</p>
                </div>
            </div>
        </section>`);

        this._e = document.getElementById(this.id);

        if (this.closable)
            this._e.addEventListener('click', this.close.bind(this));
    }
}