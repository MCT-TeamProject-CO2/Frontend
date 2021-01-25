import { PermissionLevels } from '../util/Constants.js'
import Locations from './settings/Locations.js'
import Users from './settings/Users.js'

export default class InnerSettings {
    constructor(app) {
        this.app = app;

        this.locations = new Locations(app);
        this.users = new Users(app);
    }

    domLookup() {
        // User Settings
        const user_form = document.querySelector('form');
        user_form.addEventListener('submit', this.updateUser.bind(this));

        this.email = document.getElementById('email');
        this.phone = document.getElementById('phone');
        this.old_pass = document.getElementById('old-pass');
        this.new_pass = document.getElementById('new-pass');
        this.confirm_pass = document.getElementById('confirm-pass');

        // Admin Settings
        this.admin_wrapper = document.querySelector('.js-settings-admin');
        const admin_form = document.querySelector('.js-settings-admin form');
        admin_form.addEventListener('submit', this.updateSettings.bind(this));

        this.oauth2_only = document.getElementById('toggle-ms-login');

        this.co2 = {};
        this.co2.yellow = document.getElementById('co2-yellow');
        this.co2.red = document.getElementById('co2-red');

        const refresh_plugs = document.querySelector('.js-refresh-plugs');
        refresh_plugs.addEventListener('click', this.refreshPlugs.bind(this));
    }

    async showAdminSettings() {
        if (PermissionLevels.indexOf(this.user.permission) < PermissionLevels.indexOf('admin')) return;
    
        // Only start this class after confirming the user's permission level
        this.locations.run();
        this.users.run();

        this.admin_wrapper.hidden = false;

        const settings = await this.app.api.settings.get();

        this.oauth2_only.checked = settings.config.disableNormalLogin;

        this.co2.yellow.value = settings.config.ppmThresholds.orange;
        this.co2.red.value =  settings.config.ppmThresholds.red;
    }

    showUserSettings() {
        this.email.value = this.user.email;
        this.phone.value = this.user.phone ? this.user.phone : '';
    }

    async refreshPlugs(e) {
        e.preventDefault();

        const restore = e.target.innerText;
        e.target.innerText = 'Refreshing...';

        await this.app.api.smartplugs.refresh();

        e.target.innerText = restore;
    }

    async run() {
        this.domLookup();

        this.user = await this.app.api.getUser();
        if (!this.user) this.app.router.active.logout();

        this.showAdminSettings();
        this.showUserSettings();
    }

    async updateSettings(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const disableNormalLogin = this.oauth2_only.checked;
        const ppmThresholds = {
            orange: parseInt(formData.get('co2-yellow')),
            red: parseInt(formData.get('co2-red'))
        };

        const succes = await this.app.api.settings.update({
            disableNormalLogin,
            ppmThresholds
        });

        if (succes)
            this.app.alerts.pushPopup('Saved', 'Settings have been updated.');
        else
            this.app.alerts.pushPopup('Failed', 'Do you have permission to update the settings?');
    }

    async updateUser(e) {
        e.preventDefault();

        let update = { email: this.email.value };

        if (this.old_pass.value.length > 6 ||
            this.new_pass.value.length > 6 ||
            this.confirm_pass.value.length > 6)
        {
            if (this.new_pass.value !== this.confirm_pass.value) {
                this.app.alerts.pushPopup('Profile Update', 'New Password and Confirm Password do not match.')

                return;
            }

            Object.assign(update, {
                old_password: this.old_pass.value,
                password: this.new_pass.value 
            });
        }

        if (this.phone.value !== '') Object.assign(update, { phone_number: this.phone.value });

        const err = await this.app.api.users.update({
            uid: this.user.uid
        }, update);

        if (!err)
            this.app.alerts.pushPopup('Profile Update', 'Saved profile settings!');
        else
            this.app.alerts.pushPopup('Profile Update', err);

        e.target.reset();

        this.showUserSettings();
    }
}