function submitMortalityRequest(url) {
    console.log(url);

    let country = $('#mortality-country-select').val();
    let sex = $('#mortality-sex-select').val();

    console.log(country + ' ' + sex);

    let requestUrl = url + country + '/' + sex + '/' + 0 + '/today/';
    console.log(requestUrl);

    $.ajax({
        type: "GET",
        url: requestUrl,
        dataType: "jsonp",
        contentType: "application/json",
        success: function (result) {
            console.log(result);

        },
        error: function (errorResult) {

        }
    });
}
