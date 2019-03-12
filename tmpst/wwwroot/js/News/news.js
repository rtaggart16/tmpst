/*
    Author Info:

    Name(s) - Ross Taggart, Katie King
    Student Number - S1828840, S1827986
    Date Created - 22/02/2019
    Version - 1.0.1

    Description:
    JavaScript file which contains the functions and event handlers for the weather system
*/

let currentHeadlinesDataset = {};


function submitNewsRequest(key) {

    //contact the api with the location request
    resetNewsPage();
    contactAPI(key);

};

function contactAPI(key) {
    let requestURL = 'https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=ff66547bdfe04a5ebb049e7743482186' + '.json?key=' + key;
}