export default class InnerStats {
    constructor(app) {
        this.app = app;
    }

    domLookup() {
        this.graph_wrapper = document.querySelector('.js-graph');
        this.datalist = document.getElementById('rooms');

        const timeType = document.querySelector('.js-time-type');
        timeType.addEventListener('change', this.onTimeTypeChange.bind(this));

        this.time = {
            start: document.getElementById('time-start'),
            end: document.getElementById('time-end')
        };
    }

    async getData(tagString = this.rooms[Math.floor(Math.random() * this.rooms.length)]) {
        if (!tagString) return this.graph_wrapper.innerHTML = '<p>Please select a room</p>';

        const data = await this.app.api.measurements.getDelta(tagString, 10, ['humidity']);
    
        this.renderChart("Humidity", data[tagString]);
    }

    async getRooms(q = '') {
        const results = await this.app.api.measurements.search(q);

        this.datalist.innerHTML = '';
        results.forEach(result => {
            this.datalist.innerHTML += '<option value="'+ result + '"/>';
        });

        return results;
    }

    onTimeTypeChange(e) {
        e.preventDefault();

        const el = e.target;

        if (el.value == -1) {
            this.time.start.parentElement.parentElement.hidden = false;
            this.time.end.parentElement.parentElement.hidden = false;
        }
        else {
            this.time.start.parentElement.parentElement.hidden = true;
            this.time.end.parentElement.parentElement.hidden = true;
        }
    }

    renderChart(label, data) {
        if (!data) return this.graph_wrapper.innerHTML = 'There\'s no data available for this room.';

        this.graph_wrapper.innerHTML = `<canvas class="c-chart js-graph-canvas"></canvas>`;

        const labels = [];
        const dataPoints = [];

        data.forEach(dataPoint => {
            labels.push(dataPoint._time);
            
            dataPoints.push(dataPoint._value);
        });

        const ctx = document.querySelector('.js-graph-canvas');
        this.chart = new Chart(ctx, {
            type: 'line',

            data: {
                labels,
                datasets: [{
                    label,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: dataPoints
                }]
            }
        });

        // Open Sans
    }

    async run() {
        this.domLookup();

        this.rooms = await this.getRooms();
        this.getData();
    }
}