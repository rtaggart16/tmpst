function getPopulationCountries() {
    let url = 'https://api.population.io/1.0/countries';
    $.getJSON(url, function (data) {
        $.each(data.countries, function (key, val) {
            console.log('Value: ' + val);
            let formattedName = formatCountryName(val);

            $('#mortality-country-select').append('<option value="' + formattedName + '">' + val + '</option>');
        });
    });
}
function formatCountryName(countryName) {
    console.log(countryName);
    let formattedCountryName = countryName.replace(/ /g, '%20');
    return formattedCountryName;
};