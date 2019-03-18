﻿/*
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
            text: category + ' Headlines in ' + country,
        }
    });
} 


function sunburstNewsVisualization(data, country, category) {

    console.log(data);
    



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


        if(repeatingSource != -1) {
            console.log("FOUND DUPLICATE - Name: " + source.name + " - ID in Array: " + repeatingSource);
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
    
    console.log(dataArray);
    
    

    
    // Splice in transparent for the center circle
    Highcharts.getOptions().colors.splice(0, 0, 'transparent');


    Highcharts.chart('chart', {

        chart: {
            height: '100%'
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
} 