function submitMortalityRequest(url) {
    console.log(url);

    let country = $('#mortality-country-select').val();
    let sex = $('#mortality-sex-select').val();

    console.log(country + ' ' + sex);

    let requestUrl = url + country + '/' + sex + '/' + 0 + '/today/';
    
    /*$('#mortality-country-select option').each(function () {
        let country = $(this).val();
        let requestUrl = url + country + '/male/' + 0 + '/today/';

        $.ajax({
            url: requestUrl,
            dataType: 'json',
            success: function (result) {
                console.log('SUCCESS: ', result);
            },
            error: function (result) {
                console.log('ERROR: ', result);
                console.log(country);
                errorCountries.push(country);
                console.log(errorCountries);
            }
        });
    });*/
    
    $.getJSON(requestUrl, function (data) {
        console.log('DATA: ', data);

        collapseExpandToggle('mortality-wizard-arrow-up', 'mortality-wizard-arrow-down', 'mortality-wizard-container');
        createMortalityChart(country, sex, data.mortality_distribution);
    });
}
