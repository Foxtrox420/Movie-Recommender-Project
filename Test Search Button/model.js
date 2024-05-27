const API_KEY = 'f7a02d75c1d75b0a707ecd3277e64257';

// Function to fetch movie details by title
async function fetchMovieDetails(title) {
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`);
  const data = await response.json();
  return data.results[0]; // Return the first result
}

// Function to fetch similar movies
async function fetchSimilarMovies(movieId) {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
}

// Function to display movie recommendations
function displayRecommendations(recommendations) {
  const recommendationsElement = document.getElementById("recommendations");
  recommendationsElement.innerHTML = ""; // Clear previous recommendations
  recommendations.forEach(movie => {
    const title = movie.title;
    const poster = `https://image.tmdb.org/t/p/w200/${movie.poster_path}`;
    const movieElement = `
      <div>
        <img src="${poster}" alt="${title}">
        <h3>${title}</h3>
      </div>
    `;
    recommendationsElement.innerHTML += movieElement;
  });
}

// Event listener for Search button click
document.getElementById("searchButton").addEventListener("click", async () => {
  const inputTitle = document.getElementById("movieInput").value;
  if (inputTitle) {
    const movie = await fetchMovieDetails(inputTitle);
    if (movie) {
      displayMovieDetails(movie);
    } else {
      document.getElementById("searchResults").innerHTML = "Movie not found";
    }
  } else {
    document.getElementById("searchResults").innerHTML = "";
  }
});

// Function to display movie details
function displayMovieDetails(movie) {
  const searchResultsElement = document.getElementById("searchResults");
  searchResultsElement.innerHTML = ""; // Clear previous results
  const title = movie.title;
  const poster = `https://image.tmdb.org/t/p/w200/${movie.poster_path}`;
  const overview = movie.overview;
  const releaseDate = movie.release_date;
  const movieDetails = `
    <div>
      <img src="${poster}" alt="${title}">
      <h3>${title}</h3>
      <p><strong>Release Date:</strong> ${releaseDate}</p>
      <p><strong>Overview:</strong> ${overview}</p>
    </div>
  `;
  searchResultsElement.innerHTML = movieDetails;
}
