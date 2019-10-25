const addMovieModal = document.getElementById("add-movie-modal");
async function getMoviesFromAPI() {
  //fetch send a GET request by default. first parameter is the url
  const response = await fetch(
    "https://infinite-stream-78296.herokuapp.com/movies"
  );

  //when response is recieved, we only the response body with .json() method

  const movies = await response.json();

  //looping over each movie object
  movies.forEach(movie => {
    //we create an html template markup for each movie
    let markup = `<div class="card-body">
          <h5 class="card-title">${movie.name} </h5>
          <p class="card-text">
          ${movie.description}
          </p>
          <button class="btn btn-danger delete-movie" data-movieid="${
            movie._id
          }">Delete Movie</button>
        </div>
        <div class="card-footer"> ${movie.genre
          .map(
            genre =>
              `<span class="badge badge-pill badge-primary m-1">${genre}</span>`
          )
          .join("")}
        </div>
         `;
    //create a node that contains the template markup
    let card = document.createElement("div");
    card.classList.add("card"); //add "card" class to card node
    card.style.width = "300px"; //add style to card node
    card.innerHTML = markup; //fill card node with the template markup
    document.getElementById("movies").appendChild(card); //append card node to movies
  });
}
async function postMovieToAPI(event) {
  event.preventDefault();
  //get values of the form inputs
  const movieName = document.getElementById("movie-name").value;
  const movieDescription = document.getElementById("movie-description").value;
  const movieReleased = document.getElementById("movie-released").value;
  const movieGenres = document.getElementById("movie-genres").value;

  //split genres by "," then trim to avoid whitespaces
  const genreArray = movieGenres.split(",").map(genre => genre.trim());
  //prepare the body of the request, keys must match with the Movie model
  const requestBody = {
    name: movieName,
    description: movieDescription,
    released: movieReleased,
    genre: genreArray
  };

  //give options to fetch  like HTTP method, additional header etc.

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  };
  //send the request ans await for response
  const response = await fetch(
    "https://infinite-stream-78296.herokuapp.com/movies",
    options
  );
  const responseJson = await response.json();

  $("#add-movie-modal").modal("toggle"); //toggle modal
  $("#movies").html(""); //reset the content of the div with id movies
  getMoviesFromAPI(); // fetch all movies again
}

async function deleteMovieFromAPI() {
  const movieId = $(this).data("movieid");
  await fetch(`https://infinite-stream-78296.herokuapp.com/movies/${movieId}`, {
    method: "DELETE"
  });
  $("#movies").html(""); //reset
  getMoviesFromAPI();
}

getMoviesFromAPI();
//fetch all movies when a user first enters the website
const addMovieform = document.getElementById("add-movie-form");
//add event listener for the form , when a user submit call postMovieAPI fuction
addMovieform.addEventListener("submit", postMovieToAPI);

$("#movies").on("click", ".delete-movie", deleteMovieFromAPI);
