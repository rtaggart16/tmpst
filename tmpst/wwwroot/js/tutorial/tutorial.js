//let allTutorialPages = $('#single-page-application-tutorial').add($('#user-secret-tutorial'));
let allTutorialPages;

$(function () {
    $('#tutorial-menu-container').jstree({
        "core": {
            "themes": {
                "variant": "large",
                "responsive": "true"
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
    allTutorialPages = $('#single-page-application-tutorial').add($('#user-secret-tutorial'))
        .add($('#partial-view-tutorial'))
        .add($('#asp-core-tutorial'))
        .add($('#bootstrap-4-tutorial'));
}

function processNodeRequest(id) {
    console.log('ID: ' + id);
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
    if (id == 'visual-studio-desc-li') {
        fadeSpecifiiedTut('visual-studio-tutorial');
    }
    if (id == 'net-sdk-desc-li') {
        fadeSpecifiiedTut('net-sdk-tutorial');
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