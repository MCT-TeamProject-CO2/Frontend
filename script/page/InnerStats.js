export default class InnerStats {
    constructor(app) {
        this.app = app;
    }

    domLookup() {
        this.graph_wrapper = document.querySelector('.js-graph');
        this.datalist = document.getElementById('rooms');
    }

    getData() {
        //possible req
        // endpoint = `http://localhost:8085/api/v1/data?room=BCE.A.1.000&datatype=Humidity`;
        // fetch(endpoint, {
        //         method: "GET",
        //         mode: "cors"
        //     })
        //     .then(res => res.json())
        //     .then(data => console.log(data));

        //testing data

        const data = {
            Humidity: [34, 33, 33, 32, 34, 35, 32, 34, 34, 33, 34, 33, 35, 33, 33, 33, 34, 34, 34, 34, 34, 35, 33, 32, 33, 33, 35, 34, 34, 32, 33, 33, 33, 32, 35, 33, 34, 34, 34, 34]
        };
    
        this.renderChart("Humidity", data);
    }

    async getRooms(q = '') {
        const results = await this.app.api.measurements.search(q);

        this.datalist.innerHTML = '';
        results.forEach(result => {
            this.datalist.innerHTML += '<option value="'+ result + '"/>';
        });
    }

    renderChart(dataType, data) {
        this.graph_wrapper.innerHTML = `<canvas class="c-chart js-graph-canvas" data-type="${dataType}"></canvas>`;

        const colors = [
            "#7350C7",
            "#524EDE",
            "#4A6BD4",
            "#A04EDE",
            "#BE4AD4",
            "#DE1BCE",
            "#A919D4",
            "#AA19FA",
            "#00FFFF",
            "#FF00FF",
            "#9400D3",
            "#1E90FF",
            "#7CFC00",
            "#00FF7F",
            "#CE27A4",
            "#E8217B",
            "#FDE74C",
            "#5BC0EB",
            "#EA4848"
        ];

        if (data.hasOwnProperty(dataType)) {
            const chart = document.querySelector(".js-graph-canvas").getContext("2d");
            // let gradientStroke = chart.createLinearGradient(0, 0, 0, double(chart.height));
            // gradientStroke.addColorStop(0, colors[Math.floor(Math.random() * colors.length)]);
            // gradientStroke.addColorStop(0.25, colors[Math.floor(Math.random() * colors.length)]);
            // gradientStroke.addColorStop(0.5, colors[Math.floor(Math.random() * colors.length)]);
            // gradientStroke.addColorStop(0.75, colors[Math.floor(Math.random() * colors.length)]);
            // gradientStroke.addColorStop(1, colors[Math.floor(Math.random() * colors.length)]);
            new Chart(chart, {
                type: 'line',
                data: {
                    labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
                    responsive: true,
                    maintainAspectRatio: false,
                    datasets: [{
                        label: "x-tag",
                        data: data[dataType],
                        pointBackgroundColor: "#44c8f5",
                        pointBorderWidth: 1,
                        fill: 0,
                        borderColor: "#44c8f5",
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: "y-tag",
                        fontColor: "#334DCC",
                        fontSize: 20,
                        padding: 8
                    },
                    legend: {
                        display: false
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                fontFamily: "trade-gothic-next",
                                fontColor: "#334DCC",
                                fontStyle: "400",
                                fontSize: 14
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                fontFamily: "trade-gothic-next",
                                fontColor: "#334DCC",
                                fontStyle: "400",
                                fontSize: 14
                            }
                        }]
                    }
                }
            });
        }
    }

    run() {
        this.domLookup();

        this.getRooms();
        this.getData();
    }
}