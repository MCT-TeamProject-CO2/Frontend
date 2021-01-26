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

    async createFormData(formData) {
        if (!formData instanceof FormData) throw new Error('No FormData instance was passed.');

        const res = await this.api.post(this.base, formData, {}, {
            'authorization': this.api.getSession()
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

    async deleteLocation(q) {
        const res = await this.api.delete(this.base, q, {}, {
            authorization: this.api.getSession()
        });

        if (res.ok) return null;

        switch (res.status) {
            case 400:
                return 'Empty request body.';
        
            case 403:
                return 'Session invalid, log-in again.';

            case 406:
                return (await res.json).message;
        }
        return 'Unknown error occured.';
    }

    async deleteFloorPlan(tag, floor) {
        const res = await this.api.delete(this.base + '/floor', {
            tag,
            floor
        }, {}, {
            authorization: this.api.getSession()
        });

        if (res.ok) return null;

        switch (res.status) {
            case 400:
                return 'Empty response body or certain required body properties were missing.';

            case 403:
                return 'Sesion invalid, log-in again.';
        
            case 406:
                return (await res.json).message;
        }
        return 'Unknown error occured.';
    }

    async get(tag) {
        const res = await this.api.get(this.base, { tag }, {
            authorization: this.api.getSession()
        });

        if (res.ok) return res.json();
        return null;
    }

    async getAll() {
        const res = await this.api.get(this.base, {}, {
            authorization: this.api.getSession()
        });

        if (res.ok) return res.json();
        return null;
    }

    async getSVG(id) {
        const res = await this.api.get(this.base + '/svg', { id }, {
            authorization: this.api.getSession()
        });

        return res.text();
    }

    async update(query, update) {
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

    async updateFormData(formData) {
        if (!formData instanceof FormData) throw new Error('No FormData instance was passed.');

        const res = await this.api.put(this.base, formData, {}, {
            'authorization': this.api.getSession()
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