// Container Variables

// IMPORTANT - Will be added to as more views get added
let allViews = $('#overview-page').add($('#weather-page')).add($('#earthquake-page'));

// END: Container Variables

// General Transition

function fadeInSpecifiedView(viewID) {
    resetWeatherPage();
    resetEarthquakePage();
    //resetTrafficPage();
    allViews.fadeOut(300).promise().done(function () {
        $('#' + viewID).fadeIn(300);
    });
}

// END: General Transiton


// Weather Clean Up
const allWeatherViews = $('#weather-query-container').add($('#weather-current-data-container'))
    .add($('#weather-map-container'))
    .add($('#weather-forecast-data-container'))
    .add($('#weather-current-data-container'))
    .add($('#weather-forecast-data-container-mobile'));

const allDynamicWeatherViews = $('#weather-current-data-container').add($('#weather-map-container'))
    .add($('#weather-forecast-data-container'))
    .add($('#weather-current-data-container'))
    .add($('#weather-forecast-data-container-mobile'));

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
    .add($('#forecast-tbl-body-mobile'));

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

//Traffic Clean Up
//const allTrafficViews = $('#traffic-route-query-container').add($('#traffic-incidents-query-container'));

//const allDynamicTrafficViews = $('#traffic-incidents-query-container');

//function fadeDynamicTrafficViews() {
    //allTrafficViews.fadeOut(300);
//}

//function resetTrafficPage() {
    //fadeDynamicTrafficViews();
//}

//END: Traffic Clean Up

//Earthquake Clean Up
const allEarthquakeViews = $('#earthquake-query-container').add($('#earthquake-cluster-map-container'));

const allDynamicEarthquakeViews = $('#earthquake-cluster-map-container');

function fadeDynamicEarthquakeViews() {
    allDynamicEarthquakeViews.fadeOut(300);
}

function resetEarthquakePage() {
    fadeDynamicEarthquakeViews();
}

//END: Earthquake Clean Up


    

