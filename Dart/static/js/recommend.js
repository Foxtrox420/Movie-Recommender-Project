const API_KEY = 'f7a02d75c1d75b0a707ecd3277e64257';

// Function to fetch genres
async function fetchGenres() {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}

// Function to fetch movies based on preferences
async function fetchMovies(genre, yearRange, rating) {
  try {
    const url = new URL('https://api.themoviedb.org/3/discover/movie');
    url.searchParams.append('api_key', API_KEY);
    if (genre) url.searchParams.append('with_genres', genre);
    if (yearRange) url.searchParams.append('primary_release_date.gte', yearRange.gte);
    if (yearRange && yearRange.lt) url.searchParams.append('primary_release_date.lte', yearRange.lt);
    if (rating) url.searchParams.append('vote_average.gte', rating);

    const response = await fetch(url);
    const data = await response.json();
    return data.results; // Return all results
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
}

// Event listener for quiz form submission
document.getElementById("quizForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const selectedGenre = document.getElementById("genreSelect").value;
  const selectedYear = document.getElementById("yearSelect").value;
  const inputRating = document.getElementById("ratingInput").value;

  let yearRange;
  if (selectedYear === '2010') {
    yearRange = { gte: '2010-01-01' }; // Movies > 2010
  } else if (selectedYear === '2000-2010') {
    yearRange = { gte: '2000-01-01', lt: '2010-01-01' }; // Movies between 2000 and 2010
  } else if (selectedYear === '1999') {
    yearRange = { lt: '2000-01-01' }; // Movies < 2000
  }

  const recommendations = await fetchMovies(selectedGenre, yearRange, inputRating);
  displayRecommendations(recommendations);
});

// Function to display movie recommendations
function displayRecommendations(recommendations) {
  const recommendationsElement = document.getElementById("recommendations");
  recommendationsElement.innerHTML = ""; // Clear previous recommendations

  recommendations.forEach(movie => {
    const releaseDate = new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const recommendationContainer = document.createElement('div');
    recommendationContainer.classList.add('recommendation');

    const posterLink = document.createElement('a');
    posterLink.href = `/informatics.html?id=${movie.id}`;
    
    const posterImage = document.createElement('img');
    posterImage.src = getMoviePosterUrl(movie);
    posterImage.alt = movie.title;
    posterImage.classList.add('recommendation-poster');
    posterLink.appendChild(posterImage);
    recommendationContainer.appendChild(posterLink);

    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('recommendation-details');

    const titleElement = document.createElement('h3');
    titleElement.classList.add('recommendation-title');
    titleElement.textContent = movie.title;
    detailsContainer.appendChild(titleElement);

    const releaseDateElement = document.createElement('p');
    releaseDateElement.classList.add('recommendation-release-date');
    releaseDateElement.textContent = `Release Date: ${releaseDate}`;
    detailsContainer.appendChild(releaseDateElement);

    const ratingElement = document.createElement('p');
    ratingElement.classList.add('recommendation-rating');
    ratingElement.textContent = `Rating: ${movie.vote_average.toFixed(1)}`; // Format rating to 1 decimal point
    detailsContainer.appendChild(ratingElement);

    recommendationContainer.appendChild(detailsContainer);
    recommendationsElement.appendChild(recommendationContainer);
  });
}

// Function to populate genres in the dropdown
async function populateGenres() {
  try {
    const genres = await fetchGenres();
    console.log("Genres:", genres); // Log genres to check if it's populated correctly
    const genreSelect = document.getElementById("genreSelect");
    genres.forEach(genre => {
      const option = document.createElement("option");
      option.value = genre.id;
      option.textContent = genre.name;
      genreSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error populating genres:", error);
  }
}

// Function to get movie poster URL or a placeholder if not available
function getMoviePosterUrl(movie) {
  return movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : './assets/images/placeholder.jpg';
}

// Fetch genres and populate the dropdown on page load
document.addEventListener("DOMContentLoaded", populateGenres);
