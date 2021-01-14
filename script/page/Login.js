import { ApiHost } from '../util/Constants.js'

export default class Login {
    constructor(app) {
        this.app = app;
    }

    domLookup() {
        this.form = document.querySelector('form');
        
        const btnMs = document.querySelector('.c-button--microsoft');
        btnMs.addEventListener('click', this.msLogin.bind(this));

        this.form.addEventListener('submit', this.onSubmit.bind(this));
    }

    msLogin(e) {
        e.preventDefault();

        location = ApiHost + '/api/v1/auth/oauth2?redirect=' + encodeURIComponent(location.origin);
    }

    /**
     * @param {Event} e 
     */
    async onSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);

        const user = formData.get('username-email');
        const password = formData.get('password');
        const isEmail = user.includes('@');

        if (await this.app.api.auth.login(user, password, isEmail))
            this.app.router.navigate('home');
    }

    /**
     * Gets called when our document is ready
     */
    run() {
        const search = this.app.router.search;
        if (search.has('code')) {
            const code = search.get('code');

            history.pushState({}, "", "/");

            const popup = this.app.alerts.pushPopup('Microsoft Sign-in', 'Please wait while we\'re signing you in...', false);

            this.app.api.auth.oauth2(code).then(([success, data]) => {
                popup.close();

                if (success)
                    this.app.router.navigate('home');
                else
                    this.app.alerts.pushPopup('Sign-in failure', data, true);
            });
        }

        this.domLookup();
    }
}