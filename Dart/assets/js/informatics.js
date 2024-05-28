const API_KEY = 'f7a02d75c1d75b0a707ecd3277e64257';

// Function to get movie ID from URL
function getMovieIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Function to fetch movie details by ID
async function fetchMovieDetails(movieId) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

// Function to display movie details
function displayMovieDetails(movie) {
  const movieDetailsElement = document.getElementById("movieDetails");
  movieDetailsElement.innerHTML = ""; // Clear previous content

  const template = document.getElementById("movie-detail-template").content.cloneNode(true);
  template.querySelector(".movie-poster").src = movie.poster_path ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}` : 'placeholder.jpg';
  template.querySelector(".movie-title").textContent = movie.title;
  template.querySelector(".movie-release-date").textContent = movie.release_date;
  template.querySelector(".movie-overview").textContent = movie.overview;

  movieDetailsElement.appendChild(template);
}

// Fetch and display movie details on page load
document.addEventListener("DOMContentLoaded", async () => {
  const movieId = getMovieIdFromUrl();
  if (movieId) {
    const movie = await fetchMovieDetails(movieId);
    if (movie) {
      displayMovieDetails(movie);
    } else {
      document.getElementById("movieDetails").innerHTML = "Movie details not found.";
    }
  } else {
    document.getElementById("movieDetails").innerHTML = "Invalid movie ID.";
  }
});
