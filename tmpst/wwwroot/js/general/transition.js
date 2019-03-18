/*
    Author Info:

    Name(s) - Ross Taggart, Katie King, Aidan Marshall
    Student Number - S1828840, S1827986, S1828601
    Date Created - 20/02/2019
    Version - 1.0.5

    Description:
    JavaScript file which contains the transistion functions used throughout the application
*/

/*------------------------------------------------------
>>> TABLE OF CONTENTS:
--------------------------------------------------------
# Global Container Variables
    ## All Views
# Collapse Functions
    ## General Functions
# Global Transitions
    ## General
# API System Transitions
    ## Weather
    ## Earthquake
# API System Cleanup
    ## Weather
    ## Earthquake
--------------------------------------------------------
*/

/*--------------------------------------------------------------------------
    # Global Container Variables
---------------------------------------------------------------------------*/

// IMPORTANT - Will be added to as more views get added
let allViews = $('#overview-page')
    .add($('#weather-page'))
    .add($('#earthquake-page'))
    .add($('#population-page'))
    .add($('#news-page'))
    .add($('#tutorial-page'))
    .add($('#pollution-page'))
    .add($('#general-page'))
    .add($('#mortality-page'));

/*--------------------------------------------------------------------------
    END: # Global Container Variables
---------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------
    # Collapse Functions
---------------------------------------------------------------------------*/

function collapseExpandToggle(currentID, fadeInID, containerID) {
    $('#' + containerID).slideToggle("slow", function () {
        $('#' + currentID).fadeOut(300).promise().done(function () {
            $('#' + fadeInID).fadeIn(300);
        });
    });

    if (currentID == 'forecast-result-arrow-up' && fadeInID == 'forecast-result-arrow-down') {
        $('#forecast-head-only-tbl').fadeIn(300);
    }
    else if (currentID == 'forecast-result-arrow-down' && fadeInID == 'forecast-result-arrow-up') {
        $('#forecast-head-only-tbl').fadeOut(300);
    }
}

/*--------------------------------------------------------------------------
    END: # Collapse Functions
---------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------
    # Global Transitions
---------------------------------------------------------------------------*/

function fadeInSpecifiedView(viewID) {
    resetWeatherPage();
    resetEarthquakePage();
    resetNewsPage();
    resetMortalityPage();
    allViews.fadeOut(300).promise().done(function () {
        $('#' + viewID).fadeIn(300);
    });
}

/*--------------------------------------------------------------------------
    END: # Global Transitions
---------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------
    # API System Transitions
---------------------------------------------------------------------------*/

// Earthquake Transitions

function displayCountryInfoPage() {
    $('#earthquake-query-and-map-container').fadeOut(300).promise().done(function () {
        $('#earthquake-are-info-container').fadeIn(300);
    });
}

function redisplayEarthquakes() {

    $('#earthquake-are-info-container').fadeOut(300).promise().done(function () {
        $('#earthquake-query-and-map-container').fadeIn(300).promise().done(function () {
            clearEarthquakeCountryInfo();
        });
    });
}

// END: Eartquake Transitions

/*--------------------------------------------------------------------------
    END: # API System Transitions
---------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------
    # API System Cleanup
---------------------------------------------------------------------------*/

// Weather Cleanup

const allWeatherViews = $('#weather-query-container').add($('#weather-current-data-container'))
    .add($('#weather-map-container'))
    .add($('#weather-forecast-data-container'))
    .add($('#weather-current-data-container'))
    .add($('#weather-forecast-data-container-mobile'))
    .add($('#weather-analysis-landing'));
  

const allDynamicWeatherViews = $('#weather-current-data-container').add($('#weather-map-container'))
    .add($('#weather-forecast-data-container'))
    .add($('#weather-current-data-container'))
    .add($('#weather-forecast-data-container-mobile'))
    .add($('#weather-analysis-landing')
    .add($('#forecast-head-only-tbl')));

const allDynamicWeatherElements = $('#latitude-input').add($('#longitude-input'))
    .add($('#name-or-postcode-input'))
    .add($('#current-weather-icon-container'))
    .add($('#current-weather-condition-container'))
    .add($('#current-weather-temp-container'))
    .add($('#current-weather-feel-temp-container'))
    .add($('#current-weather-wind-dir-container'))
    .add($('#current-weather-wind-speed-container'))
    .add($('#forecast-tbl-head'))
    .add($('#forecast-tbl-body'))
    .add($('#forecast-tbl-body-mobile'))
    .add($('#forecast-overall-chart'))
    .add($('#current-day-chart')
    .add($('#forecast-head-only')));

function fadeDynamicWeatherViews() {
    allDynamicWeatherViews.fadeOut(300);
}

function clearDynamicWeatherElements() {
    allDynamicWeatherElements.empty();
}

function resetWeatherPage() {
    fadeDynamicWeatherViews();
    clearDynamicWeatherElements();
}

// END: Weather Clean Up

// Earthquake Clean Up

const allEarthquakeViews = $('#earthquake-query-container').add($('#earthquake-cluster-map-container'));

const allDynamicEarthquakeViews = $('#earthquake-cluster-map-container');

function fadeDynamicEarthquakeViews() {
    allDynamicEarthquakeViews.fadeOut(300);
}

function resetEarthquakePage() {
    fadeDynamicEarthquakeViews();
}

function clearEarthquakeCountryInfo() {
    $('#country-flag-container').empty();
    $('#country-info-tbl-body').empty();
    $('#country-capital-map').empty();
}

// END: Earthquake Clean Up


//News Clean Up
function resetNewsPage() {
    //fadeDynamicNewsViews();
}
//END: News Clean Up


    
    const allMortalityViews = $('#mortality-query-builder-container').add($('#mortality-percentage-chart-result'));

    const allDynamicMortalityViews = $('#mortality-percentage-chart-result');

    function fadeDynamicMortalityViews() {
        allDynamicMortalityViews.fadeOut(300);
    }

    function resetMortalityPage() {
        fadeDynamicMortalityViews();
    }

    


/*--------------------------------------------------------------------------
    END: # API System Cleanup
---------------------------------------------------------------------------*/


    

