const token = localStorage.getItem("token");

// ha nincs token → login oldal
if (!token) {
  window.location.href = "login.html";
}

const moviesContainer = document.getElementById("moviesContainer");
const watchlistContainer = document.getElementById("watchlistContainer");
const moviesError = document.getElementById("moviesError");
const watchlistError = document.getElementById("watchlistError");

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

// kijelentkezés
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

async function fetchMovies(query = "") {
  moviesContainer.innerHTML = "Betöltés...";

  try {
    const res = await fetch(`/api/movies?query=${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (!res.ok) {
      moviesError.textContent = data.error;
      moviesContainer.innerHTML = "";
      return;
    }

    renderMovies(data);
  } catch {
    moviesError.textContent = "Nem sikerült csatlakozni.";
  }
}

async function fetchWatchlist() {
  watchlistContainer.innerHTML = "Betöltés...";

  try {
    const res = await fetch("/api/watchlist", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (!res.ok) {
      watchlistError.textContent = data.error;
      return;
    }

    renderWatchlist(data);
  } catch {
    watchlistError.textContent = "Nem sikerült csatlakozni.";
  }
}

function renderMovies(movies) {
  if (!movies.length) {
    moviesContainer.innerHTML = "<p>Nincs találat.</p>";
    return;
  }

  moviesContainer.innerHTML = "";
  movies.forEach((movie) => {
    const div = document.createElement("div");
    div.className = "movie-item";

    div.innerHTML = `
      <h3>${movie.title}</h3>
      <div class="movie-meta">${movie.year} • ${movie.genre}</div>
      <button>Watchlisthez</button>
    `;

    div.querySelector("button").onclick = () => addToWatchlist(movie.id);
    moviesContainer.appendChild(div);
  });
}

function renderWatchlist(list) {
  if (!list.length) {
    watchlistContainer.innerHTML = "<p>Még nincs filmed.</p>";
    return;
  }

  watchlistContainer.innerHTML = "";
  list.forEach((movie) => {
    const div = document.createElement("div");
    div.className = "movie-item";

    div.innerHTML = `
      <h3>${movie.title}</h3>
      <div class="movie-meta">${movie.year} • ${movie.genre}</div>
      <button>Eltávolítás</button>
    `;

    div.querySelector("button").onclick = () =>
      removeFromWatchlist(movie.id);

    watchlistContainer.appendChild(div);
  });
}

async function addToWatchlist(movieId) {
  try {
    const res = await fetch("/api/watchlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ movieId })
    });

    const data = await res.json();

    if (!res.ok) {
      watchlistError.textContent = data.error;
      return;
    }

    renderWatchlist(data);
  } catch {
    watchlistError.textContent = "Hiba történt.";
  }
}

async function removeFromWatchlist(movieId) {
  try {
    const res = await fetch(`/api/watchlist/${movieId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (!res.ok) {
      watchlistError.textContent = data.error;
      return;
    }

    renderWatchlist(data);
  } catch {
    watchlistError.textContent = "Hiba történt.";
  }
}

searchBtn.addEventListener("click", () => {
  fetchMovies(searchInput.value.trim());
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") fetchMovies(searchInput.value.trim());
});

fetchMovies();
fetchWatchlist();