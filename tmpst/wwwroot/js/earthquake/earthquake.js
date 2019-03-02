﻿/*
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
                    html: '<i class="fas fa-spinner fa-spin fa-2x"></i>'
                })

                setTimeout(function () {
                    createClusterMap(result.features);
                }, 100);

                $('#earthquake-wizard-arrow-up').click().promise().done(function () {
                    $('#earthquake-cluster-map-container').fadeIn(300);
                });
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

/*--------------------------------------------------------------------------
    END: # API Requests
---------------------------------------------------------------------------*/