/*
    Author Info:

    Name(s) - Ross Taggart, Katie King
    Student Number - S1828840, S1827986
    Date Created - 02/03/2019
    Version - 1.0.0

    Description:
    JavaScript file which contains the functions and event handlers for the earthquake system
*/

/*------------------------------------------------------
>>> TABLE OF CONTENTS:
--------------------------------------------------------
# Global Variable Declarations
    ## Default Request Type
    ## All Available Selects
# Event Handlers
    ## Font Awesome Events
    ## Select Events
# API Requests
    ## Contact Earthquake API
# Dynamic Data Functions
    ## Child Window
--------------------------------------------------------
*/

/*--------------------------------------------------------------------------
    # Global Variable Declarations
---------------------------------------------------------------------------*/

// Sets the default request type in edge case that user wants the hourly information
let requestType = 'hourly';

// Defines a list of all available selects
let allSelects = $('#hourly-type-select').add($('#daily-type-select'))
    .add($('#weekly-type-select'))
    .add($('#monthly-type-select'));

let countryInfoWindow;

/*--------------------------------------------------------------------------
    END: # Global Variable Declarations
---------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------
    # Event Handlers
---------------------------------------------------------------------------*/

// Collapses and expands the earthquake query container
$('#earthquake-collapse-expand').click(function () {
    $('#earthquake-wizard-container').slideToggle("slow", function () {
        //if container is visible, show an arrow that allows the container to be minimised
        if (!$('#earthquake-wizard-container').is(':visible')) {
            $('#earthquake-wizard-arrow-up').fadeOut().promise().done(function () {
                $('#earthquake-wizard-arrow-down').fadeIn();
                $('#earthquake-wizard-collapsed-title').fadeIn();
            });
        }
        else {
            $('#earthquake-wizard-arrow-down').fadeOut().promise().done(function () {
                $('#earthquake-wizard-arrow-up').fadeIn();
                $('#earthquake-wizard-collapsed-title').fadeOut();
            });
        }
    });
});

// Updates the requestType variable when the user changes the request type select item
$('#occurence-type-select').on('change', function () {
    console.log($('#occurence-type-select').val());

    requestType = $('#occurence-type-select').val();

    allSelects.fadeOut(300).promise().done(function () {
        $('#' + requestType + '-type-select').fadeIn(300);
    });
});

/*--------------------------------------------------------------------------
    END: # Event Handlers
---------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------
    # API Requests
---------------------------------------------------------------------------*/

/* FUNCTION: submitEarthquakeRequest
 * PARAMS: None
 * DESCRIPTION: Function to submit a request to the Earthquake API with then user's chosen query data
*/
function submitEarthquakeRequest() {
    // Gets the url from the selected item in the select box
    let url = $('#' + requestType + '-type-select').val();
    console.log(url);
    // Begins AJAX request construction
    $.ajax({
        // Get request
        type: "GET",
        url: url,
        // Expecting GeoJSON returned
        contentType: "application/vnd.geo+json",
        success: function (result) {
            console.log('AJAX Response: ', result);

            // If their is data returned
            if (result.features.length > 0) {
                Swal.fire({
                    type: 'warning',
                    title: 'Processing Data',
                    html: '<i class="fas fa-spinner fa-spin fa-2x"></i>',
                    timer: 1500
                    
                })

                setTimeout(function () {
                    createClusterMap(result.features);
                }, 100);

                $('#earthquake-wizard-arrow-up').click().promise().done(function () {
                    $('#earthquake-cluster-map-container').fadeIn(300);
                });
                result.dismiss === Swal.DismissReason.timer
                
            }
            else {
                Swal.fire({
                    type: 'warning',
                    title: 'No Data',
                    text: 'There is no data available for your request. Please submit another request'
                })
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

/* FUNCTION: submitEarthquakeRequest
 * PARAMS: 
 *  - lat: Latitude of an earthquake location
 *  - lon: Longitude of an earthquake location
 * DESCRIPTION: Function to retrieve relevant country information from a specified latitude and longitude
*/
function viewCountryInfo(lat, lon) {
    console.log('Lat Object ', lat);
    console.log('Lon Object ', lon);

    // Sets the request url for the GeoNames country code API
    let url = 'https://secure.geonames.org/countryCode?type=JSON&lat=' + lat + '&lng=' + lon +'&username=tmpst';

    // Begins AJAX request construction
    $.ajax({
        // Get request
        type: "GET",
        url: url,
        // Expecting JSONp returned
        dataType: "jsonp",
        success: function (result) {
            console.log('AJAX Result: ', result);

            // Begins second AJAX request construction
            $.ajax({
                // Get request
                type: "GET",
                // Specifies the REST countries API url appended with the country code returned from GeoNames
                url: 'https://restcountries.eu/rest/v2/alpha/' + result.countryCode,
                dataType: "json",
                success: function (result) {
                    clearEarthquakeCountryInfo();
                    console.log('Country Result: ', result);

                    openNewWindow(result);
                },
                error: function (errorResult) {
                    Swal.fire({
                        type: 'error',
                        title: 'No Country Information',
                        text: 'Unfortunately, we could not find country information for the chosen area. Please try another'
                    })
                }
            });
        },
        error: function (errorResult) {
            console.log('ERROR: ', errorResult.statusText);
            
        }
    });
}

/*--------------------------------------------------------------------------
    END: # API Requests
---------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------
    # Dynamic Data Functions
---------------------------------------------------------------------------*/

function openNewWindow(result) {
    let countryInfo = result;

    window.globalCountryInfo = countryInfo;

    if (typeof (countryInfoWindow) == 'undefined' || countryInfoWindow.closed) {

        window.isBuilt = false;

        countryInfoWindow = window.open('');

        countryInfoWindow.document.write('<html><head><title>Country Info</title><script src="../../../../../../lib/jquery/jquery-3.3.1.min.js" async><\/script><script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous" defer><\/script><script src="../../../../../lib/bootstrap/js/bootstrap.js" defer><\/script><link rel="stylesheet" href="../../../../../../../lib/bootstrap/css/bootstrap.css" /><link href="../../../../../css/Earthquake/countryInfo.css" rel="stylesheet" /><script src="../../../../../../js/general/map.js"><\/script><script defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB6yo58EUHrSdjTIMKz_lP2jt77KE-NfOI&callback=initMap"><\/script ></head><body>');

        countryInfoWindow.document.write('<body><div style="display:none" id="country-info-container"></div><button id="refresh-btn" style="display:none"></button></body><script src="../../../../../../js/earthquake/countryInfo.js"><\/script></html>');

        countryInfoWindow.document.close();
    }
    else {
        let updateButton = countryInfoWindow.document.getElementById('refresh-btn');
        $(updateButton).click();
    }
}

/*--------------------------------------------------------------------------
    END: # Dynamic Data Functions
---------------------------------------------------------------------------*/