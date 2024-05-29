const API_KEY = 'f7a02d75c1d75b0a707ecd3277e64257';

// Function to get movie ID from URL
function getMovieIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Function to fetch movie details by ID
async function fetchMovieDetails(movieId) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`);
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
  template.querySelector(".movie-genres").textContent = movie.genres.map(genre => genre.name).join(', ');
  template.querySelector(".movie-runtime").textContent = `${movie.runtime} minutes`;
  template.querySelector(".movie-rating").textContent = `${movie.vote_average.toFixed(1)} / 10`;

  const director = movie.credits.crew.find(member => member.job === 'Director');
  if (director) {
    template.querySelector(".movie-director").textContent = director.name;
  }

  const cast = movie.credits.cast.slice(0, 5).map(member => member.name).join(', ');
  template.querySelector(".movie-cast").textContent = cast;

  const trailer = movie.videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
  if (trailer) {
    const trailerContainer = template.querySelector(".movie-trailer-container");
    trailerContainer.style.display = 'block';
    template.querySelector(".movie-trailer").src = `https://www.youtube.com/embed/${trailer.key}`;
  }

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

// Fetch and display recommended movies on page load
document.addEventListener("DOMContentLoaded", async () => {
  const movieId = getMovieIdFromUrl();
  if (movieId) {
    const recommendedMovies = await fetchRecommendedMovies(movieId);
    if (recommendedMovies.length > 0) {
      displayRecommendedMovies(recommendedMovies);
    } else {
      document.getElementById("recommendedMovies").innerHTML = "No recommended movies found.";
    }
  } else {
    document.getElementById("recommendedMovies").innerHTML = "Invalid movie ID.";
  }
});
