export default class SmartPlugs {
    constructor(api) {
        this.api = api;
    }

    get base() {
        return this.api.host + '/api/v1/smartplugs';
    }

    async refresh() {
        const res = await this.api.post(this.base, {}, {}, {
            authorization: this.api.getSession()
        });

        return res.ok;
    }
}