const apiKey = "ee2649dc"
const searchBtn = document.getElementById("searchBtn")
const searchInput = document.getElementById("searchInput");

// watchlist //
function getWatchlist() {
    return JSON.parse(localStorage.getItem("watchlist")) || []
}

function saveWatchlist(list) {
    localStorage.setItem("watchlist", JSON.stringify(list))
}





//searchbutton for mouse and keyboard//
if (searchBtn) {
    searchBtn.addEventListener("click", searchMovies)
}

if (searchInput) {
    searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            searchMovies()
        }
    })
}

//function for searching movie title and card.//
async function searchMovies() {

const query = document.getElementById("searchInput").value;

const url = `https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`;

const response = await fetch(url);
const data = await response.json();

console.log(data);
displayResults(data)
}

//function that gets the rest of the details, ratings etc //
async function getMovieDetails(imdbID) {
    const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()
    return data
}

//Display function, displays the data to our main/results //
async function displayResults(data) {
    const resultsDiv = document.getElementById("results")
    resultsDiv.innerHTML = ""

    if (data.Response === "False") {
        resultsDiv.innerHTML = `<p>No results found</p>`
        return
    }

    for (const movie of data.Search){
    const details = await getMovieDetails(movie.imdbID)

    const movieEL = document.createElement("div")
    movieEL.classList.add("movie")

    movieEL.innerHTML =`
        <img src="${movie.Poster !== "N/A" ? movie.Poster : ""}" class="poster"/>

        <div class="movie-info">
            <h2>${details.Title} ⭐ ${details.imdbRating}</h2>
            <p class="meta">
                ${details.Runtime} • ${details.Genre}
            </p>
            <p class="description">
                ${details.Plot}
            </p>
            <button class="watchlist" data-id="${movie.imdbID}">+ Watchlist</button>
        </div>
    `

    const button = movieEL.querySelector(".watchlist")

    const watchlist = getWatchlist()
    const exists = watchlist.find(m => m.imdbID === movie.imdbID)

    button.textContent = exists ? "Remove" : "+ Watchlist"

    button.addEventListener("click", () => {
        let watchlist = getWatchlist()
        const index = watchlist.findIndex(m => m.imdbID === movie.imdbID)

        if (index === -1) {
            watchlist.push({
                imdbID: movie.imdbID,
                title: details.Title,
                poster: movie.Poster
            })
            button.textContent = "Remove"
        } else {
            watchlist.splice(index, 1)
            button.textContent = "+ Watchlist"
        }

        saveWatchlist(watchlist)
    })

    resultsDiv.appendChild(movieEL)
    }
                                    }


       //rendering of saved movies to watchlist //                             

       function renderWatchlist() {
        const container = document.getElementById("watchlist")
        if (!container) return 

        const watchlist = getWatchlist()

        if (watchlist.length === 0) {
            container.innerHTML = "<p>Your watchlist is empty</p>"
            return
        }

        container.innerHTML = ""

        watchlist.forEach(movie => {
            const movieEL = document.createElement("div")
            movieEL.classList.add("movie")

            movieEL.innerHTML = `
                    <img src="${movie.poster !== "N/A" ? movie.poster : ""}" class="poster"/>

                    <div class="movie-info">
                    <h2>${movie.title}</h2>
                    <button class="remove" data-id="${movie.imdbID}">Remove</button>
                    </div>
                    `
        const removeBtn = movieEL.querySelector(".remove")
        
        removeBtn.addEventListener("click", () => {
            let watchlist = getWatchlist()
            watchlist = watchlist.filter(m => m.imdbID !== movie.imdbID)
            saveWatchlist(watchlist)

            renderWatchlist()
        })

        
        container.appendChild(movieEL)

        });

       }

       renderWatchlist()