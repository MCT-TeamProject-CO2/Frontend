export default class Home {
    constructor(app) {
        this.app = app;
    }

    domLookUp() {
        const btnLogout = document.querySelector('.js-btn-logout');
        btnLogout.addEventListener('click', this.logout.bind(this));
    }

    logout(e) {
        e.preventDefault();

        this.app.api.auth.revoke();
        this.app.router.navigate('login');
    }

    run() {
        this.domLookUp();
    }
}