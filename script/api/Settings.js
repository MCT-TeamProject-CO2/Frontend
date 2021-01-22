export default class Settings {
    constructor(api) {
        this.api = api;
    }

    get base() {
        return this.api.host + '/api/v1/settings';
    }

    async get() {
        const res = await this.api.get(this.base, {}, {
            authorization: this.api.getSession()
        });

        if (res.ok)
            return res.json();
        return null;
    }

    async update(config) {
        console.log(config);

        const res = await this.api.post(this.base, config, {}, {
            authorization: this.api.getSession()
        });

        if (res.ok)
            return res.json();
        return null;
    }
}