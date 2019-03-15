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


function newsVisualization(data, country, category) {

    console.log(data);
    





    // Added the parent of the chart
    var sourceParent = {
        'id': '0.0',
        'parent': '',
        'name': 'Sources'
    };

    //filteredData.push(sourceParent);


    // Initialising the arrays for data modification
    var sources = [];
    var articles = [];

    

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



        var source =
        {
            'name': val.source.name,
            'id': sources.length,
            'val': 1,
            'parent' : '0.0',
        };

        //If the source is a new source in array,
        //Add to array
        //Else - Get the id of the element

        function findIndex(element) {
            return element == sources;
        }

        console.log("IDs of repeaing data" + sources.findIndex(findIndex));
        // expected output: 3



        if (repeatingSource != -1) {
            console.log("FOUND DUP __"+ source);
        }
        else {
            sources.push(source);
        }

        var array1 = [5, 12, 8, 130, 44];

        

        
        
    });

    console.log(sources);
    

    var colors = Highcharts.getOptions().colors;
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
        plotOptions: {
            sunburst: {}
        },
        series: [{
            type: "sunburst",
            data: [{
                id: '0.0',
                name: 'Highlights',
                parent: '',
            }, {
                id: '1.0',
                parent: '0.0',
                name: 'Consumer',
                color: colors[1],
                value: 1
            }, {
                parent: '1.0',
                name: 'Furniture',
                value: 1
            }, {
                parent: '1.0',
                name: 'Office Supplies',
                value: 1
            }, {
                parent: '1.0',
                name: 'Technology',
                value: 1
            }, {
                id: '2.0',
                name: 'Corporate',
                parent: '0.0',
                color: colors[2],
                value: 1
            }, {
                parent: '2.0',
                name: 'Furniture',
                value: 1
            }, {
                parent: '2.0',
                name: 'Office Supplies',
                value: 1
            }, {
                parent: '2.0',
                name: 'Technology',
                value: 1
            }, {
                id: '3.0',
                name: 'Home office',
                parent: '0.0',
                color: colors[3],
                value: 1
            }, {
                parent: '3.0',
                name: 'Furniture',
                value: 1
            }, {
                parent: '3.0',
                name: 'Office Supplies',
                value: 1
            }, {
                parent: '3.0',
                name: 'Technology',
                value: 1
            }, {
                id: '4.0',
                name: 'Small Business',
                parent: '0.0',
                color: colors[4],
                value: 1
            }, {
                parent: '4.0',
                name: 'Office Supplies',
                value: 1
            }, {
                parent: '4.0',
                name: 'Technology',
                value: 1
            }],
            allowDrillToNode: true,
            cursor: 'pointer',
            dataLabels: {
                /**
                 * A custom formatter that returns the name only if the inner arc
                 * is longer than a certain pixel size, so the shape has place for
                 * the label.
                 */
                formatter: function () {
                    var shape = this.point.node.shapeArgs;

                    var innerArcFraction = (shape.end - shape.start) / (2 * Math.PI);
                    var perimeter = 2 * Math.PI * shape.innerR;

                    var innerArcPixels = innerArcFraction * perimeter;

                    if (innerArcPixels > 16) {
                        return this.point.name;
                    }
                }
            },
            levels: [{
                level: 2,
                dataLabels: {
                    rotationMode: 'parallel'
                }
            }, {
                level: 3,
                colorVariation: {
                    key: 'brightness',
                    to: -0.4 //Tells the gradation extent
                }
            }, {
                level: 4,
                colorVariation: {
                    key: 'brightness',
                    to: 0.5 //Tells the gradation extent
                }
            }]
        }],
        tooltip: {
            headerFormat: "",
            pointFormat: '{point.name} {point.value}'
        }
    });
} 