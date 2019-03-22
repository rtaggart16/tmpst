const invalidMortalityAreas = [
    "ASIA",
    "Australia/New%20Zealand",
    "AFRICA",
    "Central%20America",
    "Central%20Asia",
    "Caribbean",
    "Eastern%20Europe",
    "Eastern%20Africa",
    "Eastern%20Asia",
    "EUROPE",
    "LATIN%20AMERICA%20AND%20THE%20CARIBBEAN",
    "Less%20developed%20regions",
    "Less%20developed%20regions,%20excluding%20China",
    "Least%20developed%20countries",
    "Less%20developed%20regions,%20excluding%20least%20developed%20countries",
    "Micronesia",
    "Melanesia",
    "Middle%20Africa",
    "More%20developed%20regions",
    "NORTHERN%20AMERICA",
    "OCEANIA",
    "Northern%20Europe",
    "Other%20non-specified%20areas",
    "Northern%20Africa",
    "Polynesia",
    "South%20America",
    "Southern%20Asia",
    "Southern%20Africa",
    "South-Eastern%20Asia",
    "South-Central%20Asia",
    "Southern%20Europe",
    "Sub-Saharan%20Africa",
    "Western%20Africa",
    "Western%20Asia",
    "Western%20Europe"
]

function getPopulationCountries(partialViewCountrySelect) {
    let url = 'https://api.population.io/1.0/countries';

    $.getJSON(url, function (data) {
        
        $.each(data.countries, function (key, val) {
            let formattedName = formatCountryName(val);
            if (invalidMortalityAreas.indexOf(formattedName) >= 0) {
            }
            else {
                $(partialViewCountrySelect).append('<option value="' + formattedName + '">' + val + '</option>');
            }
            
        });
    });
}

function formatCountryName(countryName) {
    let formattedCountryName = countryName.replace(/ /g, '%20');
    return formattedCountryName;
};



function createD3Visualisation(data) {


    //Removes existing headers and sub-headers
    d3.select("#population-text-header").remove();
    d3.select("#population-text-subheader").remove();


    $("#population-inner-chart").empty();
    $("#population-label").empty();
    d3.select("svg").remove();

    //Sets the header and sub-header
    d3.select("#population-header").append("h2")
        .attr("id", "population-text-header")
        .style("text-align", "center");

    var subheader = "Year: " + data[0].year + " - Location: " + data[0].country;

    d3.select("#population-header").append("h6")
        .attr("id", "population-text-subheader")
        .style("text-align", "center")
        .text(subheader);

    radarChartBuilder(data);

}


function radarChartBuilder(data) {
    //Aidan - this function is for your radar chart visualisation
    //Radar chart sourced from https://gist.github.com/nbremer/21746a9668ffdf6d8242 
    //Call function to drawv the Radar chart


    var dataInArray = [[]];


    for (i = 0; i < 10; i++) {
        //Adds the value and axis to the dataInArray which is the correctly formatted method (eg. 10 - 19)

        var groupedTotal = 0;

        for (e = 0; e < 10; e++) {
            //Adds the values of the points on the chart (eg. 10+11+12+13+14...etc...)

            groupedTotal += data[(i * 10) + e].total;

        };

        var ageElement = i * 10;

        //Adds the name of the axis (eg. 10 - 19)
        let radarItem = {
            axis: "Ages: " + data[ageElement].age + " - " + data[ageElement + 9].age,
            value: groupedTotal,
        };

        dataInArray[0].push(radarItem);
    };






    try {

        var id = "#population-chart";

        var margin = { top: 100, right: 100, bottom: 100, left: 100 },
            width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
            height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

        var color = d3.scale.ordinal()
            .range(["#4d648d", "#4d648d", "#4d648d"]);

        var options = {
            w: width,
            h: height,
            margin: margin,
            maxValue: 0.5,
            levels: 5,
            roundStrokes: true,
            color: color
        };



        var cfg = {
            w: 600,				//Width of the circle
            h: 600,				//Height of the circle
            margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
            levels: 5,				//How many levels or inner circles should there be drawn
            maxValue: 0, 			//What is the value that the biggest circle will represent
            labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
            wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
            opacityArea: 0.35, 	//The opacity of the area of the blob
            dotRadius: 4, 			//The size of the colored circles of each blog
            opacityCircles: 0.1, 	//The opacity of the circles of each blob
            strokeWidth: 2, 		//The width of the stroke around each blob
            roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
            color: d3.scale.category10()	//Color function, 0
        };




        //Put all of the options into a variable called cfg
        if ('undefined' !== typeof options) {
            for (var i in options) {
                if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
            }
        }



        //If the supplied maxValue is smaller than the actual one, replace by the max in the data

        var maxValue = 0;

        for (index = 0; index < dataInArray[0].length; index++) {
            if (dataInArray[0][index].value > maxValue) {
                maxValue = dataInArray[0][index].value;
            };
        }

        cfg.maxValue = maxValue;




        var allAxis = (dataInArray[0].map(function (i, j) { return i.axis })),	//Names of each axis
            total = allAxis.length,					//The number of different axes
            radius = Math.min(cfg.w / 2, cfg.h / 2), 	//Radius of the outermost circle
            Format = d3.format(',d'),			 	//Percentage formatting
            angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"



        //Scale for the radius
        var rScale = d3.scale.linear()
            .range([0, radius])
            .domain([0, maxValue]);

    }
    catch (error) {
        console.log(error);
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
    };


    //Create the container SVG and g 

    try {
        //Remove whatever chart with the same id/class was present before

        d3.select(id).select("svg").remove();

        //Initiate the radar chart SVG
        var svg = d3.select(id).append("svg")
            .attr("width", cfg.w + cfg.margin.left + cfg.margin.right) //cfg.w + cfg.margin.left + cfg.margin.right
            .attr("height", cfg.h + cfg.margin.bottom + cfg.margin.top)
            .attr("class", "radar" + id);

        //Append a g element
        var g = svg.append("g")
            .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");
    }
    catch (error) {
        console.error(error);
    }



    //Filter for the outside glow
    try {
        var filter = g.append('defs').append('filter').attr('id', 'glow'),
            feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
            feMerge = filter.append('feMerge'),
            feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
            feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    }
    catch (error) {
        console.log(error);
    }


    //Draw the Circular grid

    //Wrapper for the grid & axes

    try {
        var axisGrid = g.append("g").attr("class", "axisWrapper");

        //Draw the background circles
        axisGrid.selectAll(".levels")
            .data(d3.range(1, (cfg.levels + 1)).reverse())
            .enter()
            .append("circle")
            .attr("class", "gridCircle")
            .attr("r", function (d, i) { return radius / cfg.levels * d; })
            .style("fill", "#CDCDCD")
            .style("stroke", "#CDCDCD")
            .style("fill-opacity", cfg.opacityCircles)
            .style("filter", "url(#glow)");

        //Text indicating at what % each level is
        axisGrid.selectAll(".axisLabel")
            .data(d3.range(1, (cfg.levels + 1)).reverse())
            .enter().append("text")
            .attr("class", "axisLabel")
            .attr("x", 4)
            .attr("y", function (d) { return -d * radius / cfg.levels; })
            .attr("dy", "0.4em")
            .style("font-size", "10px")
            .attr("fill", "#737373")
            .text(function (d, i) { return Format(maxValue * d / cfg.levels); });
    }
    catch (error) {
        console.log(error);
    }


    //Draw the axes

    try {
        //Create the straight lines radiating outward from the center
        var axis = axisGrid.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");
        //Append the lines
        axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", function (d, i) { return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2); })
            .attr("y2", function (d, i) { return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); })
            .attr("class", "line")
            .style("stroke", "white")
            .style("stroke-width", "2px");

        //Append the labels at each axis
        axis.append("text")
            .attr("class", "legend")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("x", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2); })
            .attr("y", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2); })
            .text(function (d) { return d })
            .call(wrap, cfg.wrapWidth);
    }
    catch (error) {
        console.log(error);
    }


    //Draw the radar chart blobs

    try {

        //The radial line function
        var radarLine = d3.svg.line.radial()
            .interpolate("linear-closed")
            .radius(function (d) {
                return rScale(d.value);
            })
            .angle(function (d, i) { return i * angleSlice; });

        if (cfg.roundStrokes) {
            radarLine.interpolate("cardinal-closed");
        }

        //Must add data to array to show number of blobs (1)


        //Create a wrapper for the blobs	
        var blobWrapper = g.selectAll(".radarWrapper")
            .data(dataInArray)
            .enter().append("g")
            .attr("class", "radarWrapper");


        //Append the backgrounds	
        blobWrapper
            .append("path")
            .attr("class", "radarArea")
            .attr("d", function (d, i) { return radarLine(d); })
            .style("fill", function (d, i) { return cfg.color(i); })
            .style("fill-opacity", cfg.opacityArea)
            .on('mouseover', function (d, i) {
                //Dim all blobs
                d3.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", 0.1);
                //Bring back the hovered over blob
                d3.select(this)
                    .transition().duration(200)
                    .style("fill-opacity", 0.7);
            })
            .on('mouseout', function () {
                //Bring back all blobs
                d3.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", cfg.opacityArea);
            });

        //Create the outlines	
        blobWrapper.append("path")
            .attr("class", "radarStroke")
            .attr("d", function (d, i) { return radarLine(d); })
            .style("stroke-width", cfg.strokeWidth + "px")
            .style("stroke", function (d, i) { return cfg.color(i); })
            .style("fill", "none")
            .style("filter", "url(#glow)");

        //Append the circles
        blobWrapper.selectAll(".radarCircle")
            .data(function (d, i) { return d; })
            .enter().append("circle")
            .attr("class", "radarCircle")
            .attr("r", cfg.dotRadius)
            .attr("cx", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
            .attr("cy", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
            .style("fill", function (d, i, j) { return cfg.color(j); })
            .style("fill-opacity", 0.8);
    }
    catch (error) {
        console.log(error);
    }

    // Append invisible circles for tooltip

    try {
        //Wrapper for the invisible circles on top
        var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
            .data(dataInArray)
            .enter().append("g")
            .attr("class", "radarCircleWrapper");

        //Append a set of invisible circles on top for the mouseover pop-up
        blobCircleWrapper.selectAll(".radarInvisibleCircle")
            .data(function (d, i) { return d; })
            .enter().append("circle")
            .attr("class", "radarInvisibleCircle")
            .attr("r", cfg.dotRadius * 1.5)
            .attr("cx", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
            .attr("cy", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function (d, i) {
                newX = parseFloat(d3.select(this).attr('cx')) - 10;
                newY = parseFloat(d3.select(this).attr('cy')) - 10;

                tooltip
                    .attr('x', newX)
                    .attr('y', newY)
                    .text(Format(d.value))
                    .transition().duration(200)
                    .style('opacity', 1);
            })
            .on("mouseout", function () {
                tooltip.transition().duration(200)
                    .style("opacity", 0);
            });

        //Set up the small tooltip for when you hover over a circle
        var tooltip = g.append("text")
            .attr("class", "tooltip")
            .style("opacity", 0);
    } catch (error) {
        console.log(error);
    }

    //Helper Function

    //Wraps SVG text	
    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.4, // ems
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }


}

function barChartBuilder(data) {


    //Finds out the width of the screen
    var margin = { top: 50, right: 50, bottom: 50, left: 50 },
        width = Math.min(400, window.innerWidth - 50) - margin.left - margin.right,
        height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

    var labelsInArray = [];
    for (i = 0; i < 10; i++) {
        //Adds the value and axis to the dataInArray which is the correctly formatted method (eg. 10 - 19)

        var ageElement = i * 10;

        //Adds the name of the axis (eg. 10 - 19)

        var label = data[ageElement].age + " - " + data[ageElement + 9].age;

        labelsInArray.push(label);
    };



    //Sorts raw data
    var dataInArray = [];



    for (i = 0; i < 10; i++) {
        //Adds the value and axis to the dataInArray which is the correctly formatted method (eg. 10 - 19)

        var groupedTotal = 0;

        for (e = 0; e < 10; e++) {
            //Adds the values of the points on the chart (eg. 10+11+12+13+14...etc...)

            groupedTotal += data[(i * 10) + e].total;

        };


        dataInArray.push(groupedTotal);
    };

    //Creates the labels on the side
    labelsInArray.forEach(function (element) {

        $('#population-label').css({ width: 50 + "px" });

        d3.select('#population-label')
            .append('div')
            .text(element);
    });




    var x = d3.scale.linear()
        .domain([0, d3.max(dataInArray)])
        .range([0, width]);

    console.log(width);

    d3.select("#population-inner-chart")
        .selectAll("div")
        .data(dataInArray)
        .enter().append("div")
        .style("width", function (d) { return x(d) + "px"; })
        .style("margin-left", "55px;")
        .text(function (d) { return d; });



}
