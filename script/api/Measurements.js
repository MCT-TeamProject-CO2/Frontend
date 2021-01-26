export default class Measurements {
    constructor(api) {
        this.api = api;
    }

    get base() {
        return this.api.host + '/api/v1/measurements';
    }

    /**
     * Fetches measurements for a given room with a time delta from Date.now()
     * @param {string} tagString The identifier of the room
     * @param {number} [delta = 10] The delta in minutes to fetch data for
     * @param {Array<string>} [fields = []] An array of strings to filter which fields to return
     * @param {string} [aggregate = '5s'] Group data by an interval (s, m, d, ...)
     * @param {boolean} [mean = true] If the results should be returned as their mean values or not
     */
    async getDelta(tagString, delta = 10, fields = [], aggregate = '5s', mean = true) {
        fields = fields.join(',');

        const res = await this.api.get(this.base, {
            tagString,
            delta,
            fields,
            aggregate,
            mean
        }, {
            authorization: this.api.getSession()
        });

        if (res.ok) return res.json();
        return null;
    }

    /**
     * Fetches measurements for a given room with a time from a given time frame
     * @param {string} tagString The identifier of the room
     * @param {Date} start The start date to fetch data from
     * @param {Date} end the end date to fetch data from
     * @param {Array<string>} [fields = []] An array of strings to filter which fields to return
     * @param {string} [aggregate = '5s'] Group data by an interval (s, m, d, ...)
     * @param {boolean} [mean = true] If the results should be returned as tehir mean values or not
     */
    async getTimeRange(tagString, start, end, fields = [], aggregate = '5s', mean = true) {
        fields = fields.join(',');
        start = start.getTime();
        end = end.getTime();

        const res = await this.api.get(this.base, {
            tagString,
            start,
            end,
            fields,
            aggregate,
            mean
        }, {
            authorization: this.api.getSession()
        });

        if (res.ok) return res.json();
        return null;
    }

    /**
     * Search for rooms containing measurements on the InfluxDB
     * @param {string} q The query to search for
     */
    async search(q = '') {
        const res = await this.api.get(this.base + '/search', { q }, {
            authorization: this.api.getSession()
        });

        if (res.ok) return res.json();
        return [];
    }
}