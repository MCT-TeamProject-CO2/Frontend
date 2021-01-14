export default class Home {
    _active = 'home';

    constructor(app) {
        this.app = app;
    }

    get active() {
        return this._active;
    }

    domLookUp() {
        const navItems = document.querySelectorAll('.c-main-nav__list .c-main-nav__item');
        navItems.forEach(navItem =>
            navItem.addEventListener(
                'click',
                this.navItemClicked.bind(this)
            )
        );
    }

    navItemClicked(e) {
        const el = e.currentTarget;

        if (this.active == el.dataset.pageType) return;

        this._active = el.dataset.pageType;

        switch (this._active) {
            case 'logout':
                return this.logout();

            case 'home':

                break;
        }
    }

    logout(e) {
        this.app.api.auth.revoke();
        this.app.router.navigate('login');
    }

    run() {
        this.domLookUp();
    }
}