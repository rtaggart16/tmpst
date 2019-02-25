/* FUNCTION: initMap
     * PARAMS:
     *  - latitude: latitude of requested marker
     *  - longitude: longitude of requested marker
     *  - placeName: Name of the place that weather is being requested for
     * DESCRIPTION: Function to initialise the map which displays where in the world a user has requested weather from
    */
function initMap(latitude, longitude, placeName, containerID) {
    console.log('Lat: ', latitude);
    console.log('Lon: ', longitude);

    // Create the object which stores the latitude and longitude of the marker
    let myLatLng;

    // If the parameters passed in contain actual data
    if (latitude != undefined || longitude != undefined) {
        myLatLng = { lat: latitude, lng: longitude };

        // Create a new map targeting the result-map element
        var map = new google.maps.Map(document.getElementById(containerID), {
            zoom: 4,
            center: myLatLng
        });

        // Create a new marker and use the myLatLng object as the location
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'Weather Location'
        });

        // Create an info window that will be displayed when a marker is clicked
        let infoWindow = new google.maps.InfoWindow({
            content: '<h2>' + placeName + '</h2>' +
                '<button class="btn btn-success">Analyse Data</button>'

        });

        // Add an event listener to check when a marker is clicked
        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open(map, marker);
        });
    }
}

function createClusterMap(data) {
    var map = new google.maps.Map(document.getElementById('earthquake-cluster-map'), {
        zoom: 2,
        center: { lat: 0, lng: 0 }
    });

    let locations = [];

    $.each(data, function (key, val) {
        let lat = '';
        let lon = '';

        lat = val.geometry.coordinates[0];
        lon = val.geometry.coordinates[1];

        locations.push({ lat: lat, lng: lon });
    });

    // Create an array of alphabetical characters used to label the markers.
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Add some markers to the map.
    // Note: The code uses the JavaScript Array.prototype.map() method to
    // create an array of markers based on a given "locations" array.
    // The map() method here has nothing to do with the Google Maps API.
    var markers = locations.map(function (location, i) {
        return new google.maps.Marker({
            position: location,
            label: labels[i % labels.length]
        });
    });

    // Add a marker clusterer to manage the markers.
    var markerCluster = new MarkerClusterer(map, markers,
        { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });

    
}
