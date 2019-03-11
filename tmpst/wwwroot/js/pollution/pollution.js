document.addEventListener('DOMContentLoaded', function () {
    Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Air contaminents at your location'
        },
        xAxis: {
            categories: ['Type of Contaminent']
        },
        yAxis: {
            title: {
                text: 'µg/m3'
            }
        },
        series: [{
            name: 'pm25',
            data: [1]
        },
        {
            name: 'pm10',
            data: [1]
        },
        {
            name: 'so2',
            data: [1]
        },
        {
            name: 'no2',
            data: [1]
        },
        {
            name: 'o3',
            data: [1]
        },
        {
            name: 'co',
            data: [1]
        },

        {
            name: 'bc',
            data: [5]

        }],
    });
});