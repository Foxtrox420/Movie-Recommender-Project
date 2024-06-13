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
    const poster = template.querySelector(".recommendation-poster");
    poster.src = movie.poster_path ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}` : 'placeholder.jpg';
    poster.alt = movie.title;

    // Add click event listener to redirect to the informatics page with the movie ID
    poster.addEventListener("click", () => {
      window.location.href = `informatics.html?id=${movie.id}`;
    });

    template.querySelector(".recommendation-title").textContent = movie.title;
    recommendationsElement.appendChild(template);
  });
}

async function handleSearch() {
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
}

document.getElementById("searchButton").addEventListener("click", handleSearch);

document.getElementById("movieInput").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    handleSearch();
  }
});

function displayMovieDetails(movie) {
  // searchResultsElement.appendChild(template);
  const inputTitle = document.getElementById("movieInput").value;
  if (inputTitle) {
    window.location.href = `informatics.html?id=${movie.id}`;
  } else {
    document.getElementById("searchResults").innerHTML = "Please enter a movie title";
    document.getElementById("recommendations").innerHTML = "";
  }
}
