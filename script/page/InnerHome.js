export default class InnerHome {
    constructor(app) {
        this.app = app;
    }

    domLookup() {
        this.location_wrapper = document.querySelector('.js-locations');
    }

    async loadLocations() {
        const { succes, data } = await this.app.api.locations.getAll();

        if (succes) {
            this.renderLocations(data);

            return;
        }
        this.logout();
    }

    renderLocations(locations) {
        locations.forEach((location) => {
            const html = `<div class="c-card u-max-width--md">
                <p class="c-card__title ">${location.name}</p>
                <ul class="c-card__content ">
                    <li class="c-floor has-alert ">
                        <button class="c-floor__btn o-button-reset js-btn-floor" data-floor="Floor 0" data-location="Location"><p class="c-floor__btn-text ">Floor 0</p>
                            <svg class="c-floor__icon " id="arrow_rounded " data-name="arrow rounded " xmlns="http://www.w3.org/2000/svg " width="6.585 " height="11.175 " viewBox="0 0 6.585 11.175 ">
                                <path class="c-floor__icon-symbol " id="keyboard_arrow_right-24px " d="M9.29,15.88,13.17,12,9.29,8.12A1,1,0,0,1,10.7,6.71l4.59,4.59a1,1,0,0,1,0,1.41L10.7,17.3a1,1,0,0,1-1.41,0,1.017,1.017,0,0,1,0-1.42Z
    " transform="translate(-8.997 -6.418) "/>
                            </svg>
                        </button>
                    </li>
                    <li class="c-floor ">
                        <button class="c-floor__btn o-button-reset js-btn-floor" data-floor="FLoor 1" data-location="Location"><p class="c-floor__btn-text ">Floor 1</p>
                            <svg class="c-floor__icon " id="arrow_rounded " data-name="arrow rounded " xmlns="http://www.w3.org/2000/svg " width="6.585 " height="11.175 " viewBox="0 0 6.585 11.175 ">
                                <path class="c-floor__icon-symbol " id="keyboard_arrow_right-24px " d="M9.29,15.88,13.17,12,9.29,8.12A1,1,0,0,1,10.7,6.71l4.59,4.59a1,1,0,0,1,0,1.41L10.7,17.3a1,1,0,0,1-1.41,0,1.017,1.017,0,0,1,0-1.42Z
    " transform="translate(-8.997 -6.418) "/>
                            </svg>
                        </button>
                    </li>
                    <li class="c-floor has-alert ">
                        <button class="c-floor__btn o-button-reset js-btn-floor"><p class="c-floor__btn-text ">Floor 2</p>
                            <svg class="c-floor__icon " id="arrow_rounded " data-name="arrow rounded " xmlns="http://www.w3.org/2000/svg " width="6.585 " height="11.175 " viewBox="0 0 6.585 11.175 ">
                                <path class="c-floor__icon-symbol " id="keyboard_arrow_right-24px " d="M9.29,15.88,13.17,12,9.29,8.12A1,1,0,0,1,10.7,6.71l4.59,4.59a1,1,0,0,1,0,1.41L10.7,17.3a1,1,0,0,1-1.41,0,1.017,1.017,0,0,1,0-1.42Z
    " transform="translate(-8.997 -6.418) "/>
                            </svg>
                        </button>
                    </li>
                </ul>
            </div>`;

            this.location_wrapper.insertAdjacentHTML('beforeend', html);
        });
    }

    run() {
        this.domLookup();

        this.loadLocations();
    }
}