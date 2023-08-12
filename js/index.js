// get heroes list element
const heroesList = document.getElementById("heroes-list");
const PUBLIC_KEY = "a650e0c84f27b596af33dec96805be11";
const PRIVATE_KEY = "af44953c65333ab0d6912f8c46583a20a4a370d6";
// timestamp
const timeStamp = Date.now();
//URL to get characters, max limit is 100
const URL = `http://gateway.marvel.com/v1/public/characters?ts=${timeStamp}&apikey=${PUBLIC_KEY}&hash=${md5(
    timeStamp + PRIVATE_KEY + PUBLIC_KEY
)}&limit=100`;
// var heroes;
// this holds search entered by user
var searchText = "";
// flag to determine whether searching or not to prevent continuous api calls
var searching = false;
//timer for getting search results, using timer to prevent fetch api call stack
var searchTimer = setInterval(() => {
    // if not searching then return
    if (!searching) {
        return;
    }
    // if search field has no value then get all characters
    if (searchText == "") {
        getCharacters();
        return;
    }

    //call api for search
    fetch(
        `http://gateway.marvel.com/v1/public/characters?ts=${timeStamp}&apikey=${PUBLIC_KEY}&hash=${md5(
            timeStamp + PRIVATE_KEY + PUBLIC_KEY
        )}&limit=100&nameStartsWith=${searchText}`
    )
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            updateList(data.data.results);
            if (data.data.results.length == 0) {
                heroesList.innerHTML =
                    "<h4 style='color: white;'>Character not found</h4>";
            }
            searching = false;
        })
        .catch((error) => {
            console.log(error);
        });
}, 3000);

// get characters
getCharacters();

// get characters
function getCharacters() {
    fetch(URL)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            updateList(data.data.results);
            searching = false;
        })
        .catch((error) => {
            console.log(error);
        });
}

// update characters list, populate list with search data
function updateList(data) {
    heroesList.innerHTML = "";

    // iterate every character inside data
    data.forEach((element) => {
        // create list item and insert into heroes list
        let newItem = document.createElement("li");
        newItem.innerHTML = `<div class="card w-100 mb-3">
                        <div class="row g-0">
                            <div class="col-md-3">
                                <img
                                    src="${element.thumbnail.path}.${element.thumbnail.extension}"
                                    class="img-fluid rounded-start"
                                    alt="superhero"
                                    onclick="goToHeroesPage(${element.id})"
                                />
                            </div>
                            <div class="col-md-9">
                                <div class="card-body">
                                    <h5 class="card-title">${element.name}</h5>
                                    <p class="card-text">
                                        ${element.description}
                                    </p>
                                    <button type="button" class="btn btn-outline-success" onclick="addToFav(${element.id})">Add to favourite</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
        heroesList.appendChild(newItem);
    });
}

// search for character, used on onclick listener
function findHeroes(value) {
    searchText = value;
    searching = true;
    heroesList.innerHTML = "<h4 style='color: white;'>Loading...</h4>";
}

// add to favourite
function addToFav(id) {
    // get fav from local storage
    var arr = JSON.parse(localStorage.getItem("favourites"));
    if (arr == null) {
        arr = [];
    }

    // add to array
    if (arr.includes(id)) {
        alert("Hero is already added to favourites");
        return;
    }
    arr.push(id);
    localStorage.setItem("favourites", JSON.stringify(arr));
    alert("Hero is added to favourites");
}

// go to heroes page
function goToHeroesPage(id) {
    localStorage.setItem("id", id);
    window.location.href = "pages/hero.html";
}
