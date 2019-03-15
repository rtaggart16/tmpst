function getPopulationCountries() {
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json",
        success: function (result) {
            console.log(result);
        },
        error: function (errorResult) {
            console.log(errorResult);
        }
    });
}