import InnerFloor from './InnerFloor.js';
import InnerHome from './InnerHome.js'
import InnerSettings from './InnerSettings.js'
import InnerStats from './InnerStats.js'

export default class Home {
    constructor(app) {
        this.app = app;

        this.app.router.registerInner('floor', new InnerFloor(app));
        this.app.router.registerInner('home', new InnerHome(app));
        this.app.router.registerInner('settings', new InnerSettings(app));
        this.app.router.registerInner('stats', new InnerStats(app));
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
        e.preventDefault();

        const el = e.currentTarget;

        if (this.app.router.innerPath == el.dataset.pageType) return;

        switch (el.dataset.pageType) {
            case 'logout':
                history.pushState({}, "", "/");

                return this.logout();
            default:
                this.app.router.navigateInner(el.dataset.pageType);

                break;
        }
    }

    run() {
        this.domLookUp();

        const route = location.hash.split('/')[1];

        this.app.router.navigateInner(route ? route : 'home');
    }
}