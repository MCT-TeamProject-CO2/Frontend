export default class Users {
    constructor(api) {
        this.api = api;
    }

    get base() {
        return this.api.host + '/api/v1/users';
    }

    async addUser(userSchema) {
        const res = await this.api.post(this.base, userSchema, {}, {
            authorization: this.api.getSession()
        });

        if (res.ok) return null;

        switch (res.status) {
            case 403:
                return 'You don\'t have permission to create users.';

            case 406:
                const json = await res.json();
                return json.message;
        }
    }

    async delete(uid, password) {
        const res = await this.api.delete(this.base + '/delete', {
            query: { uid },
            password
        }, {}, {
            authorization: this.api.getSession()
        });

        if (res.ok) return null;

        switch (res.status) {
            case 400:
                return 'Empty request body or required properties were missing.';
        
            case 403:
                return 'You do not have permission to make this action';

            case 406:
                return (await res.json()).message;
        }

        return 'Unknown error occurred.';
    }

    async disable(uid, toggle) {
        const res = await this.api.put(this.base, {
            query: { uid },
            update: { disabled: toggle }
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

    async get() {
        const res = await this.api.get(this.base, {}, {
            authorization: this.api.getSession()
        });

        if (res.ok) {
            return {
                success: true,
                data: await res.json()
            };
        }

        switch (res.status) {
            case 403:
                return {
                    success: false,
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

    async resetPassword(uid) {
        const res = await this.api.post(this.base + '/reset', {
            query: { uid }
        }, {}, {
            authorization: this.api.getSession()
        });

        const json = await res.json();
        if (res.ok) {
            if (json.success) return null;
            return json.data;
        }
        return json.message;
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

        switch (res.status) {
            case 406:
                const json = await res.json();

                return json.message;
        }

        return 'The user is no longer logged in.';
    }
}