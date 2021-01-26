import { TimeTypes } from '../util/Constants.js'

export default class InnerStats {
    constructor(app) {
        this.app = app;
    }

    customRangeTimeChange(e) {
        e.preventDefault();

        const startDate = new Date(this.time.start.value);
        const endDate = new Date(this.time.end.value);

        if (startDate === 'Invalid Date' || endDate === 'Invalid Date') return;
        if (endDate - startDate < 0) return;

        const options = Object.assign({}, this.active, {
            timeType: -1,
            start: startDate,
            end: endDate
        });
        this.fetchRoomData(options);
    }

    domLookup() {
        this.graph_wrapper = document.querySelector('.js-graph');
        this.datalist = document.getElementById('rooms');

        const timeType = document.querySelector('.js-time-type');
        timeType.addEventListener('change', this.onTimeTypeChange.bind(this));

        const selectType = document.querySelector('.js-select-type');
        selectType.addEventListener('change', this.onSelectTypeChange.bind(this));

        this.time = {
            start: document.getElementById('time-start'),
            end: document.getElementById('time-end')
        };
        this.time.start.addEventListener('change', this.customRangeTimeChange.bind(this));
        this.time.end.addEventListener('change', this.customRangeTimeChange.bind(this));

        const form = document.querySelector('.c-form');
        form.addEventListener('submit', this.searchRoom.bind(this));

        this.room = {
            title: document.querySelector('.js-room .c-card__title'),
            measurements: document.querySelector('.js-room .c-measurements')
        };
    }

    /**
     * 
     * @param {{
     *  tagString: string,
     *  dataType: string,
     *  timeType: number,
     *  start: string,
     *  end: string
     * }} options 
     */
    async fetchRoomData(options) {
        this.active = options;

        const { tagString, dataType, timeType, start, end } =  options;

        if (!tagString) return this.graph_wrapper.innerHTML = '<p>Please select a room</p>';

        this.updateRoomCard(tagString);

        let data;
        if (timeType == -1) {
            const startDate = new Date(start);
            const endDate = new Date(end);

            if (startDate === 'Invalid Date' || endDate === 'Invalid Date') return this.app.alerts.pushPopup('Statistics', 'Invalid Time given.');
            if (endDate - startDate < 0) return this.app.alerts.pushPopup('Statistics', 'Start date comes before end date.');

            data = await this.app.api.measurements.getTimeRange(tagString, startDate, endDate, [dataType], Math.floor((endDate - startDate) / 6e4 / 48) + 'm');
        }
        else {
            const TimeType = TimeTypes[timeType]

            data = await this.app.api.measurements.getDelta(tagString, TimeType.delta, [dataType], TimeType.aggregate);
        }

        data = data[tagString];

        this.renderChart(tagString, dataType, data);
    }

    formatTime(time) {
        return time < 10 ? "0" + time : time;
    }

    async getRooms(q = '') {
        const results = await this.app.api.measurements.search(q);

        this.datalist.innerHTML = '';
        results.forEach(result => {
            this.datalist.innerHTML += '<option value="' + result + '"/>';
        });

        return results;
    }

    onTimeTypeChange(e) {
        e.preventDefault();

        const el = e.target;

        if (el.value == -1) {
            this.time.start.parentElement.parentElement.hidden = false;
            this.time.end.parentElement.parentElement.hidden = false;
        } else {
            this.time.start.parentElement.parentElement.hidden = true;
            this.time.end.parentElement.parentElement.hidden = true;

            const options = Object.assign({}, this.active, { timeType: el.value });
            this.fetchRoomData(options);
        }
    }

    onSelectTypeChange(e) {
        e.preventDefault();

        const el = e.target;

        const options = Object.assign({}, this.active, { dataType: el.value });
        this.fetchRoomData(options);
    }

    /**
     * 
     * @param {string} room The room for which the chart is rendered
     * @param {string} label The label for the data on the chart
     * @param {Array<{
     *  _time: Date,
     *  _value: number
     * }>} data The data to be processed and rendered
     */
    renderChart(room, label, data) {
        if (!data) return this.graph_wrapper.innerHTML = 'There\'s no data available for this room.';

        this.graph_wrapper.innerHTML = `<canvas class="c-chart__graph js-graph-canvas"></canvas>`;

        const labels = [];
        const dataPoints = [];

        const is24h = (new Date(data[data.length - 1]._time) - new Date(data[0]._time)) < 864e5; 

        data.forEach(dataPoint => {
            const date = new Date(dataPoint._time);
            const labelString = is24h
                ? `${this.formatTime(date.getHours())}:${this.formatTime(date.getMinutes())}`
                : `${this.formatTime(date.getDate())}/${this.formatTime(date.getMonth()+1)}/${date.getFullYear()}`;

            labels.push(labelString);

            dataPoints.push(dataPoint._value);
        });

        const ctx = document.querySelector('.js-graph-canvas');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                responsive: true,
                maintainAspectRatio: true,
                datasets: [{
                    label: label,
                    data: dataPoints,
                    pointBackgroundColor: "#44c8f5",
                    pointBorderWidth: 0,
                    backgroundColor: "#44c8f533",
                    borderColor: "#44c8f5"
                }]
            },
            options: {
                title: {
                    display: true,
                    text: room,
                    fontColor: "var(--global-color-background)",
                    fontSize: "16",
                    padding: 8
                },
                legend: {
                    display: false
                },
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            fontFamily: "Open Sans",
                            fontStyle: "400",
                            fontSize: 14
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontFamily: "Open Sans",
                            fontStyle: "400",
                            fontSize: 14
                        }
                    }]
                }
            }
        });

        // Open Sans
    }

    async run() {
        this.domLookup();

        this.rooms = await this.getRooms();

        const tagString = this.rooms[Math.floor(Math.random() * this.rooms.length)];
        this.fetchRoomData({
            tagString,
            dataType: 'co2eq_ppm',
            timeType: 1
        });
    }

    searchRoom(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const query = formData.get('room-search');

        const result = this.rooms.filter(room => room.includes(query));
        
        const options = Object.assign({}, this.active, {
            tagString: result[0]
        });
        this.fetchRoomData(options);
    }

    /**
     * 
     * @param {string} room 
     * @param {Object} data 
     */
    async updateRoomCard(room) {
        this.room.title.innerHTML = room;

        const result = await this.app.api.measurements.getDelta(room, 1, ['co2eq_ppm', 'humidity', 'temperature', 'tvoc_ppb'], '1m');

        if (!result || !result[room]) {
            this.room.measurements.innerHTML = '<li><p>No recent data available for this room.</p></li>'

            return;
        }

        const data = {};
        for (const obj of result[room])
            data[obj._field] = obj._value;

        const humidity = data.humidity ? Math.round(data.humidity * 100) / 100 : '—';
        const temperature = data.temperature ? Math.round(data.temperature * 100) / 100 : '—';
        const co2 = data.co2eq_ppm ? Math.round(data.co2eq_ppm * 100) / 100 : '—';
        const tvoc = data.tvoc_ppb ? Math.round(data.tvoc_ppb * 100) / 100 : '—';

        this.room.measurements.innerHTML = `<li class="c-measurements__item ">
            <p>Humidity</p>
            <p>${humidity}%</p>
        </li>
        <li class="c-measurements__item ">
            <p>Temperature</p>
            <p>${temperature} °C</p>
        </li>
        <li class="c-measurements__item ">
            <p>CO2</p>
            <p>${co2} ppm</p>
        </li>
        <li class="c-measurements__item ">
            <p>TVOC</p>
            <p>${tvoc} ppb</p>
        </li>`;
    }
}