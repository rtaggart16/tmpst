﻿/*
    Author Info:

    Name(s) - Ross Taggart, Katie King, Aidan Marshall
    Student Number - S1828840, S1827986, S1828601
    Date Created - 22/02/2019
    Version - 2.0.0

    Description:
    JavaScript file which contains the functions and event handlers for the weather system
*/

/*------------------------------------------------------
>>> TABLE OF CONTENTS:
--------------------------------------------------------
# Global Variable Declarations
    ## Current Forecast Object
    ## Current Day Object
    ## Forecast Chart Instance
    ## Current Day Chart Instance
# Event Handlers
    ## Select Events
    ## Font Awesome Events
    ## Input Events
# API Requests
    ## Collate Parameters
    ## Contact Weather API
# Dynamic Data Functions
    ## Current Weather Containers
    ## Forecast Table Head
    ## Forecast Table Body
    ## Analyse Current Data
    ## Analyse Forecast Data
    ## Update Current Day Chart
    ## Update Forecast Chart
# Validation
    ## Location Input Validation
--------------------------------------------------------
*/

/*--------------------------------------------------------------------------
    # Global Variable Declarations
---------------------------------------------------------------------------*/

let currentForecastDataset = {};
let currentDayDataset = {};
let ForecastChart;
let currentDayChart;
let forecastCtx;
let currentDayCtx;

/*--------------------------------------------------------------------------
    END: # Global Variable Declarations
---------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------
    # Event Handlers
---------------------------------------------------------------------------*/

// Allows the user to chose their input type, either latitude and longitutde of name of place
$('#input-type-select').on('change', function () {
    //////console.log($('#input-type-select').val());

    let chosenType = $('#input-type-select').val();
    // If user selects input based on latitutde and longitude, fade out name field
    if (chosenType == 'latlng') {
        $('#name-and-postcode-input-container').fadeOut(300).promise().done(function () {
            $('#lat-long-input-container').fadeIn(300);
        });
    }
    // Fade in name field if lat/long not selected
    else {
        $('#lat-long-input-container').fadeOut(300).promise().done(function () {
            $('#name-and-postcode-input-container').fadeIn(300);
        });
    }
});

// Checks if the user has pressed enter while inside the place name/postcode input field
$('#name-or-postcode-input').on('keypress', function (e) {
    if (e.which == 13) {
        $('#submit-weather-request-btn').click();
    }
});

// Checks if the user has pressed enter while inside the latitude input field
$('#longitude-input').on('keypress', function (e) {
    if (e.which == 13) {
        $('#submit-weather-request-btn').click();
    }
});

// Checks if the user has pressed enter while inside the longitude input field
$('#latitude-input').on('keypress', function (e) {
    if (e.which == 13) {
        if ($('#longitude-input').val() != '' && $('#longitude-input').val() != ' ') {
            $('#submit-weather-request-btn').click();
        }
        else {
            Swal.fire({
                type: 'error',
                title: 'Invalid Request',
                text: 'You must specify both a latitude and a longitude'
            })
        }

    }
});

/*--------------------------------------------------------------------------
    END: # Event Handlers
---------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------
    # API Requests
---------------------------------------------------------------------------*/

/* FUNCTION: submitWeatherRequest
 * PARAMS: 
 *  - key: API key required to make requests to the APIXU API
 * DESCRIPTION: Function to submit user input, either lat/long or name
*/
function submitWeatherRequest(key) {

    let dataType = $('#method-type-select').val();
    let inputType = $('#input-type-select').val();
    let location = '';

    // Check if the user has entered values
    let isValid = validateLocationInput(inputType);

    if (isValid == true) {
        //if the selection type is lat/long, set the location values to the lat and long
        if (inputType == 'latlng') {
            location = $('#latitude-input').val() + ',' + $('#longitude-input').val();
        }
        else {
            //set the location value to name/postcode
            location = $('#name-or-postcode-input').val();
        }
        //contact the api with the location request
        resetWeatherPage();
        contactAPI(dataType, location, key);

        // Collapse query builder
        //collapseExpandToggle('weather-wizard-arrow-up', 'weather-wizard-arrow-down', 'weather-wizard-container');
    }
    else {
        // Show error for latitude and longitude
        if (inputType == 'latlng') {
            Swal.fire({
                type: 'error',
                title: 'Invalid Input',
                text: 'You must specify both a latitude and a longitude'
            })
        }
        // Show error for Place Name and Postcode
        else {
            Swal.fire({
                type: 'error',
                title: 'Invalid Input',
                text: 'You must specify a Postcode or a Place Name'
            })
        }
    }

}

/* FUNCTION: contactAPI
 * PARAMS:
 *  - requestType: type of request user will make
 *  - location: location user inputs
 * DESCRIPTION: Function to initialise the API and request information about the users inputted location, such as their 7 day forecast or current weather statistics
*/
function contactAPI(requestType, location, key) {

    //variable for api url
    let requestUrl = 'https://api.apixu.com/v1/' + requestType + '.json?key=' + key + '&q=' + location;
    //if user selects forecast, set the api to fetch data for next 7 days
    if (requestType == 'forecast') {
        requestUrl = requestUrl + '&days=7';
    }

    $.ajax({
        type: "GET",
        url: requestUrl,
        contentType: "application/json",
        success: function (result) {
            //////console.log('AJAX Response: ', result);

            // If the user requested forecast data
            if (requestType == 'forecast') {
                let forecastDates = [];

                // Updates the global forecast dataset
                currentForecastDataset = result.forecast;

                $.each(result.forecast.forecastday, function (key, val) {
                    let dateObject = new Date(val.date);
                    forecastDates.push(dateObject);
                });

                // Checks if the user is on a mobile
                let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

                // If user is on mobile
                if (isMobile == true) {
                    // Update and display mobile forecast views
                    updateForecastTableBodyMobile(result.forecast.forecastday);

                    forecastCtx = document.getElementById("forecast-overall-chart").getContext('2d');

                    collapseExpandToggle('weather-wizard-arrow-up', 'weather-wizard-arrow-down', 'weather-wizard-container');
                    $('#weather-forecast-data-container-mobile').fadeIn(300);

                }
                // User is on desktop
                else {
                    // Update and display desktop forecast views
                    currentForecastDataset = result.forecast;

                    forecastCtx = document.getElementById("forecast-overall-chart").getContext('2d');

                    updateForecastTableHead(forecastDates);
                    updateForecastTableBody(result.forecast.forecastday);

                    collapseExpandToggle('weather-wizard-arrow-up', 'weather-wizard-arrow-down', 'weather-wizard-container');
                    $('#weather-forecast-data-container').fadeIn(300);

                }

            }
            // The user requested current weather
            else {
                // Update and display current data views
                updateCurrentWeatherDataContainers(result);

                currentDayCtx = document.getElementById("current-day-chart").getContext('2d');

                $('#current-weather-card-span').text('Current Weather for ' + result.location.name);

                currentDayDataset = result;
                analyseCurrentDayData();
                collapseExpandToggle('weather-wizard-arrow-up', 'weather-wizard-arrow-down', 'weather-wizard-container');
                $('#weather-current-data-container').fadeIn(300);
            }
        },
        // The AJAX call was not successful
        error: function (errorResult) {
            //////console.log('ERROR: ', errorResult.statusText);

            // Fire an alert informing the user that there is no data for theit location
            if (errorResult.statusText == 'error') {
                Swal.fire({
                    type: 'error',
                    title: 'Data Request Error',
                    text: 'We could not find any weather information for ' + location + '. Please try another location'
                })
            }
        }
    });
}

/*--------------------------------------------------------------------------
    END: # API Requests
---------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------
    # Dynamic Data Functions
---------------------------------------------------------------------------*/

/* FUNCTION: updateCurrentWeatherDataContainers
 * PARAMS:
 *  - data: data
 * DESCRIPTION: Function to append information about current weather to html elements on the page
*/
function updateCurrentWeatherDataContainers(data) {
    $('#current-weather-icon-container').append('<img src="' + data.current.condition.icon + '" />');
    $('#current-weather-condition-container').append('<span><strong>Condition: </strong>' + data.current.condition.text + '</span>');
    $('#current-weather-temp-container').append('<span><strong>Temperature: </strong>' + data.current.temp_c + '&#8451</span>');
    $('#current-weather-feel-temp-container').append('<span><strong>Feels Like: </strong>' + data.current.feelslike_c + '&#8451</span>');
    $('#current-weather-wind-dir-container').append('<span><strong>Wind Direction: </strong>' + data.current.wind_dir + '</span>');
    $('#current-weather-wind-speed-container').append('<span><strong>Wind Speed(mph): </strong>' + data.current.wind_mph + '</span>');
}

/* FUNCTION: updateForecastTableHead
 * PARAMS:
 *  - dates: dates from current date
 * DESCRIPTION: Function to append information about the following 7 days from the date searched to a tableheader
*/
function updateForecastTableHead(dates) {
    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    let counter = 0
    let firstPass = true;
    let isComplete = false;

    $('#forecast-tbl-head').append('<tr id="temp-tbl-head-row"></tr>');

    $.each(dates, function (key, val) {
        let day = days[val.getDay()];
        $('#temp-tbl-head-row').append('<th>' + day + '</th>')
    });

}

/* FUNCTION: updateForecastTableBody
 * PARAMS:
 *  - apiData: information from the API
 * DESCRIPTION: Function to append information about the following 7 days forecast to elements on the page
*/
function updateForecastTableBody(apiData) {
    let icons = [];
    let avgTemps = [];
    let maxTemps = [];
    let conditionTexts = [];

    $.each(apiData, function (key, val) {
        icons.push(val.day.condition.icon);
        avgTemps.push(val.day.avgtemp_c);
        maxTemps.push(val.day.maxtemp_c);
        conditionTexts.push(val.day.condition.text);
    });

    //////console.log('ICONS', icons);
    //////console.log('AVGTEMPS', avgTemps);
    //////console.log('MAXTEMPS', maxTemps);
    //////console.log('CONDITIONS', conditionTexts);

    $('#forecast-head-only').append('<tr><td><img src="' + icons[0] + '" /></td>' +
        '<td><img src="' + icons[1] + '" /></td>' +
        '<td><img src="' + icons[2] + '" /></td>' +
        '<td><img src="' + icons[3] + '" /></td>' +
        '<td><img src="' + icons[4] + '" /></td>' +
        '<td><img src="' + icons[5] + '" /></td>' +
        '<td><img src="' + icons[6] + '" /></td></tr>');

    //appends the forecast icons to the table
    $('#forecast-tbl-body').append('<tr><td><img src="' + icons[0] + '" /></td>' +
        '<td><img src="' + icons[1] + '" /></td>' +
        '<td><img src="' + icons[2] + '" /></td>' +
        '<td><img src="' + icons[3] + '" /></td>' +
        '<td><img src="' + icons[4] + '" /></td>' +
        '<td><img src="' + icons[5] + '" /></td>' +
        '<td><img src="' + icons[6] + '" /></td></tr>');

    //appends the conditions information to table
    $('#forecast-tbl-body').append('<tr><td>' + conditionTexts[0] + '</td>' +
        '<td>' + conditionTexts[1] + '</td>' +
        '<td>' + conditionTexts[2] + '</td>' +
        '<td>' + conditionTexts[3] + '</td>' +
        '<td>' + conditionTexts[4] + '</td>' +
        '<td>' + conditionTexts[5] + '</td>' +
        '<td>' + conditionTexts[6] + '</td></tr>');

    //appends the max temp to the table
    $('#forecast-tbl-body').append('<tr><td><strong>Max Temp</strong> - ' + maxTemps[0] + '</td>' +
        '<td><strong>Max Temp</strong> - ' + maxTemps[1] + '&#8451</td>' +
        '<td><strong>Max Temp</strong> - ' + maxTemps[2] + '&#8451</td>' +
        '<td><strong>Max Temp</strong> - ' + maxTemps[3] + '&#8451</td>' +
        '<td><strong>Max Temp</strong> - ' + maxTemps[4] + '&#8451</td>' +
        '<td><strong>Max Temp</strong> - ' + maxTemps[5] + '&#8451</td>' +
        '<td><strong>Max Temp</strong> - ' + maxTemps[6] + '&#8451</td></tr>');

    //appends the average temp to the table
    $('#forecast-tbl-body').append('<tr><td><strong>Avg Temp</strong> - ' + avgTemps[0] + '</td>' +
        '<td><strong>Avg Temp</strong> - ' + avgTemps[1] + '&#8451</td>' +
        '<td><strong>Avg Temp</strong> - ' + avgTemps[2] + '&#8451</td>' +
        '<td><strong>Avg Temp</strong> - ' + avgTemps[3] + '&#8451</td>' +
        '<td><strong>Avg Temp</strong> - ' + avgTemps[4] + '&#8451</td>' +
        '<td><strong>Avg Temp</strong> - ' + avgTemps[5] + '&#8451</td>' +
        '<td><strong>Avg Temp</strong> - ' + avgTemps[6] + '&#8451</td></tr>');
}

/* FUNCTION: analyseForecastData
 * PARAMS:
 *  - apiData: information from the api
 * DESCRIPTION: Updates the forecast chart with the data from the latest query
*/
function updateForecastTableBodyMobile(apiData) {

    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    $.each(apiData, function (key, val) {
        let dateObject = new Date(val.date);
        let day = days[dateObject.getDay()];
        $('#forecast-tbl-body-mobile').append('<tr><td><strong>' + day + '</strong></td><td><img src="' + val.day.condition.icon + '" /></td>' +
            '<td><strong>Avg. Temp: </strong>' + val.day.avgtemp_c + '&#8451 </td>');
    });
}

/* FUNCTION: analyseForecastData
 * PARAMS:
 * DESCRIPTION: Updates the forecast chart with the data from the latest query
*/
function analyseForecastData() {

    // Initialise new data variables
    let labels = [];

    let avgTempArray = [];
    let maxTempArray = [];
    let minTempArray = [];
    let avgHumidityArray = [];
    let avgVisArray = [];

    // Iterate through each item in the most recent forecast dataset and populate the variables
    $.each(currentForecastDataset.forecastday, function (key, val) {
        labels.push(val.date);

        avgTempArray.push(val.day.avgtemp_c);
        maxTempArray.push(val.day.maxtemp_c);
        minTempArray.push(val.day.mintemp_c);
        avgHumidityArray.push(val.day.avghumidity);
        avgVisArray.push(val.day.avgvis_miles);
    });

    // If the forecast chart already exist (Not first run)
    if (ForecastChart != undefined) {
        // Change the data of the chart and redraw
        updateForecastChart(avgTempArray, maxTempArray, minTempArray, avgHumidityArray, avgVisArray);
    }
    // If the forecast chart does not exist
    else {
        // Set ForecastChart to a new instance of a Chart.js chart
        ForecastChart = new Chart(forecastCtx, {
            type: 'bar',
            data: {
                datasets: [{
                    label: 'Average Temperature',
                    data: avgTempArray,
                    borderColor: forecastAnalysisPallet.Avg_Temp
                }, {
                    label: 'Max Temperature',
                    data: maxTempArray,
                    borderColor: forecastAnalysisPallet.Max_Temp,
                    // Changes this dataset to become a line
                    type: 'line'
                },
                {
                    label: 'Min Temperature',
                    data: minTempArray,
                    borderColor: forecastAnalysisPallet.Min_Temp,
                    // Changes this dataset to become a line
                    type: 'line'
                },
                {
                    label: 'Humidity',
                    data: avgHumidityArray,
                    borderColor: forecastAnalysisPallet.Humidity,
                    // Changes this dataset to become a line
                    type: 'line'
                },
                {
                    label: 'Visibility',
                    data: avgVisArray,
                    borderColor: forecastAnalysisPallet.Visibility,
                    // Changes this dataset to become a line
                    type: 'line'
                }
                ],
                labels: labels
            },
            options: {
                maintainAspectRatio: false,
                responsive: true
            }
        });
    }
    
    // Collapses forecast container
    collapseExpandToggle('forecast-result-arrow-up', 'forecast-result-arrow-down', 'main-forecast-result-container');
    collapseExpandToggle('forecast-mobile-result-arrow-up', 'forecast-mobile-result-arrow-down', 'forecast-mobile-table-and-submit');

    // Display the forecast chart
    $('#forecast-weather-analysis-landing').fadeIn(300).promise().done(function () {
        $('#current-weather-analysis-landing').fadeOut(300).promise().done(function () {
            $('#weather-analysis-landing').fadeIn(300);
        });
    });
}

/* FUNCTION: analyseCurrentDayData
 * PARAMS:
 * DESCRIPTION: Updates the current day chart with the data from the latest query
*/
function analyseCurrentDayData() {

    // Defin the labels of the chart
    let labels = ['Current Temp', 'Feels Like', 'Humidity', 'Wind (mph)'];

    // Store the data from the latest query in an array
    let data = [currentDayDataset.current.temp_c, currentDayDataset.current.feelslike_c, currentDayDataset.current.humidity, currentDayDataset.current.wind_mph];

    let colours = [currentDayAnalysisPallet.Current_Temp, currentDayAnalysisPallet.Feels_Like, currentDayAnalysisPallet.Humidity, currentDayAnalysisPallet.Wind_Speed];

    //////console.log(currentDayDataset);

    // Create a dataset object to plug straight into the chart
    let dataset = {
        label: 'Current Weather Conditions in ' + currentDayDataset.location.name + ' (' + currentDayDataset.location.country + ')',
        data: data,
        borderColor: colours,
        backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'],

        borderColor: ['rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 206, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)']
    };

    //////console.log(dataset);

    // If the current day chart already exist (Not first run)
    if (currentDayChart != undefined) {
        // Change the data of the chart and redraw
        updateCurrentDayChart(data);
    }
    // If the current day chart does not exist
    else {
        // Set currentDayChart to a new instance of a Chart.js chart
        currentDayChart = new Chart(currentDayCtx, {
            type: 'horizontalBar',
            data: {
                labels: ['Current Temp', 'Feels Like', 'Humidity', 'Wind (mph)'],
                datasets: [
                    dataset
                ],

            },
            options: {
                legend: {
                    display: true,
                },
                ticks: {
                    beginAtZero: true
                },
                maintainAspectRatio: false,
            }
        });
    }
}

/* FUNCTION: analyseCurrentDayData
 * PARAMS:
 *  - newData: Data from the last current day query to be added to the current day chart
 * DESCRIPTION: Updates the current day chart with the data from the latest query
*/
function updateCurrentDayChart(newData) {
    // Changes the data of the only dataset to the newData
    currentDayChart.data.datasets[0].data = newData;
    // Changes the label of the dataset to the new location that the user has submitted
    currentDayChart.data.datasets[0].label = 'Current Weather Conditions in ' + currentDayDataset.location.name + ' (' + currentDayDataset.location.country + ')';
    // Update the chart.js instance
    currentDayChart.update();
}

/* FUNCTION: analyseCurrentDayData
 * PARAMS:
 *  - avgTemp: Array of the latest average temperature data
 *  - maxTemp: Array of the latest maximum temperature data
 *  - minTemp: Array of the latest minimum temperature data
 *  - avgHumidity: Array of the latest average humidity data
 *  - avgVis: Array of the latest average visibility data
 * DESCRIPTION: Updates the forecast chart with the data from the latest query
*/
function updateForecastChart(avgTemp, maxTemp, minTemp, avgHumidity, avgVis) {
    // Adds all the variables passed in to an Array
    let allNewData = [avgTemp, maxTemp, minTemp, avgHumidity, avgVis];
    // Iterates from 0 to 4 and freplaces the data of each dataset in the chart
    for (let i = 0; i <= 4; i++) {
        ForecastChart.data.datasets[i].data = allNewData[i];
    }
    // Update the chart.js instance
    ForecastChart.update();
}

/*--------------------------------------------------------------------------
    END: # Dynamic Data Functions
---------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------
    # Validation
---------------------------------------------------------------------------*/

/* FUNCTION: validateLocationInput
 * PARAMS:
 *  - inputType: Type of input the user has selected when inputting a location
 * DESCRIPTION: Function to check that the values the user has entered are not empty
*/
function validateLocationInput(inputType) {
    // If user is inputting latitude and longitude
    if (inputType == 'latlng') {
        let lat = $('#latitude-input').val();
        let lon = $('#longitude-input').val();

        // If the lat and lon variables are not empty or are only a space
        if ((lat != ' ' && lat != '') && (lon != ' ' && lon != '')) {
            return true;
        }
        else {
            return false;
        }
    }
    // If user is inputting place name or postcode
    else {
        let nameOrPostcode = $('#name-or-postcode-input').val();

        // If the name or postcode is not empty or only a space
        if (nameOrPostcode != '' && nameOrPostcode != ' ') {
            return true;
        }
        else {
            return false;
        }
    }
}

/*--------------------------------------------------------------------------
    END: # Validation
---------------------------------------------------------------------------*/

