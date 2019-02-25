/*
    Author Info:

    Name(s) - Ross Taggart
    Student Number - S1828840
    Date Created - 22/02/2019
    Version - 1.0.0

    Description:
    JavaScript file which contains the functions and event handlers for the weather system
*/

/*------------------------------------------------------
>>> TABLE OF CONTENTS:
--------------------------------------------------------
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
# Validation
    ## Location Input Validation
--------------------------------------------------------
*/

/*--------------------------------------------------------------------------
    # Event Handlers
---------------------------------------------------------------------------*/

//Allows the user to chose their input type, either latitude and longitutde of name of place
$('#input-type-select').on('change', function () {
    console.log($('#input-type-select').val());

    let chosenType = $('#input-type-select').val();
    //if user selects input based on latitutde and longitude, fade out name field
    if (chosenType == 'latlng') {
        $('#name-and-postcode-input-container').fadeOut(300).promise().done(function () {
            $('#lat-long-input-container').fadeIn(300);
        });
    }
    //fade in name field if lat/long not selected
    else {
        $('#lat-long-input-container').fadeOut(300).promise().done(function () {
            $('#name-and-postcode-input-container').fadeIn(300);
        });
    }
});

//Slide animation for the weather search, which allows more information to be displayed on the page by increasing page real estate
$('#wizard-collapse-expand').click(function () {
    $('#weather-wizard-container').slideToggle("slow", function () {
        //if container is visible, show an arrow that allows the container to be minimised
        if (!$('#weather-wizard-container').is(':visible')) {
            $('#weather-wizard-arrow-up').fadeOut().promise().done(function () {
                $('#weather-wizard-arrow-down').fadeIn();
                $('#weather-wizard-collapsed-title').fadeIn();
            });
        }
        else {
            $('#weather-wizard-arrow-down').fadeOut().promise().done(function () {
                $('#weather-wizard-arrow-up').fadeIn();
                $('#weather-wizard-collapsed-title').fadeOut();
            });
        }
    });
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
            console.log('AJAX Response: ', result);

            if (requestType == 'forecast') {
                let forecastDates = [];

                $.each(result.forecast.forecastday, function (key, val) {
                    let dateObject = new Date(val.date);
                    forecastDates.push(dateObject);
                });

                let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

                if (isMobile == true) {
                    updateForecastTableBodyMobile(result.forecast.forecastday);

                    $('#wizard-collapse-expand').click().promise().done(function () {
                        initMap(result.location.lat, result.location.lon, result.location.name, 'result-map');
                        console.log('REACHED FADE INS');
                        $('#weather-map-container').fadeIn(300).promise().done(function () {
                            console.log('MAP FADED IN');
                            $('#weather-forecast-data-container-mobile').fadeIn(300);
                        });

                    });
                }
                else {
                    updateForecastTableHead(forecastDates);
                    updateForecastTableBody(result.forecast.forecastday);
                    
                    $('#wizard-collapse-expand').click().promise().done(function () {
                        initMap(result.location.lat, result.location.lon, result.location.name, 'result-map');
                        console.log('REACHED FADE INS');
                        $('#weather-map-container').fadeIn(300).promise().done(function () {
                            console.log('MAP FADED IN');
                            $('#weather-forecast-data-container').fadeIn(300);
                        });

                    });
                }
                
            }
            else {
                updateCurrentWeatherDataContainers(result);
                $('#wizard-collapse-expand').click().promise().done(function () {
                    initMap(result.location.lat, result.location.lon, result.location.name, 'current-weather-result-map');
                    $('#weather-current-data-container').fadeIn(300);
                });
            }
        },
        error: function (errorResult) {
            console.log('ERROR: ', errorResult.statusText);

            if (errorResult.statusText == 'error') {
                Swal.fire({
                    type: 'error',
                    title: 'Data Request Error',
                    text: 'An error has occurred when submitting your request. Please try again with different criteria'
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

    console.log('ICONS', icons);
    console.log('AVGTEMPS', avgTemps);
    console.log('MAXTEMPS', maxTemps);
    console.log('CONDITIONS', conditionTexts);

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

function updateForecastTableBodyMobile(apiData) {

    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    $.each(apiData, function (key, val) {
        let dateObject = new Date(val.date);
        let day = days[dateObject.getDay()];
        $('#forecast-tbl-body-mobile').append('<tr><td><strong>' + day + '</strong></td><td><img src="' + val.day.condition.icon + '" /></td>' +
            '<td><strong>Avg. Temp: </strong>' + val.day.avgtemp_c + '</td>');
    });
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