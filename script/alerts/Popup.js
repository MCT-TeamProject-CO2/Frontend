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
        document.body.insertAdjacentHTML('beforeend', `<section class="c-popup" id="${this.id}">
            <div class="c-card u-width-max u-width-fit-content-bp1">
                <p class="c-card__title">
                    ${this.title}
                    <button class="o-button-reset c-popup-close">
                        <svg class="c-popup-close__icon" id="close-24px" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path id="Path_107" data-name="Path 107" d="M0,0H24V24H0Z" fill="none"/>
                            <path id="Path_108" data-name="Path 108" d="M18.3,5.71a1,1,0,0,0-1.41,0L12,10.59,7.11,5.7A1,1,0,0,0,5.7,7.11L10.59,12,5.7,16.89A1,1,0,0,0,7.11,18.3L12,13.41l4.89,4.89a1,1,0,0,0,1.41-1.41L13.41,12,18.3,7.11A1,1,0,0,0,18.3,5.71Z"/>
                        </svg>
                    </button>
                </p>
                <div class="c-card__content">
                    <p>${this.body}</p>
                </div>
            </div>
        </section>`);

        this._e = document.getElementById(this.id);

        const closeBtn = document.querySelector(`#${CSS.escape(this.id)} .c-popup-close`)
        closeBtn.addEventListener('click', this.close.bind(this));

        if (this.closable)
            this._e.addEventListener('click', this.close.bind(this));
        else
            closeBtn.remove();
    }
}