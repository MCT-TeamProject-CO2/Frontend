export default class Users {
    constructor(api) {
        this.api = api;
    }

    get base() {
        return this.api.host + '/api/v1/users';
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

    async me() {
        const res = await this.api.get(this.base, { me: '' }, {
            authorization: this.api.getSession()
        });

        if (res.ok)
            return res.json();
        return null;
    }

    async update(query, update) {
        const res = await this.api.put(this.base, {
            query,
            update
        }, {}, {
            authorization: this.api.getSession()
        });

        if (res.ok) {
            const json = await res.json();

            if (!json.success) return json.data;

            this.api.user = json.data;

            return null;
        }
        return 'The user is no longer logged in.';
    }
}