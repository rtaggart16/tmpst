function submitMortalityRequest(url) {

    let country = $('#mortality-country-select').val();
    let sex = $('#mortality-sex-select').val();
    
    let requestUrl = url + country + '/' + sex + '/' + 0 + '/today/';
    
    $.getJSON(requestUrl, function (data) {
        collapseExpandToggle('mortality-wizard-arrow-up', 'mortality-wizard-arrow-down', 'mortality-wizard-container');
        createMortalityChart(country, sex, data.mortality_distribution);
    });
}
