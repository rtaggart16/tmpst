const invalidMortalityAreas = ["ASIA", "Australia/New%20Zealand", "AFRICA", "Central%20America", "Central%20Asia", "Caribbean", "Eastern%20Europe", "Eastern%20Africa", "Eastern%20Asia", "EUROPE", "LATIN%20AMERICA%20AND%20THE%20CARIBBEAN", "Less%20developed%20regions", "Less%20developed%20regions,%20excluding%20China", "Micronesia", "Melanesia", "Middle%20Africa", "More%20developed%20regions", "NORTHERN%20AMERICA", "OCEANIA", "Northern%20Europe", "Other%20non-specified%20areas", "Northern%20Africa", "Polynesia", "South%20America", "Southern%20Asia", "Southern%20Africa", "South-Eastern%20Asia", "South-Central%20Asia", "Southern%20Europe", "Sub-Saharan%20Africa", "Western%20Africa", "Western%20Asia", "Western%20Europe"]

function getPopulationCountries() {
    let url = 'https://api.population.io/1.0/countries';
    $.getJSON(url, function (data) {
        $.each(data.countries, function (key, val) {
            console.log('Value: ' + val);
            let formattedName = formatCountryName(val);
            if (invalidMortalityAreas.indexOf(formattedName) >= 0) {
                console.log('Value omitted from list');
            }
            else {
                $('#mortality-country-select').append('<option value="' + formattedName + '">' + val + '</option>');
            }
            
        });
    });
}
function formatCountryName(countryName) {
    console.log(countryName);
    let formattedCountryName = countryName.replace(/ /g, '%20');
    return formattedCountryName;
};