import { PermissionLevels } from '../util/Constants.js'

export default class InnerSettings {
    constructor(app) {
        this.app = app;
    }

    domLookup() {
        // User Settings
        this.email = document.getElementById('email');
        this.phone = document.getElementById('phone');
        this.new_pass = document.getElementById('new-pass');
        this.confirm_pass = document.getElementById('confirm-pass');

        this.admin_wrapper = document.querySelector('.js-settings-admin');
        const admin_form = document.querySelector('.js-settings-admin form');
        admin_form.addEventListener('submit', this.updateSettings.bind(this));

        // Admin Settings
        this.oauth2_only = document.getElementById('toggle-ms-login');

        this.co2 = {};
        this.co2.yellow = document.getElementById('co2-yellow');
        this.co2.red = document.getElementById('co2-red');
    }

    fillUserSettings() {

    }

    async showAdminSettings() {
        if (PermissionLevels.indexOf(this.user.permission) < PermissionLevels.indexOf('admin')) return;
    
        this.admin_wrapper.hidden = false;

        const settings = await this.app.api.settings.get();

        this.oauth2_only.checked = settings.config.disableNormalLogin;

        this.co2.yellow.value = settings.config.ppmThresholds.orange;
        this.co2.red.value =  settings.config.ppmThresholds.red;
    }

    async run() {
        this.domLookup();

        this.user = await this.app.api.getUser();
        if (!this.user) this.app.router.active.logout();

        this.showAdminSettings();
        this.fillUserSettings();
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
}