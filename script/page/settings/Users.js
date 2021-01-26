export default class Users {
    constructor(app) {
        this.app = app;
    }

    async addUserSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);

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

        const err = await this.app.api.users.disable(document.getElementById('disable-uuid').value);
        if (err)
            this.app.alerts.pushPopup('Disable User Failure', err);
        else
            this.app.alerts.pushPopup('Disable User', 'The user\'s account has been disabled.');

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
                    <button class="o-button-reset c-button c-button--red js-disable-account" type="button">Disable account</button>
                </div>
            </div>`;

            this.user_config.base.wrapper.insertAdjacentHTML('beforeend', html);

            document.querySelector(`#${CSS.escape(user.uid)} .js-reset-password`).addEventListener('click', (e) => {
                e.preventDefault();

                document.getElementById('reset-uuid').value = user.uid;

                this.openUserResetOverlay();
            });

            document.querySelector(`#${CSS.escape(user.uid)} .js-disable-account`).addEventListener('click', (e) => {
                e.preventDefault();

                document.getElementById('disable-uuid').value = user.uid;

                this.openDisableUserOverlay();
            });
        });
    }

    async resetUser(e) {
        e.preventDefault();

        const err = await this.app.api.users.resetPassword(document.getElementById('reset-uuid').value);
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