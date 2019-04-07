function createPollutionChart(data) {

    console.log(data.results);


    // Arrays for different emmisions
        //name: 'pm25',
        //name: 'pm10',
        //name: 'so2',
        //name: 'no2',
        //name: 'o3',
        //name: 'co',
        //name: 'bc',


    let seriesArray = [0,0,0,0,0,0,0];

    $(data.results).each(function (key, val) {

        switch (val.parameter) {
            case "pm25":
                seriesArray[0] += val.value;
                break;
            case "pm10":
                seriesArray[1] += val.value;
                break;
            case "so2":
                seriesArray[2] += val.value;
                break;
            case "no2":
                seriesArray[3] += val.value;
                break;
            case "o3":
                seriesArray[4] += val.value;
                break;
            case "co":
                seriesArray[5] += val.value;
                break;
            case "bc":
                seriesArray[6] += val.value;
                break;
            default:
            // code block
        }
    });

    //$(seriesArray).each(function (key, val) {


        
    //});

    

    console.log("SERIES ARRAY--", seriesArray);
       

    Highcharts.chart('pollution-chart', {
        chart: {
            type: 'bar'
        },

        title: {
            text: ''
        },
        plotOptions: {
            bar: {
                minPointLength: 5,
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        if (this.y > 0)
                            return this.y;
                    }
                }
            }
        },
        xAxis: {
            categories: ['Type of Contaminent']
        },
        yAxis: {
            title: {
                text: 'µg/m3'
            }
        },
        series:[{
            name: 'pm25',
            data: [seriesArray[0]]
        },
        {
            name: 'pm10',
            data: [seriesArray[1]]
        },
        {
            name: 'so2',
            data: [seriesArray[2]]
        },
        {
            name: 'no2',
            data: [seriesArray[3]]
        },
        {
            name: 'o3',
            data: [seriesArray[4]]
        },
        {
            name: 'co',
            data: [seriesArray[5]]
        },

        {
            name: 'bc',
            data: [seriesArray[6]]

        }],
    });

    $('#pollution-chart-result-container').fadeIn(300);
}



    
