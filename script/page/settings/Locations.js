export default class Locations {
    constructor(app) {
        this.app = app;
    }

    addFloor(e) {
        e.preventDefault();

        let el = e.target;
        while (!el.classList.contains('c-dropzone__add'))
            el = el.parentElement;

        el.insertAdjacentHTML('beforebegin', `<div class="c-dropzone__section remove">
            <div class="c-input c-dropzone__number">
                <input class="c-input__field" type="number" name="floor[]">
            </div>
            <input class="c-dropzone__file" type="file" name="floor_plan[]" accept=".svg">
            
            <button class="o-button-reset" onclick="this.parentElement.remove()">
                <svg class="c-popup-close__icon" id="close-24px" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path id="Path_107" data-name="Path 107" d="M0,0H24V24H0Z" fill="none"/>
                    <path id="Path_108" data-name="Path 108" d="M18.3,5.71a1,1,0,0,0-1.41,0L12,10.59,7.11,5.7A1,1,0,0,0,5.7,7.11L10.59,12,5.7,16.89A1,1,0,0,0,7.11,18.3L12,13.41l4.89,4.89a1,1,0,0,0,1.41-1.41L13.41,12,18.3,7.11A1,1,0,0,0,18.3,5.71Z"/>
                </svg>
            </button>
        </div>`);
    }

    async addLocationSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);

        await this.app.api.locations.createFormData(formData);

        this.openOverlay();
    }

    domLookup() {
        const btn = document.querySelector('.js-configure-locations');
        btn.addEventListener('click', this.openOverlay.bind(this));

        this.location_config = {
            base: {
                popup: document.querySelector('.js-popup-locationsconfig'),
                wrapper: document.querySelector('.js-popup-locationsconfig .c-popup__content'),
                close: document.querySelector('.js-popup-locationsconfig .c-popup-close'),
                add: document.querySelector('.js-popup-locationsconfig .c-add')
            },
            add: {
                popup: document.querySelector('.js-popup-locationsconfig--add'),
                wrapper: document.querySelector('.js-popup-locationsconfig--add .c-popup__content'),
                close: document.querySelector('.js-popup-locationsconfig--add .c-popup-close'),
                cancel: document.querySelector('.js-popup-locationsconfig--add .c-button--grey'),
                form: document.querySelector('.js-popup-locationsconfig--add form'),
                add: document.querySelector('.js-popup-locationsconfig--add form .c-dropzone__add')
            },
            edit: {
                popup: document.querySelector('.js-popup-locationsconfig--edit'),
                wrapper: document.querySelector('.js-popup-locationsconfig--edit .c-popup__content'),
                close: document.querySelector('.js-popup-locationsconfig--edit .c-popup-close'),
                cancel: document.querySelector('.js-popup-locationsconfig--edit .c-button--grey'),
                form: document.querySelector('.js-popup-locationsconfig--edit form'),
                add: document.querySelector('.js-popup-locationsconfig--edit form .c-dropzone__add')
            }
        };

        this.location_config.base.close.addEventListener('click', () => {
            this.location_config.base.popup.hidden = true;
            this.location_config.add.popup.hidden = true;
        });

        this.location_config.base.add.addEventListener('click', this.openLocationAddOverlay.bind(this));

        this.location_config.add.close.addEventListener('click', this.openOverlay.bind(this));
        this.location_config.add.cancel.addEventListener('click', this.openOverlay.bind(this));
        this.location_config.add.form.addEventListener('submit', this.addLocationSubmit.bind(this));
        this.location_config.add.add.addEventListener('click', this.addFloor.bind(this));

        this.location_config.edit.close.addEventListener('click', this.openOverlay.bind(this));
        this.location_config.edit.cancel.addEventListener('click', this.openOverlay.bind(this));
        this.location_config.edit.form.addEventListener('submit', this.updateLocation.bind(this));
        this.location_config.edit.add.addEventListener('click', this.addFloor.bind(this));
    }

    openLocationAddOverlay(e) {
        e.preventDefault();

        this.location_config.base.popup.hidden = true;
        this.location_config.add.popup.hidden = false;
        this.location_config.edit.popup.hidden = true;

        const floor_wrapper = document.querySelector('.js-popup-locationsconfig--add .c-dropzone');
        [...floor_wrapper.children].forEach(el => el.classList.contains('remove') ? el.remove() : null);
    }

    openLocationEditOverlay(e) {
        e?.preventDefault();

        const location = this._activeLocation;

        this.location_config.base.popup.hidden = true;
        this.location_config.add.popup.hidden = true;
        this.location_config.edit.popup.hidden = false;

        document.getElementById('building-id').value = location._id;
        document.getElementById('building-name--edit').value = location.name;
        document.getElementById('building-shortname--edit').value = location.tag;
        const floor_wrapper = document.querySelector('.js-popup-locationsconfig--edit .c-dropzone');

        // Removes old elements
        [...floor_wrapper.children].forEach(el => el.classList.contains('remove') ? el.remove() : null);

        let html = '';
        location.floor_plans.forEach(floorPlan => {
            html += `<div class="c-dropzone__section remove">
                <div class="c-input c-dropzone__number">
                    <input class="c-input__field" type="number" name="floor[]" value="${floorPlan.tag}">
                </div>
                <input class="c-dropzone__file" type="file" name="floor_plan[]" accept=".svg">
                
                <button class="o-button-reset" onclick="this.parentElement.remove()">
                    <svg class="c-popup-close__icon" id="close-24px" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path id="Path_107" data-name="Path 107" d="M0,0H24V24H0Z" fill="none"/>
                        <path id="Path_108" data-name="Path 108" d="M18.3,5.71a1,1,0,0,0-1.41,0L12,10.59,7.11,5.7A1,1,0,0,0,5.7,7.11L10.59,12,5.7,16.89A1,1,0,0,0,7.11,18.3L12,13.41l4.89,4.89a1,1,0,0,0,1.41-1.41L13.41,12,18.3,7.11A1,1,0,0,0,18.3,5.71Z"/>
                    </svg>
                </button>
            </div>`;
        });

        floor_wrapper.insertAdjacentHTML('afterbegin', html);
    }

    async openOverlay(e) {
        if (e) { e.preventDefault(); }

        this.location_config.base.popup.hidden = false;
        this.location_config.add.popup.hidden = true;
        this.location_config.edit.popup.hidden = true;

        const data = await this.app.api.locations.getAll();
        if (data)
            this.renderLocations(data);
        else
            this.renderLocations([]);
    }

    /**
     * @param {Array} locations 
     */
    renderLocations(locations) {
        this.location_config.base.wrapper.innerHTML = locations.length === 0 ?
            'There are no locations registered, go and add some.' :
            '';

        this.locations = locations;

        locations.forEach(location => {
            let html = `<div class="c-card u-width-fit-content-bp1" id="${location._id}">
                <p class="c-card__title">
                    ${location.name}
                    <svg class="c-card__icon c-card__icon--edit" id="edit-24px" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path id="Path_116" data-name="Path 116" d="M0,0H24V24H0Z" fill="none"/>
                        <path id="Path_117" data-name="Path 117" d="M3,17.46V20.5a.5.5,0,0,0,.5.5H6.54a.469.469,0,0,0,.35-.15L17.81,9.94,14.06,6.19,3.15,17.1a.491.491,0,0,0-.15.36ZM20.71,7.04a1,1,0,0,0,0-1.41L18.37,3.29a1,1,0,0,0-1.41,0L15.13,5.12l3.75,3.75,1.83-1.83Z"/>
                    </svg>
                    <svg class="c-card__icon c-card__icon--delete" id="delete-24px_1_" data-name="delete-24px (1)" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path id="Path_114" data-name="Path 114" d="M0,0H24V24H0Z" fill="none"/>
                        <path id="Path_115" data-name="Path 115" d="M6,19a2.006,2.006,0,0,0,2,2h8a2.006,2.006,0,0,0,2-2V9a2.006,2.006,0,0,0-2-2H8A2.006,2.006,0,0,0,6,9ZM18,4H15.5l-.71-.71a1.009,1.009,0,0,0-.7-.29H9.91a1.009,1.009,0,0,0-.7.29L8.5,4H6A1,1,0,0,0,6,6H18a1,1,0,0,0,0-2Z"/>
                    </svg>
                </p>
                <ul class="o-list c-card__content">`;

            location.floor_plans.forEach(floorPlan => {
                html += `
                    <li class="c-floor">
                        <div class="c-floor__btn c-floor__btn--no-click o-button-reset js-btn-floor" data-floor="${floorPlan.tag}" data-location="${location.tag}">
                            <p class="c-floor__text ">Floor ${floorPlan.tag}</p>
                            <svg class="c-floor__icon c-floor__icon--delete" id="delete-24px_1_" data-name="delete-24px (1)" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path id="Path_114" data-name="Path 114" d="M0,0H24V24H0Z" fill="none"/>
                                <path id="Path_115" data-name="Path 115" d="M6,19a2.006,2.006,0,0,0,2,2h8a2.006,2.006,0,0,0,2-2V9a2.006,2.006,0,0,0-2-2H8A2.006,2.006,0,0,0,6,9ZM18,4H15.5l-.71-.71a1.009,1.009,0,0,0-.7-.29H9.91a1.009,1.009,0,0,0-.7.29L8.5,4H6A1,1,0,0,0,6,6H18a1,1,0,0,0,0-2Z"/>
                            </svg>
                        </div>
                    </li>`;
            });

            html += '</ul></div>';

            this.location_config.base.wrapper.insertAdjacentHTML('beforeend', html);

            const btnEdit = document.querySelector(`#${CSS.escape(location._id)} .c-card__icon--edit`);
            btnEdit.addEventListener('click', () => {
                this._activeLocation = location;

                this.openLocationEditOverlay();
            });

            const btnAdd = document.querySelector(`#${CSS.escape(location._id)} .c-card__icon--delete`);
        });
    }

    run() {
        this.domLookup();
    }

    async updateLocation(e) {
        e.preventDefault();

        const formData = new FormData(e.target);

        const popup = this.app.alerts.pushPopup('Updating Location', 'This might take a while...', false);

        await this.app.api.locations.updateFormData(formData);

        popup.close();

        this.openOverlay();
    }
}