const API_KEY = 'f7a02d75c1d75b0a707ecd3277e64257';
const COUNTRY_CODE = 'US'; // Replace with the desired country code

// Function to fetch popular movies for a specific country
async function fetchPopularMovies() {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&region=${COUNTRY_CODE}`);
    const data = await response.json();
    return data.results.slice(0, 10); // Return the top 10 popular movies
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
}

// Function to fetch recent releases
async function fetchRecentReleases() {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&region=${COUNTRY_CODE}`);
    const data = await response.json();
    return data.results.slice(0, 10); // Return the top 10 recent releases
  } catch (error) {
    console.error("Error fetching recent releases:", error);
    return [];
  }
}

// Function to fetch top-rated movies
async function fetchTopRatedMovies() {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&region=${COUNTRY_CODE}`);
    const data = await response.json();
    return data.results.slice(0, 10); // Return the top 10 top-rated movies
  } catch (error) {
    console.error("Error fetching top-rated movies:", error);
    return [];
  }
}

// General function to display movies
function displayMovies(movies, containerId, templateId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // Clear previous content

  movies.forEach(movie => {
    const template = document.getElementById(templateId).content.cloneNode(true);
    const poster = template.querySelector(".trending-movie-poster");
    poster.src = movie.poster_path ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}` : 'placeholder.jpg';
    poster.alt = movie.title;

    // Add click event listener to redirect to the informatics page with the movie ID
    poster.addEventListener("click", () => {
      window.location.href = `informatics.html?id=${movie.id}`;
    });

    template.querySelector(".trending-movie-title").textContent = movie.title;
    container.appendChild(template);
  });
}

// Function to handle carousel navigation
function setupCarousel() {
  document.querySelectorAll(".left-arrow").forEach(arrow => {
    arrow.addEventListener("click", (e) => {
      e.target.nextElementSibling.scrollBy({ left: -200, behavior: 'smooth' });
    });
  });

  document.querySelectorAll(".right-arrow").forEach(arrow => {
    arrow.addEventListener("click", (e) => {
      e.target.previousElementSibling.scrollBy({ left: 200, behavior: 'smooth' });
    });
  });
}

// Fetch and display movies on page load
document.addEventListener("DOMContentLoaded", async () => {
  const [popularMovies, recentReleases, topRatedMovies] = await Promise.all([
    fetchPopularMovies(),
    fetchRecentReleases(),
    fetchTopRatedMovies()
  ]);

  displayMovies(popularMovies, "trendingMovies", "trending-movie-template");
  displayMovies(recentReleases, "recentReleases", "recent-release-template");
  displayMovies(topRatedMovies, "topRatedMovies", "top-rated-template");
  setupCarousel();
});
