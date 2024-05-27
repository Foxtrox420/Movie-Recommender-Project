const API_KEY = 'f7a02d75c1d75b0a707ecd3277e64257';

async function fetchMovieDetails(title) {
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`);
  const data = await response.json();
  return data.results[0]; // Return the first result
}

async function fetchSimilarMovies(movieId) {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
}

function displayRecommendations(recommendations) {
  const recommendationsElement = document.getElementById("recommendations");
  recommendationsElement.innerHTML = ""; // Clear previous recommendations
  recommendations.forEach(movie => {
    const template = document.getElementById("recommendation-template").content.cloneNode(true);
    template.querySelector(".recommendation-poster").src = movie.poster_path ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}` : 'placeholder.jpg';
    template.querySelector(".recommendation-title").textContent = movie.title;
    recommendationsElement.appendChild(template);
  });
}

document.getElementById("searchButton").addEventListener("click", async () => {
  const inputTitle = document.getElementById("movieInput").value;
  if (inputTitle) {
    const movie = await fetchMovieDetails(inputTitle);
    if (movie) {
      displayMovieDetails(movie);
      const recommendations = await fetchSimilarMovies(movie.id);
      displayRecommendations(recommendations);
    } else {
      document.getElementById("searchResults").innerHTML = "Movie not found";
      document.getElementById("recommendations").innerHTML = "";
    }
  } else {
    document.getElementById("searchResults").innerHTML = "Please enter a movie title";
    document.getElementById("recommendations").innerHTML = "";
  }
});

function displayMovieDetails(movie) {
  const searchResultsElement = document.getElementById("searchResults");
  searchResultsElement.innerHTML = ""; // Clear previous results

  const template = document.getElementById("movie-details-template").content.cloneNode(true);
  template.querySelector(".movie-poster").src = movie.poster_path ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}` : 'placeholder.jpg';
  template.querySelector(".movie-title").textContent = movie.title;
  template.querySelector(".movie-release-date").textContent = movie.release_date;
  template.querySelector(".movie-overview").textContent = movie.overview;

  searchResultsElement.appendChild(template);
}
