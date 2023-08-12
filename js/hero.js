// get comics list element
const comicsList = document.getElementById("comics-list");
// get series list element
const seriesList = document.getElementById("series-list");
// get stories list element
const storiesList = document.getElementById("stories-list");
// get events list element
const eventsList = document.getElementById("events-list");
// get img desc container
const imgDescContainer = document.getElementById("img-desc-container");
// get id of the character from local storage
const id = localStorage.getItem("id");
// time stamp
var timeStamp = Date.now();
const PUBLIC_KEY = "a650e0c84f27b596af33dec96805be11";
const PRIVATE_KEY = "af44953c65333ab0d6912f8c46583a20a4a370d6";
const queryParams = `?ts=${timeStamp}&apikey=${PUBLIC_KEY}&hash=${md5(
    timeStamp + PRIVATE_KEY + PUBLIC_KEY
)}`;
// base url
const BASE_URL = "https://gateway.marvel.com/v1/public/characters/";

// empty all the lists
comicsList.innerHTML = "";
storiesList.innerHTML = "";
seriesList.innerHTML = "";
eventsList.innerHTML = "";

//populate comics list
getComicsData();
//populate series list
getSeriesData();
//populate stories list
getStoriesData();
//populate events list
getEventsData();
//get character
getCharacter();

// get character
function getCharacter() {
    var url = BASE_URL + id + queryParams;
    fetch(url)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            updateCharacter(data.data.results[0]);
        })
        .catch((error) => {
            console.log(error);
        });
}

// update items in the container with character data
function updateCharacter(data) {
    imgDescContainer.innerHTML = `<img
                                      src="${data.thumbnail.path}.${data.thumbnail.extension}"
                                      alt=""
                                  />
                                  <div class="description-container">
                                      <h2>${data.name}</h2>
                                      <p class="fs-6">
                                          ${data.description}
                                      </p>
                                  </div>`;
}

// get comics data
function getComicsData() {
    var url = BASE_URL + `${id}/comics` + queryParams;
    getData(url, "comics");
}

// get series data
function getSeriesData() {
    var url = BASE_URL + `${id}/series` + queryParams;
    getData(url, "series");
}

// get stories data
function getStoriesData() {
    var url = BASE_URL + `${id}/stories` + queryParams;
    getData(url, "stories");
}

// get events data
function getEventsData() {
    var url = BASE_URL + `${id}/events` + queryParams;
    getData(url, "events");
}

// get data
function getData(url, type) {
    fetch(url)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            fillData(data.data.results, type);
        })
        .catch((error) => {
            console.log(error);
        });
}

// create and fill the data inside html
/*
 * @param data - data fetched from url
 * @param type - type can be comics, series, stories, events
 */
function fillData(data, type) {
    var dataFound = data.length == 0 ? false : true;
    if (dataFound == 0) {
        return;
    }

    // iterate elements inside data
    data.forEach((ele) => {
        var newItem = document.createElement("li");
        var img = "";
        img = ele.thumbnail == null
                ? ""
                : `<img src="${ele.thumbnail.path}.${ele.thumbnail.extension}" alt="">`;
        newItem.innerHTML = `
                        <div class="details-container">
                            ${img}
                            <div class = "details-container-child">
                            <h4>TITLE</h4>
                            <h6>${ele.title}</h6>
                            </br>
                            <h4>DESCRIPTION</h4>
                            <p>
                                ${
                                    ele.description == "" ||
                                    ele.description == null
                                        ? "No description found"
                                        : ele.description
                                }
                            </p>
                            </div>
                            
                        </div>`;
        if (type == "comics") {
            comicsList.appendChild(newItem);
        }
        if (type == "stories") {
            storiesList.appendChild(newItem);
        }
        if (type == "series") {
            seriesList.appendChild(newItem);
        }
        if (type == "events") {
            eventsList.appendChild(newItem);
        }
    });
}
