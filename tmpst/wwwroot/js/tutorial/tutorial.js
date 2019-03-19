﻿//let allTutorialPages = $('#single-page-application-tutorial').add($('#user-secret-tutorial'));
let allTutorialPages;

$(function () {
    $('#tutorial-menu-container').jstree({
        "core": {
            "themes": {
                "variant": "large",
                //"responsive": "true"
            }
        }
    });

    loadViews();

    $('#tutorial-menu-container').on("changed.jstree", function (e, data) {
        console.log(data.node.id);
        processNodeRequest(data.node.id);
    });
});

function loadViews() {
    allTutorialPages = $('#single-page-application-tutorial')
        .add($('#user-secret-tutorial'))
        .add($('#partial-view-tutorial'))
        .add($('#asp-core-tutorial'))
        .add($('#bootstrap-4-tutorial'))
        .add($('#visual-studio-tutorial'))
        .add($('#net-sdk-tutorial'))
        .add($('#json-tutorial'))
        .add($('#geojson-tutorial'))
        .add($('#earthquake-tutorial'))
        .add($('#geonames-tutorial'))
        .add($('#mortality-tutorial'))
        .add($('#news-tutorial'))
        .add($('#pollution-tutorial'))
        .add($('#population-tutorial'))
        .add($('#rest-countries-tutorial'))
        .add($('#weather-tutorial'))
        .add($('#d3-tutorial'))
        .add($('#chartsjs-tutorial'))
        .add($('#highcharts-tutorial'))
        .add($('#echarts-tutorial'))
        .add($('#google-maps-tutorial'));
}

function processNodeRequest(id) {
    console.log('ID: ' + id);

    // Overview
    if (id == 'single-page-desc-li') {
        fadeSpecifiiedTut('single-page-application-tutorial');
    }
    if (id == 'user-secret-desc-li') {
        fadeSpecifiiedTut('user-secret-tutorial');
    }
    if (id == 'partial-view-desc-li') {
        fadeSpecifiiedTut('partial-view-tutorial');
    }
    if (id == 'asp-net-core-desc-li') {
        fadeSpecifiiedTut('asp-core-tutorial');
    }
    if (id == 'bootstrap-4-desc-li') {
        fadeSpecifiiedTut('bootstrap-4-tutorial');
    }

    

    // Pre-Requisites
    if (id == 'visual-studio-desc-li') {
        fadeSpecifiiedTut('visual-studio-tutorial');
    }
    if (id == 'net-sdk-desc-li') {
        fadeSpecifiiedTut('net-sdk-tutorial');
    }

    // Data Types
    if (id == 'json-desc-li') {
        fadeSpecifiiedTut('json-tutorial');
    }
    if (id == 'geojson-desc-li') {
        fadeSpecifiiedTut('geojson-tutorial');
    }


    // APIs
    if (id == 'earthquake-api-desc-li') {
        fadeSpecifiiedTut('earthquake-tutorial');
    }
    if (id == 'geonames-api-desc-li') {
        fadeSpecifiiedTut('geonames-tutorial');
    }
    if (id == 'mortality-api-desc-li') {
        fadeSpecifiiedTut('mortality-tutorial');
    }
    if (id == 'news-api-desc-li') {
        fadeSpecifiiedTut('news-tutorial');
    }
    if (id == 'pollution-api-desc-li') {
        fadeSpecifiiedTut('pollution-tutorial');
    }
    if (id == 'population-api-desc-li') {
        fadeSpecifiiedTut('population-tutorial');
    }
    if (id == 'rest-countries-api-desc-li') {
        fadeSpecifiiedTut('rest-countries-tutorial');
    }
    if (id == 'weather-api-desc-li') {
        fadeSpecifiiedTut('weather-tutorial');
    }
        // TODO


    // Visualisations
    if (id == 'd3-desc-li') {
        fadeSpecifiiedTut('d3-tutorial');
    }
    if (id == 'chartsjs-desc-li') {
        fadeSpecifiiedTut('chartsjs-tutorial');
    }
    if (id == 'highcharts-desc-li') {
        fadeSpecifiiedTut('highcharts-tutorial');
    }
    if (id == 'echarts-desc-li') {
        fadeSpecifiiedTut('echarts-tutorial');
    }
    if (id == 'google-maps-desc-li') {
        fadeSpecifiiedTut('google-maps-tutorial');
    }



}

function tutRemoveFullSCreen(elmID) {
    let elem = document.getElementById(elmID);
    if (elmID == 'user-secret-tutorial') {
        $('#usr-scrt-rmv-full-screen-btn').fadeOut(300).promise().done(function () {
            $('#usr-scrt-full-screen-btn').fadeIn(300);
        });
    }
    elem.exitFullscreen();
}

function openTutorialLink(address) {
    event.preventDefault();
    window.open(address);
}

function downloadPDF(fileName) {
    event.preventDefault();
    window.open('https://localhost:44359/tutorials/' + fileName);
}

function fadeSpecifiiedTut(viewID) {
    console.log(allTutorialPages);
    allTutorialPages.fadeOut(300).promise().done(function () {
        $('#' + viewID).fadeIn(300);
    });
}

function tutFullScreen(elmID) {
    let enabled = document.fullscreenEnabled;
    if (enabled == true) {
        let elem = document.getElementById(elmID);
        if (elmID == 'user-secret-tutorial') {
            $('#usr-scrt-full-screen-btn').fadeOut(300).promise().done(function () {
                $('#usr-scrt-rmv-full-screen-btn').fadeIn(300);
            });
        }
        elem.requestFullscreen();
    }
    else {
        Swal.fire({
            type: 'error',
            title: 'Cannot toggle fullscreen',
            text: 'Unfortunately, your browser cannot toggle fullscreen. Please run in chrome for this feature'
        })
    }
}