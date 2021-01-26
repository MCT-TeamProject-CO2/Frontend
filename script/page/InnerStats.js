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

        this.renderChart("Humidity", data[tagString], tagString);
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
        }
    }

    formatTime(time) {
        return time < 10 ? "0" + time : time;
    }

    renderChart(label, data, room) {
        if (!data) return this.graph_wrapper.innerHTML = 'There\'s no data available for this room.';

        this.graph_wrapper.innerHTML = `<canvas class="c-chart__graph js-graph-canvas"></canvas>`;

        const labels = [];
        const dataPoints = [];

        data.forEach(dataPoint => {
            const date = new Date(dataPoint._time);
            if (date.getDay() - (date.getDay() - 1) > 0)
                var labelString = `${this.formatTime(date.getHours())}:${this.formatTime(date.getMinutes())}`;
            else {
                var labelString = `${this.formatTime(date.getDate())}/${this.formatTime(date.getMonth()+1)}/${date.getFullYear()}`;
            }

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
        this.getData();
    }
}