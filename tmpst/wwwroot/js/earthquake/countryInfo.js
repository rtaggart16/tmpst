(function initWindow() {
    console.log('COUNTRY INFO: ', window.opener.globalCountryInfo);
    console.log('IS BUILT: ', window.opener.isBuilt);

    if (window.opener.isBuilt == false) {
        buildCountryContainer();
    }

    updateCountryContainer();
})();

function buildCountryContainer() {
    $('#country-info-container').append('<div class="row">' +
        '<div class= "col-12">' +
        '<div class="card earthquake-card-container">' +
        '<div id="country-information-container" class="earthquake-card-item">' +
        '<div class="row">' +
        '<div class="col-12">' +
        '<p id="country-information-summary"></p>' +
        '</div>' +
        '</div>' +
        '<div class="row earthquake-card-item">' +
        '<div id="country-flag-container" class="col-6">' +
        '</div>' +
        '<div class="col-6">' + 
        '<table class="w-100 table-striped">' +
        '<tbody id="country-info-tbl-body" class="text-center"></tbody>' +
        '</table>' +
        '</div>' +
        '</div>' +
        '<div class="row earthquake-card-item">' +
        /*'<div class="col-12">' +
        '<table class="w-100 table-striped">' +
        '<tbody id="country-info-tbl-body" class="text-center"></tbody>' +
        '</table>' +
        '</div>' +*/
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>');
}

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

    //initMap(result.latlng[0], result.latlng[1], result.name, 'country-capital-map');
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

function clearEarthquakeCountryInfo() {
    $('#country-flag-container').empty();
    $('#country-info-tbl-body').empty();
}

function updateCountryContainer() {
    $('#country-info-container').fadeOut(300).promise().done(function () {
        clearEarthquakeCountryInfo();
        createCountrySummary(window.opener.globalCountryInfo);
        createCountryMapAndFlag(window.opener.globalCountryInfo);
        createCountryInfoTable(window.opener.globalCountryInfo);
    }).promise().done(function () {
        $('#country-info-container').fadeIn(300);
    });
}

$('#refresh-btn').click(function () {
    updateCountryContainer();
});

