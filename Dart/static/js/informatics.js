const API_KEY = 'f7a02d75c1d75b0a707ecd3277e64257';

function getMovieIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

async function fetchMovieDetails(movieId) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits,external_ids`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

function displayMovieDetails(movie) {
  const movieDetailsElement = document.getElementById("movieDetails");
  movieDetailsElement.innerHTML = ""; 

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

  const imdbId = movie.external_ids.imdb_id || movie.id;
  template.querySelector(".movie-video").src = `https://vidsrc.to/embed/movie/${imdbId}`;

  movieDetailsElement.appendChild(template);
}

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

async function fetchMovieReviews(movieId) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching movie reviews:", error);
    return [];
  }
}

function displayMovieReviews(reviews) {
  const movieReviewsElement = document.getElementById("movieReviews");
  movieReviewsElement.innerHTML = ""; 
  if (reviews.length > 0) {
    const reviewsList = document.createElement("ul");
    reviews.forEach(review => {
      const listItem = document.createElement("li");
      const authorName = document.createElement("strong");
      authorName.textContent = review.author; 
      listItem.appendChild(authorName); 
      listItem.innerHTML += `: ${review.content}`; 
      reviewsList.appendChild(listItem);
    });
    movieReviewsElement.appendChild(reviewsList);
  } else {
    movieReviewsElement.textContent = "No reviews available.";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const movieId = getMovieIdFromUrl();
  if (movieId) {
    const reviews = await fetchMovieReviews(movieId);
    displayMovieReviews(reviews);
  } else {
    document.getElementById("movieReviews").textContent = "Invalid movie ID.";
  }
});

async function fetchRecommendedMovies(movieId) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${API_KEY}`);
    const data = await response.json();
    console.log("Movie ID: ", movieId)
    return data.results;
  } catch (error) {
    console.error("Error fetching recommended movies:", error);
    return [];
  }
}

function displayRecommendedMovies(movies) {
  const recommendedMoviesElement = document.getElementById("recommendedMovies");
  recommendedMoviesElement.innerHTML = ""; 

  if (movies.length > 0) {
    movies.forEach(movie => {
      const movieElement = document.createElement("div");
      movieElement.classList.add("recommended-movie");

      const moviePoster = movie.poster_path ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}` : 'placeholder.jpg';
      movieElement.innerHTML = `
        <img src="${moviePoster}" alt="${movie.title}">
      `;

      recommendedMoviesElement.appendChild(movieElement);

      movieElement.addEventListener("click", () => {
        window.location.href = `informatics.html?id=${movie.id}`;
      });
    });
  } else {
    recommendedMoviesElement.textContent = "No recommended movies available.";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const movieId = getMovieIdFromUrl();
  if (movieId) {
    const recommendedMovies = await fetchRecommendedMovies(movieId);
    displayRecommendedMovies(recommendedMovies);
  } else {
    document.getElementById("recommendedMovies").textContent = "Invalid movie ID.";
  }
});
