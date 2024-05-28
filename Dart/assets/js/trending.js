const API_KEY = 'f7a02d75c1d75b0a707ecd3277e64257';

// Function to fetch popular movies
async function fetchPopularMovies() {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results.slice(0, 10); // Return the top 10 popular movies
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
}

// Function to display popular movies
function displayPopularMovies(movies) {
  const trendingMoviesElement = document.getElementById("trendingMovies");
  trendingMoviesElement.innerHTML = ""; // Clear previous content

  movies.forEach(movie => {
    const template = document.getElementById("trending-movie-template").content.cloneNode(true);
    const poster = template.querySelector(".trending-movie-poster");
    poster.src = movie.poster_path ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}` : 'placeholder.jpg';
    poster.alt = movie.title;

    // Add click event listener to redirect to the informatics page with the movie ID
    poster.addEventListener("click", () => {
      window.location.href = `informatics.html?id=${movie.id}`;
    });

    template.querySelector(".trending-movie-title").textContent = movie.title;
    trendingMoviesElement.appendChild(template);
  });
}

// Function to handle carousel navigation
function setupCarousel() {
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");
  const trendingMoviesElement = document.getElementById("trendingMovies");

  leftArrow.addEventListener("click", () => {
    trendingMoviesElement.scrollBy({ left: -200, behavior: 'smooth' });
  });

  rightArrow.addEventListener("click", () => {
    trendingMoviesElement.scrollBy({ left: 200, behavior: 'smooth' });
  });
}

// Fetch and display popular movies on page load
document.addEventListener("DOMContentLoaded", async () => {
  const popularMovies = await fetchPopularMovies();
  displayPopularMovies(popularMovies);
  setupCarousel();
});
