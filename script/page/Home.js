import InnerFloor from './InnerFloor.js';
import InnerHome from './InnerHome.js'

export default class Home {
    _active;

    constructor(app) {
        this.app = app;

        this.app.router.registerInner('floor', new InnerFloor(app));
        this.app.router.registerInner('home', new InnerHome(app));
        //this.app.router.registerInner('settings', new InnerSettings(app));
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

    logout(e) {
        this.app.api.auth.revoke();
        this.app.router.navigate('login');
    }

    navItemClicked(e) {
        const el = e.currentTarget;

        if (this.active == el.dataset.pageType) return;

        this._active = el.dataset.pageType;

        switch (this._active) {
            case 'logout':
                e.preventDefault();

                history.pushState({}, "", "/");

                return this.logout();
            default:
                this.app.router.navigateInner(this._active);

                break;
        }
    }

    run() {
        this.domLookUp();

        const route = location.hash.split('/')[1];

        this.app.router.navigateInner(route ? route : 'home');
    }
}