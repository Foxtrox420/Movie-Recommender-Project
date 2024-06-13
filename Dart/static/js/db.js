const API_KEY = 'f7a02d75c1d75b0a707ecd3277e64257';
const baseUrl = 'https://api.themoviedb.org/3';
const movieGridContainer = document.querySelector('.movie-grid');
const totalPages = 10; // Specify the number of pages you want to fetch

// Function to fetch movies from TMDB API
async function fetchMovies(page = 1, genre = '', year = '', rating = '') {
  try {
    const genreQuery = genre ? `&with_genres=${genre}` : '';
    const yearQuery = year ? `&primary_release_year=${year}` : '';
    const ratingQuery = rating ? `&vote_average.gte=${rating}` : '';
    const response = await fetch(`${baseUrl}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&language=en-US&page=${page}&include_adult=false${genreQuery}${yearQuery}${ratingQuery}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

// Function to render movies in a grid on the page
function renderMovies(movies) {
    // Sort movies alphabetically by title
    movies.sort((a, b) => a.title.localeCompare(b.title));
  
    // Clear existing movie grid
    movieGridContainer.innerHTML = '';
  
    // Render sorted movies
    movies.forEach(movie => {
      if (!movie.poster_path) {
        return; // Skip movie if it doesn't have a poster
      }
  
      const posterPath = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
  
      // Create a link that wraps the movie container
      const movieLink = document.createElement('a');
      movieLink.href = `/informatics.html?id=${movie.id}`; // Link to informatics.html with movie ID
  
      const movieContainer = document.createElement('div');
      movieContainer.classList.add('movie-container');
  
      const moviePoster = document.createElement('img');
      moviePoster.classList.add('movie-poster');
      moviePoster.src = posterPath;
      moviePoster.alt = movie.title;
  
      const movieTitle = document.createElement('div');
      movieTitle.classList.add('movie-title');
      movieTitle.textContent = movie.title;
  
      movieContainer.appendChild(moviePoster);
      movieContainer.appendChild(movieTitle);
  
      // Append the movie container to the link
      movieLink.appendChild(movieContainer);
  
      // Append the link to the movie grid container
      movieGridContainer.appendChild(movieLink);
    });
}
  

// Function to fetch and render movies from multiple pages
async function fetchAndRenderMovies() {
  const allMovies = [];
  const movieIds = new Set(); // To track unique movie IDs

  for (let page = 1; page <= totalPages; page++) {
    const movies = await fetchMovies(page);
    movies.forEach(movie => {
      if (!movieIds.has(movie.id)) {
        movieIds.add(movie.id);
        allMovies.push(movie);
      }
    });
  }

  renderMovies(allMovies);
}

// Event listener for filter button
document.getElementById('filter-button').addEventListener('click', async () => {
  const genre = document.getElementById('genre-filter').value;
  const year = document.getElementById('year-filter').value;
  const rating = document.getElementById('rating-filter').value;

  const allMovies = [];
  const movieIds = new Set(); // To track unique movie IDs

  for (let page = 1; page <= totalPages; page++) {
    const movies = await fetchMovies(page, genre, year, rating);
    movies.forEach(movie => {
      if (!movieIds.has(movie.id)) {
        movieIds.add(movie.id);
        allMovies.push(movie);
      }
    });
  }

  renderMovies(allMovies);
});

// Function to fetch genres from TMDB API
async function fetchGenres() {
    try {
      const response = await fetch(`${baseUrl}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
      const data = await response.json();
      return data.genres;
    } catch (error) {
      console.error('Error fetching genres:', error);
      return [];
    }
  }
  
  // Function to populate genre dropdown with options
  async function populateGenreDropdown() {
    const genres = await fetchGenres();
    const genreDropdown = document.getElementById('genre-filter');
  
    genres.forEach(genre => {
      const option = document.createElement('option');
      option.value = genre.id;
      option.textContent = genre.name;
      genreDropdown.appendChild(option);
    });
  }
  

/// Function to initialize the page
async function init() {
    try {
      await fetchAndRenderMovies();
      await populateGenreDropdown();
  
      // Populate year filter with options
      const yearFilter = document.getElementById('year-filter');
      const currentYear = new Date().getFullYear();
      for (let year = currentYear; year >= 1900; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
      }
    } catch (error) {
      console.error('Error initializing the page:', error);
      // Handle initialization error if needed
    }
  }

init(); 
