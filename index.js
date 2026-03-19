const apiKey = "ee2649dc"
const searchBtn = document.getElementById("searchBtn")
const searchInput = document.getElementById("searchInput");
//searchbutton for mouse//
searchBtn.addEventListener("click", function(){
    searchMovies()
})
//searchbutton for keyboard(Enter)//
searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        searchMovies();
    }
})

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
                <button class="watchlist">+ Watchlist</button>
            </div>
        `

        resultsDiv.appendChild(movieEL)
    };
}
