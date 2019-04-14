/*
    Author Info:

    Name(s) - Mark Riley, Ross Taggart, Aidan Marshall, Katie King
    Student Number - S1829984, S1828840, S1828601, S1827986
    Date Created - 25 / 02 / 2019
    Version - 1.0.1

    Description:
    JavaScript file which contains the functions and event handlers for the news system
 */

function wordcloudNewsVisualization(data, country, category) {

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

    var first25Data = data.slice(0, 99);

    Highcharts.chart('chart', {
        series: [{
            type: 'wordcloud',
            data: first25Data,
            name: 'Occurrences'
        }],
        title: {
            text: category + ' Headlines in ' + country
        }
    });
}


function sunburstNewsVisualization(data, country, category) {
    
    // Initialising the arrays for data modification
    var sources = [];
    var articles = [];
    var colors = Highcharts.getOptions().colors;

    // Added the parent of the chart
    var sourceParent = {
        'id': '0.0',
        'parent': '',
        'name': 'Sources'
    };

    sources.push(sourceParent);






    $.each(data.articles, function (key, val) {
        //Creates the source
        //If the source is already in the array, 
        //does not create the source but appends the 

        //Source must have
        //ID of 'X'
        //Parent of '0.0'
        //Value of 1

        //Article must have
        //ID of 'X.Y' where x is the source
        //Parent of 'X' where x is the source
        //Value of 1

        //One source can have many articles

        var id = sources.length.toString();

        var source =
        {
            'id': "1." + id,
            'parent': '0.0',
            'name': val.source.name,
            //'val': 1,
            //color: colors[sources.length+1],
        };

        //If the source is a new source in array,
        //Add to array
        //Else - Get the id of the element
        var repeatingSource = -1;

        $.each(sources, function (key, val) {
            if (val.name == source.name) {
                repeatingSource = key;
            }
        });


        if (repeatingSource != -1) {
        }
        else {
            sources.push(source);
        }



        //The source for the article should now be in the 'sources' array
        //Now the aritcle needs to be inserted in the 'articles' array with appropriate attributes

        //Get the id of the sources element and appending it to the front of the articles ID
        //If the source has been repeated, then the key is already in use with 'repeatingSource'
        //If not, the key needs to be found

        var parent = "";

        if (repeatingSource != -1) {

            parent = repeatingSource.toString();
        }
        else {
            var len = sources.length - 1;
            parent = len.toString();

        }

        var article =
        {
            'id': "2." + articles.length,
            'parent': "1." + parent,
            'name': val.title,
            'value': 1,
        };

        articles.push(article);


    });
    var dataArray = sources.concat(articles);
    
    // Splice in transparent for the center circle
    Highcharts.getOptions().colors.splice(0, 0, 'transparent');


    let chart = Highcharts.chart('chart', {

        chart: {
            height: '80%',
        },

        title: {
            text: category + ' Headlines in ' + country,
        },
        subtitle: {
            text: 'By Source'
        },
        series: [{
            type: "sunburst",
            data: dataArray,
            allowDrillToNode: true,
            cursor: 'pointer',
            events: {
                click: function (event) {
                    let selectedPoints = chart.getSelectedPoints();
                    /*console.log(
                        selectedPoints
                    );*/
                }
            },
            dataLabels: {
                format: '{point.name}',
                filter: {
                    property: 'innerArcLength',
                    operator: '>',
                    value: 16,
                }
            },
            levels: [
                {
                    level: 1,
                    levelIsConstant: false,
                    dataLabels: {
                        filter: {
                            property: 'outerArcLength',
                            operator: '>',
                            value: 64,
                        }
                    }
                },
                {
                    level: 2,
                    colorByPoint: true,
                },

                //{
                //    level: 3,
                //        colorVariation: {
                //            key: 'brightness',
                //            to: -0.5,
                //        }
                //}
            ],

        }],
        tooltip: {
            headerFormat: "",
            pointFormat: '{point.name} - Articles: {point.value}'
        }
    });

    let loopIterator = 0;

    //////console.log('ALL SOURCES: ', sources);

    for (let i = sources.length; i < chart.series[0].data.length; i++) {
        let currentArticle = chart.series[0].data[i];
        //////console.log('Current Article: ', currentArticle);
        //////console.log('API DATA: ', data.articles[loopIterator]);

        //////console.log('JQUERY ITEM: ', $(chart.series[0].data[i]));

        $(chart.series[0].data[i].node).on('click', function () {
            //////console.log('HIT ONCLICK');
            window.open(currentArticle.url);
        });

        loopIterator += 1;
    }

    /*$.each(chart.series[0].data, function (key, val) {
        //////console.log('Iterator: ' + loopIterator);
        //////console.log('CHART DATA: ', val);
        //////console.log('API DATA: ', data.articles[loopIterator]);

        loopIterator += 1;
    });*/
} 


function submitNewsRequest(key) {

    let countryDropdown = $('#news-country-input').val();
    let categoryDropdown = $('#news-category-input').val();



    if (countryDropdown == null || categoryDropdown == null) {
        Swal.fire({
            type: 'error',
            title: 'Fields missing',
            text: 'Neither field has been entered. Please enter the country and category.'
        })
    }
    else {
        let requestUrl = 'https://newsapi.org/v2/top-headlines?country=' + countryDropdown + '&category=' + categoryDropdown + '&language=en&apiKey=' + key;

        $.ajax({
            type: "GET",
            url: requestUrl,
            dataType: "json",
            success: function (result) {
                collapseExpandToggle('news-wizard-arrow-up', 'news-wizard-arrow-down', 'news-wizard-container');
                $('#news-card-container').fadeIn(300);


                //Passes in the name of the options for the wordchart
                let countryName = $('#news-country-input option:selected').text();
                let categoryName = $('#news-category-input option:selected').text();
                sunburstNewsVisualization(result, countryName, categoryName);
            },
            error: function (errorResult) {


                Swal.fire({
                    type: 'error',
                    title: 'Data Request Error',
                    text: 'An error has occurred when submitting your request. Please try again with different criteria.'
                })
            }
        });
    }
}

