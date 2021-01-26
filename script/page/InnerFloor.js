import Plan from "./floor/Plan.js";

export default class InnerFloor {
    constructor(app) {
        this.app = app;

        this.plan = new Plan(app);
    }

    domLookup() {
        this.title = document.querySelector('.c-main-section__title');
        this.floorPlan = document.querySelector('.c-floorplan');

        this.cards = document.querySelector('.c-cards');

        this.loading();
    }

    loading(toggle = true) {
        if (toggle)
            this.floorPlan.insertAdjacentHTML('beforeend', '<div class="c-loader--spinner"><div></div><div></div><div></div><div></div></div>');
        else
            document.querySelector('.c-loader--spinner')?.remove();
    }

    async loadSVG(floorPlan) {
        if (floorPlan) {
            this.floorPlan.insertAdjacentHTML('beforeend', await this.app.api.locations.getSVG(floorPlan.id));

            const svg = document.querySelector('.c-floorplan svg:not(.svg)');

            this.loading(false);

            if (svg) {
                svg.classList.add('js-floorplan');

                this.plan.run();
            }
            else this.floorPlan.innerHTML = '<p>This location does not have a floor plan assigend to it.';

            return;
        }
        
        this.floorPlan.innerHTML = '<p>This location does not have any floors registered with their respective floor plans.';
    }

    renderLocation(locations) {
        this.location = locations[0];
        // Async
        this.loadSVG(this.location.floor_plans.find(floorPlan => floorPlan.tag == this.floor));

        this.title.innerHTML = this.location.name + ' – Floor ' + this.floor;
    }

    renderRooms(rooms) {
        this.cards.innerHTML = '';

        for (const tagString in rooms) {
            if (Object.hasOwnProperty.call(rooms, tagString)) {
                const room = rooms[tagString];
                
                const data = {};
                for (const obj of room)
                    data[obj._field] = obj._value;

                const humidity = data.humidity ? Math.round(data.humidity * 100) / 100 : '—';
                const temperature = data.temperature ? Math.round(data.temperature * 100) / 100 : '—';
                const co2 = data.co2eq_ppm ? Math.round(data.co2eq_ppm * 100) / 100 : '—';
                const tvoc = data.tvoc_ppb ? Math.round(data.tvoc_ppb * 100) / 100 : '—';

                this.cards.insertAdjacentHTML(
                    'beforeend',
                    `<div class="c-card c-card--clickable u-width-max-bp3 js-room" data-room="${tagString}">
                        <p class="c-card__title">${tagString}</p>
                        <ul class="c-card__content c-measurements">
                            <li class="c-measurements__item ">
                                <p>Humidity</p>
                                <p>${humidity}%</p>
                            </li>
                            <li class="c-measurements__item ">
                                <p>Temperature</p>
                                <p>${temperature} °C</p>
                            </li>
                            <li class="c-measurements__item ">
                                <p>CO2</p>
                                <p>${co2} ppm</p>
                            </li>
                            <li class="c-measurements__item ">
                                <p>TVOC</p>
                                <p>${tvoc} ppb</p>
                            </li>
                        </ul>
                    </div>`);
            }
        }
    }

    async run() {
        this.domLookup();

        const tag = this.app.router.search.get('location');
        this.floor = this.app.router.search.get('floor');

        this.app.api.measurements.getDelta(`${tag}.[A-Z].${this.floor}`, 1, ['co2eq_ppm', 'humidity', 'temperature', 'tvoc_ppb'], '2m')
            .then(this.renderRooms.bind(this));
        this.app.api.locations.get(tag)
            .then(this.renderLocation.bind(this));
    }
}