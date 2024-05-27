const API_KEY = 'f7a02d75c1d75b0a707ecd3277e64257';

// Function to fetch movie details by title
async function fetchMovieDetails(title) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`);
    const data = await response.json();
    return data.results[0]; // Return the first result
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

// Function to fetch similar movies
async function fetchSimilarMovies(movieId) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results.slice(0, 5); // Return the top 5 recommendations
  } catch (error) {
    console.error("Error fetching similar movies:", error);
    return [];
  }
}

// Function to display movie details
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

// Function to display movie recommendations
function displayRecommendations(recommendations) {
  const recommendationsElement = document.getElementById("recommendations");
  recommendationsElement.innerHTML = ""; // Clear previous recommendations
  recommendations.forEach(movie => {
    const template = document.createElement('div');
    template.classList.add('recommendation');
    const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}` : 'placeholder.jpg';
    template.innerHTML = `
      <img src="${poster}" alt="${movie.title}" class="recommendation-poster">
      <h3 class="recommendation-title">${movie.title}</h3>
    `;
    recommendationsElement.appendChild(template);
  });
}

// Event listener for Search button click
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
