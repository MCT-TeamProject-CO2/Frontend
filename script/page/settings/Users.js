import { PermissionLevels } from '../../util/Constants.js';

export default class Users {
    constructor(app) {
        this.app = app;
    }

    async addUserSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);

        const currUser = await this.app.api.users.me();
        if (PermissionLevels.indexOf(currUser.permission) < PermissionLevels.indexOf(formData.get('permission-level')))
            return this.app.alerts.pushPopup('User Creation Failure', 'The permission level selected for the user is higher than your own.')

        const userSchema = this.oauth2_disabled.checked
            ? {
                email: formData.get('email'),
                type: 'oauth2',
                permission: formData.get('permission-level')
            }
            : {
                email: formData.get('email'),
                type: 'normal',
                username: formData.get('username-email'),
                password: formData.get('password'),
                permission: formData.get('permission-level')
            };

        const phone_number = formData.get('phone');
        if (phone_number && phone_number.length > 4)
            Object.assign(userSchema, { phone_number });

        const err = await this.app.api.users.addUser(userSchema);

        if (err)
            this.app.alerts.pushPopup('User Creation Failure', err);
        else
            this.app.alerts.pushPopup('User Created', 'User created successfully!');

        this.openOverlay();
    }

    disableOauth2(e) {
        e.preventDefault();

        const hide = e.target.checked;

        document.querySelectorAll('.js-hide').forEach(el => el.hidden = hide);
    }

    async disableUser(e) {
        e.preventDefault();

        const err = await this.app.api.users.disable(this._activeUser.uid, !this._activeUser.disabled);
        if (err)
            this.app.alerts.pushPopup(`${this._activeUser.disabled ? 'Re-enable' : 'Disable'} User Failure`, err);
        else
            this.app.alerts.pushPopup(`${this._activeUser.disabled ? 'Re-enable' : 'Disable'} User`, `The user's account has been ${this._activeUser.disabled ? 'enabled' : 'disabled'}.`);

        this.openOverlay();
    }

    domLookup() {
        const btn = document.querySelector('.js-configure-users');
        btn.addEventListener('click', this.openOverlay.bind(this));

        this.user_config = {
            base: {
                popup: document.querySelector('.js-popup-usersconfig'),
                wrapper: document.querySelector('.js-popup-usersconfig .c-popup__content'),
                close: document.querySelector('.js-popup-usersconfig .c-popup-close'),
                add: document.querySelector('.js-popup-usersconfig .c-add')
            },
            add: {
                popup: document.querySelector('.js-popup-usersconfig--add'),
                wrapper: document.querySelector('.js-popup-usersconfig--add .c-popup__content'),
                close: document.querySelector('.js-popup-usersconfig--add .c-popup-close'),
                cancel: document.querySelector('.js-popup-usersconfig--add .c-button--grey'),
                form: document.querySelector('.js-popup-usersconfig--add form')
            },
            reset: {
                popup: document.querySelector('.js-popup-usersconfig--reset'),
                wrapper: document.querySelector('.js-popup-usersconfig--reset .c-popup__content'),
                close: document.querySelector('.js-popup-usersconfig--reset .c-popup-close'),
                cancel: document.querySelector('.js-popup-usersconfig--reset .c-button--grey'),
                form: document.querySelector('.js-popup-usersconfig--reset form')
            },
            disable: {
                popup: document.querySelector('.js-popup-usersconfig--disable-enable'),
                wrapper: document.querySelector('.js-popup-usersconfig--disable-enable .c-popup__content'),
                close: document.querySelector('.js-popup-usersconfig--disable-enable .c-popup-close'),
                cancel: document.querySelector('.js-popup-usersconfig--disable-enable .c-button--grey'),
                submitBtn: document.querySelector('.js-popup-usersconfig--disable-enable form .c-button--red'),
                title: document.querySelector('.js-popup-usersconfig--disable-enable .c-card__title'),
                form: document.querySelector('.js-popup-usersconfig--disable-enable form')
            }
        };

        this.user_config.base.close.addEventListener('click', () => {
            this.user_config.add.popup.hidden = true;
            this.user_config.reset.popup.hidden = true;
            this.user_config.disable.popup.hidden = true;
            this.user_config.base.popup.hidden = true;
        });

        this.user_config.base.add.addEventListener('click', this.openAddUserOverlay.bind(this));

        this.user_config.add.close.addEventListener('click', this.openOverlay.bind(this));
        this.user_config.add.cancel.addEventListener('click', this.openOverlay.bind(this));
        this.user_config.add.form.addEventListener('submit', this.addUserSubmit.bind(this));

        this.user_config.reset.close.addEventListener('click', this.openOverlay.bind(this));
        this.user_config.reset.cancel.addEventListener('click', this.openOverlay.bind(this));
        this.user_config.reset.form.addEventListener('submit', this.resetUser.bind(this));

        this.user_config.disable.close.addEventListener('click', this.openOverlay.bind(this));
        this.user_config.disable.cancel.addEventListener('click', this.openOverlay.bind(this));
        this.user_config.disable.form.addEventListener('submit', this.disableUser.bind(this));

        this.oauth2_disabled = document.getElementById('adduser--oauth2-only');
        this.oauth2_disabled.addEventListener('change', this.disableOauth2.bind(this));
    }

    openAddUserOverlay(e) {
        if (e) { e.preventDefault(); }


        this.user_config.add.popup.hidden = false;
        this.user_config.reset.popup.hidden = true;
        this.user_config.disable.popup.hidden = true;
        this.user_config.base.popup.hidden = true;
    }

    openDisableUserOverlay(e) {
        if (e) { e.preventDefault(); }

        this.user_config.disable.submitBtn.classList.toggle('c-button--red', !this._activeUser.disabled);
        this.user_config.disable.submitBtn.innerHTML = this._activeUser.disabled ? 'Enable' : 'Disable';
        this.user_config.disable.title.innerText = this._activeUser.disabled ? 'Re-enable user' : 'Disable user';

        this.user_config.add.popup.hidden = true;
        this.user_config.reset.popup.hidden = true;
        this.user_config.disable.popup.hidden = false;
        this.user_config.base.popup.hidden = true;
    }

    async openOverlay(e) {
        if (e) { e.preventDefault(); }


        this.user_config.add.popup.hidden = true;
        this.user_config.reset.popup.hidden = true;
        this.user_config.disable.popup.hidden = true;
        this.user_config.base.popup.hidden = false;

        const { success, data } = await this.app.api.users.get();
        if (success)
            this.renderUsers(data);
        else
            this.renderUsers([]);
    }

    openUserResetOverlay(e) {
        if (e) { e.preventDefault(); }

        this.user_config.add.popup.hidden = true;
        this.user_config.reset.popup.hidden = false;
        this.user_config.disable.popup.hidden = true;
        this.user_config.base.popup.hidden = true;
    }

    renderUsers(data) {
        this.user_config.base.wrapper.innerHTML = data.length === 0 ? 'No users found.' : '';

        data.forEach(user => {
            const html = `<div class="c-card u-max-width-sm-bp1" id="${user.uid}">
                <p class="c-card__title">${user.email}</p>
                <div class="c-card__content">
                    <button class="o-button-reset c-button js-reset-password" type="button">Reset password</button>
                    <button class="o-button-reset c-button ${user.disabled ? '' : 'c-button--red'} js-disable-account" type="button">${user.disabled ? 'Re-enable' : 'Disable'} account</button>
                </div>
            </div>`;

            this.user_config.base.wrapper.insertAdjacentHTML('beforeend', html);

            document.querySelector(`#${CSS.escape(user.uid)} .js-reset-password`).addEventListener('click', (e) => {
                e.preventDefault();

                this._activeUser = user;

                this.openUserResetOverlay();
            });

            document.querySelector(`#${CSS.escape(user.uid)} .js-disable-account`).addEventListener('click', (e) => {
                e.preventDefault();

                this._activeUser = user;

                this.openDisableUserOverlay();
            });
        });
    }

    async resetUser(e) {
        e.preventDefault();

        const err = await this.app.api.users.resetPassword(this._activeUser.uid);
        if (err)
            this.app.alerts.pushPopup('Reset User Failure', err);
        else
            this.app.alerts.pushPopup('Reset User', 'The user\'s account password has been reset.');

        this.openOverlay();
    }

    run() {
        this.domLookup();
    }
}