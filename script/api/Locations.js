export default class Locations {
    constructor(api) {
        this.api = api;
    }

    get base() {
        return this.api.host + '/api/v1/locations';
    }

    async create(locationSchema) {
        const res = await this.api.post(this.base, locationSchema, {}, {
            authorization: this.api.getSession()
        });

        if (res.ok) return { succes: true, message: null };

        switch (res.status) {
            case 400:
                return { succes: false, message: 'Empty request body.' };

            case 403:
                return { succes: false, message: 'Session invalid, log-in again.' };

            case 406:
                return { succes: false, message: 'Invalid request body, required properties might be missing.' };
        
            default:
                return { succes: false, message: 'Unknown error occured when creating location.' };
        }
    }

    async getAll() {
        const res = await this.api.get(this.base, {}, {
            authorization: this.api.getSession()
        });

        if (res.ok) return {
                succes: true,
                data: await res.json()
            };
        return { succes: false, data: null };
    }

    update(query, update) {
        const res = await this.api.put(this.base, {
            query,
            update
        }, {}, {
            authorization: this.api.getSession()
        });

        if (res.ok) {
            return { succes: true, new: await res.json() };
        }

        switch (res.status) {
            case 400:
                return { succes: false, message: 'Empty request body or required data was missing.' };

            case 403:
                return { succes: false, message: 'Session invalid, log-in again.' };

            case 406:
                return { succes: false, message: 'Invalid request body, required properties might be missing.' };
        
            default:
                return { succes: false, message: 'Unknown error occured when creating location.' };
        }
    }
}