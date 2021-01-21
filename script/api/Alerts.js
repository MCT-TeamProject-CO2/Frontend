export default class Alerts {
    constructor(api) {
        this.api = api;
    }

    get base() {
        return this.api.host + '/api/v1/alerts';
    }

    async get() {
        const res = await this.api.get(this.base, {}, {
            authorization: this.api.getSession()
        });

        if (res.ok) {
            return {
                succes: true,
                data: await res.json()
            };
        }

        switch (res.status) {
            case 403:
                return {
                    succes: false,
                    data: 'The user is no longer logged in.'
                };
        }
    }
}