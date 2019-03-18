/*
    Author Info:

    Name(s) - Mark Riley, Ross Taggart, Aidan Marshall, Katie King
    Student Number - S1829984, S1828840, S1828601, S1827986
    Date Created - 25 / 02 / 2019
    Version - 1.0.1

    Description:
    JavaScript file which contains the functions and event handlers for the news system
 */

function newsVisualization(data, country, category) {

    var text = '';

    $.each(data.articles, function (key, val) {
        //Concatenates text string together from sources
        text = text + "" + val.title;
    });

    var lines = text.split(/[,\.\- ]+/g),
        data = Highcharts.reduce(lines, function (arr, word) {
            var obj = Highcharts.find(arr, function (obj) {
                return obj.name === word;
            });
            if (obj) {
                obj.weight += 1;
            } else {
                obj = {
                    name: word,
                    weight: 1
                };
                arr.push(obj);
            }
            return arr;
        }, []);

    var first25Data = data.slice(0, 24);



    Highcharts.chart('chart', {
        series: [{
            type: 'wordcloud',
            data: first25Data,
            name: 'Occurrences'
        }],
        title: {
            text: category + ' Headlines in ' + country,
        }
    });



} 
