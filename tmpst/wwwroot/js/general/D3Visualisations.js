function createD3Visualisation(data, D3Type) {

    console.log(data, D3Type);

    //Chooses Visualisation
    switch (D3Type){
        case D3Type = "show-reel":
            showReelBuilder(data);
            break;
        case D3Type = "bubble-chart":
            bubbleChartBuilder(data);
            break;
        case D3Type = "radar-chart":
            radarChartBuilder(data);
            break;
        case D3Type = "multi-packaging":
            multiPackagingBuilder(data);
            break;
        default:
            Swal.fire({
                type: 'error',
                title: 'Data Request Error',
                text: 'An error has occurred when submitting your request. Please try again with different criteria'
            });
            break;
    }
}


function showReelBuilder(data) {
    //Laura - this function is for your show reel visualisation
}

function bubbleChartBuilder(data) {
    //Laura - this function is for your bubble chart visualisation
}

function radarChartBuilder(data) {
    //Aidan - this function is for your radar chart visualisation
}

function multiPackagingBuilder(data) {
    //Aidan - this function is for your multi packaging visualisation
}