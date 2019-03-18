/*
    Author Info:

    Name(s) - Ross Taggart
    Student Number - S1828840
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
    ## Current Country Summary
    ## Current Country Map and Flag
    ## Current Country Info Table
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

function submitEarthquakeRequest() {
    let url = $('#' + requestType + '-type-select').val();
    console.log(url);
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/vnd.geo+json",
        success: function (result) {
            console.log('AJAX Response: ', result);

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

function viewCountryInfo(lat, lon) {
    console.log('Lat Object ', lat);
    console.log('Lon Object ', lon);

    let url = 'https://secure.geonames.org/countryCode?type=JSON&lat=' + lat + '&lng=' + lon +'&username=tmpst';
    
    $.ajax({
        type: "GET",
        url: url,
        dataType: "jsonp",
        success: function (result) {
            console.log('AJAX Result: ', result);

            $.ajax({
                type: "GET",
                url: 'https://restcountries.eu/rest/v2/alpha/' + result.countryCode,
                dataType: "json",
                success: function (result) {
                    clearEarthquakeCountryInfo();
                    console.log('Country Result: ', result);

                    let countryInfo = result;

                    window.globalCountryInfo = countryInfo;

                    if (typeof (countryInfoWindow) == 'undefined' || countryInfoWindow.closed) {

                        window.isBuilt = false;

                        // window is not open: insert scripts and HTML
                        viewWindow = window.open('');

                        viewWindow.document.write('<html><head><title>Country Info</title><script src="../../../../../../lib/jquery/jquery-3.3.1.min.js" async><\/script><script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous" defer><\/script><script src="../../../../../lib/bootstrap/js/bootstrap.js" defer><\/script><link rel="stylesheet" href="../../../../../../../lib/bootstrap/css/bootstrap.css" /><link href="../../../../../css/Earthquake/countryInfo.css" rel="stylesheet" /><script src="../../../../../../js/earthquake/countryInfo.js"><\/script><script src="../../../../../../js/general/map.js"><\/script><script defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB6yo58EUHrSdjTIMKz_lP2jt77KE-NfOI&callback=initMap"><\/script ></head><body>');

                        viewWindow.document.write('<body><div id="country-info-container"></div></body></html>');
                    }

                    /*
                    createCountrySummary(result);
                    createCountryMapAndFlag(result);
                    createCountryInfoTable(result);

                    displayCountryInfoPage();*/
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

function createCountrySummary(result) {
    let summaryText = result.name + ' is a country which is part of ' + result.region + '. ' + result.name + ' is also part of the subregion ' + result.subregion + '. ';

    if (result.altSpellings.length > 0) {
        summaryText += result.name + ' is also called ';
        $.each(result.altSpellings, function (key, val) {
            if ((key + 1) == result.altSpellings.length) {
                summaryText += val + '. ';
            }
            else {
                summaryText += val + ', ';
            }

        });
    }

    summaryText += result.name + '\'s native name is ' + result.nativeName;

    $('#country-information-summary').text(summaryText);
}

function createCountryMapAndFlag(result) {
    $('#country-flag-container').append('<img class="img-fluid" src="' + result.flag + '" />');

    initMap(result.latlng[0], result.latlng[1], result.name, 'country-capital-map');
}

function createCountryInfoTable(result) {
    let capital = result.capital;
    let population = result.population;
    let currencies = '';

    if (result.currencies.length > 0) {
        $.each(result.currencies, function (key, val) {
            if ((key + 1) == result.currencies.length) {
                let currencyText = val.name + ' (' + val.symbol + ')'
                currencies += currencyText;
            }
            else {
                let currencyText = val.name + ' (' + val.symbol + '), '
                currencies += currencyText;;
            }
        });
    }

    let demonym = result.demonym;

    let languages = '';

    if (result.languages.length > 0) {
        $.each(result.languages, function (key, val) {
            if ((key + 1) == result.currencies.length) {
                let languageText = val.name + ' (' + val.nativeName + ')'
                languages += languageText;
            }
            else {
                let languageText = val.name + ' (' + val.nativeName + '), '
                languages += languageText;;
            }
        });
    }

    $('#country-info-tbl-body').append('<tr><td><strong>Capital</strong></td><td>' + capital + '</td></tr>' +
        '<tr><td><strong>Population</strong></td><td>' + population + '</td></tr>' +
        '<tr><td><strong>Currencies</strong></td><td>' + currencies + '</td></tr>' +
        '<tr><td><strong>Demonym</strong></td><td>' + demonym + '</td></tr>' +
        '<tr><td><strong>Languages</strong></td><td>' + languages + '</td></tr>');
}

function openNewWindow() {

}

/*--------------------------------------------------------------------------
    END: # Dynamic Data Functions
---------------------------------------------------------------------------*/