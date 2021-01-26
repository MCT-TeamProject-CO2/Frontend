export default class InnerHome {
    constructor(app) {
        this.app = app;
    }

    domLookup() {
        this.location_wrapper = document.querySelector('.js-locations');
        this.alerts_wrapper = document.querySelector('.js-alerts');
    }

    floorClick(e) {
        e?.preventDefault();

        let el = e.target;
        while (!el.classList.contains('js-btn-floor'))
            el = el.parentElement;
        
        this.app.router.navigateInner(`floor?location=${el.dataset.location}&floor=${el.dataset.floor}`);
    }

    async loadAlerts() {
        const { succes, data } = await this.app.api.alerts.get();

        if (succes) {
            this.renderAlerts(data);

            setTimeout(this.loadAlerts.bind(this), 12e4);

            return true;
        }
        this.app.router.active.logout();
        return false;
    }

    async loadLocations() {
        const data = await this.app.api.locations.getAll();

        this.renderLocations(data);
    }

    renderAlerts(alerts) {
        this.alerts_wrapper.innerHTML = alerts.length === 0 ?
            '<p>There are no active alerts.</p>' :
            '';

        alerts.forEach(alert => {
            const date = new Date(alert.updatedAt);

            const html = `<div class="c-card c-card--clickable u-width-fit-content u-width-max-bp3 js-room room-has-alert ${alert.code == 1 ? 'room-has-alert--orange' : ''}" data-room="${alert.tagString}">
                <p class="c-card__title">${alert.tagString}</p>
                <ul class="o-list c-card__content c-measurements ">
                    <li class="c-measurements__item ">
                        <p>Humidity</p>
                        <p>${Math.round(alert.humidity * 1e3) / 1e3}%</p>
                    </li>
                    <li class="c-measurements__item ">
                        <p>Temperature</p>
                        <p>${Math.round(alert.temperature * 10) / 10} °C</p>
                    </li>
                    <li class="c-measurements__item ">
                        <p>CO2</p>
                        <p>${Math.round(alert.co2 * 100) / 100} ppm</p>
                    </li>
                    <li class="c-measurements__item ">
                        <p>TVOC</p>
                        <p>${Math.round(alert.tvoc * 1e4) / 1e4} ppb</p>
                    </li>
                </ul>
                <p class="c-card__footer">${date.toLocaleDateString()} - ${date.toLocaleTimeString()}</p>
            </div>`;

            this.alerts_wrapper.insertAdjacentHTML('beforeend', html);
        });
    }

    renderLocations(locations) {
        this.location_wrapper.innerHTML = '';

        locations.forEach((location) => {
            let html = `<div class="c-card u-max-width-sm-bp1">
                <p class="c-card__title">${location.name}</p>
                <ul class="o-list c-card__content">`;
                
            location.floor_plans.forEach(floorPlan => {
                html += `<li class="c-floor">
                    <button class="c-floor__btn o-button-reset js-btn-floor" data-location="${location.tag}" data-floor="${floorPlan.tag}">
                        <p class="c-floor__text ">Floor ${floorPlan.tag}</p>
                        <svg class="c-floor__icon " id="arrow_rounded " data-name="arrow rounded " xmlns="http://www.w3.org/2000/svg " width="6.585 " height="11.175 " viewBox="0 0 6.585 11.175 ">
                            <path id="keyboard_arrow_right-24px " d="M9.29,15.88,13.17,12,9.29,8.12A1,1,0,0,1,10.7,6.71l4.59,4.59a1,1,0,0,1,0,1.41L10.7,17.3a1,1,0,0,1-1.41,0,1.017,1.017,0,0,1,0-1.42Z" transform="translate(-8.997 -6.418) "/>
                        </svg>
                    </button>
                </li>`;
            })

            html +=`</ul></div>`;

            this.location_wrapper.insertAdjacentHTML('beforeend', html);
        });

        const floorBtns = document.querySelectorAll('.js-btn-floor');
        floorBtns.forEach(floorBtn => floorBtn.addEventListener('click', this.floorClick.bind(this)));

        this.locations = locations;
    }

    async run() {
        this.domLookup();

        if (await this.loadAlerts())
            this.loadLocations();
    }
}