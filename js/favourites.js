// get container
var heroContainer = document.getElementById("fav-heroes-container");
// get favourite heroes list from local storage
var favouriteHeroesList = JSON.parse(localStorage.getItem("favourites"));
// time stamp
var timeStamp = Date.now();
const PUBLIC_KEY = "a650e0c84f27b596af33dec96805be11";
const PRIVATE_KEY = "af44953c65333ab0d6912f8c46583a20a4a370d6";

// get characters
getCharacters();

function getCharacters() {
    favouriteHeroesList.forEach((id) => {
        fetchCharacter(id);
    });
}

function fetchCharacter(id) {
    // url for character with a specific id
    const URL = `https://gateway.marvel.com/v1/public/characters/${id}?ts=${timeStamp}&apikey=${PUBLIC_KEY}&hash=${md5(
        timeStamp + PRIVATE_KEY + PUBLIC_KEY
    )}`;

    fetch(URL)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            // add character to list
            addCharacter(data.data.results);
        })
        .catch((error) => {
            console.log(error);
        });
}

// add character to list
function addCharacter(data) {
    // data will contain 1 element always because api call with a specific
    // character id will always return data with one element
    data = data[0];

    // create new item and add it in the container
    var newItem = document.createElement("div");
    newItem.setAttribute("id", `${data.id}`);
    newItem.classList.add("col-md-4");
    newItem.classList.add("mb-2");
    newItem.innerHTML = `<div class="card h-100">
                            <img src="${data.thumbnail.path}.${data.thumbnail.extension}" class="card-img-top" alt="..." onclick="goToHeroesPage(${data.id})" />
                            <div class="card-body">
                                <h5 class="card-title">${data.name}</h5>
                                <p class="card-text">
                                    ${data.description}
                                </p>
                                <button
                                    type="button"
                                    class="btn btn-outline-danger w-100 bottom-2"
                                    onclick="removeFromFavourites(${data.id})"
                                >
                                    Remove from favourite
                                </button>
                            </div>
                        </div>`;

    heroContainer.appendChild(newItem);
}

// remove from favourites
function removeFromFavourites(id) {
    // get element to remove
    var ele = document.getElementById(id);
    ele.remove();

    // get index of character
    var index = favouriteHeroesList.indexOf(id);
    if (index > -1) {
        favouriteHeroesList.splice(index, 1);
        localStorage.setItem("favourites", JSON.stringify(favouriteHeroesList));
        alert("Character has been removed from favourites!!");
    }
}

// go to heroes page
function goToHeroesPage(id) {
    localStorage.setItem("id", id);
    window.location.href = "../pages/hero.html";
}
