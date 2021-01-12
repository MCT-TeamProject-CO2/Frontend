export default class Login {
    constructor(app) {
        this.app = app;
    }

    domLookup() {
        this.form = document.querySelector('form');

        this.form.addEventListener('submit', this.onSubmit.bind(this));
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
        this.domLookup();
    }
}