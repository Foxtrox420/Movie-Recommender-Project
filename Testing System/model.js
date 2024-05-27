const API_KEY = 'f7a02d75c1d75b0a707ecd3277e64257';

// Function to fetch movie recommendations
async function fetchMovieRecommendations() {
  const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
}

// Function to display movie recommendations
function displayRecommendations(recommendations) {
  const recommendationElement = document.getElementById("recommendation");
  recommendationElement.innerHTML = ""; // Clear previous recommendations
  recommendations.forEach(movie => {
    const title = movie.title;
    const rating = movie.vote_average;
    const poster = `https://image.tmdb.org/t/p/w200/${movie.poster_path}`; // Example URL for movie poster
    const movieElement = `
      <div>
        <img src="${poster}" alt="${title}">
        <h3>${title}</h3>
        <p>Rating: ${rating}</p>
      </div>
    `;
    recommendationElement.innerHTML += movieElement;
  });
}

// Event listener for the button click
document.getElementById("generateBtn").addEventListener("click", async () => {
  const recommendations = await fetchMovieRecommendations();
  displayRecommendations(recommendations);
});
