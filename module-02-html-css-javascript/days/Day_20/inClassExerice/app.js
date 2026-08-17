// DOM references
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const errorMessage = document.getElementById('error-message');
const emptyState = document.getElementById('empty-state');
const resultsGrid = document.getElementById('results-grid');

const retryBtn = document.getElementById('retry-btn');

let lastQuery = '';


const API_URL = 'https://api.themoviedb.org/3/search/multi';
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOGQ5YTViYWJlOTBmZDBlNDU2ODg5NTk3YjQ2MTljNSIsIm5iZiI6MTc4Njg2Njc5MS4yNTYsInN1YiI6IjZhODE2YzY3NTA2NjU2YWViN2Y3ZmRmNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5Jc9WEqd35N_nJdUO_N6TVPf5XA5El8GbRP_sc3-Jd0'
  }
};


// --- State helpers ---
function showState(state) {
  loadingState.classList.add('hidden');
  errorState.classList.add('hidden');
  emptyState.classList.add('hidden');

  if (state === 'loading') loadingState.classList.remove('hidden');
  if (state === 'error') errorState.classList.remove('hidden');
  if (state === 'empty') emptyState.classList.remove('hidden');
}

function setLoadingUI(isLoading) {
  searchBtn.disabled = isLoading;
  searchBtn.textContent = isLoading ? 'Searching...' : 'Search';
}

// --- Fetch + render ---
async function searchMovies(query) {
  lastQuery = query;
  resultsGrid.innerHTML = '';
  showState('loading');
  setLoadingUI(true);

  try {
    const url = `${API_URL}?query=${encodeURIComponent(query)}`;
    const response = await fetch(url, API_OPTIONS);

    if (!response.ok) {
      throw new Error(`Request failed (status ${response.status})`);
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Received an unexpected response format from the API.');
    }

    const movies = extractMovies(data);

    if (!movies || movies.length === 0) {
      showState('empty');
      return;
    }

    showState(null);
    renderResults(movies);
  } catch (error) {
    console.error(error);
    errorMessage.textContent = error.message || 'Something went wrong. Please try again.';
    showState('error');
  } finally {
    setLoadingUI(false);
  }
}


function extractMovies(data) {
  let items = [];
  if (Array.isArray(data)) items = data;
  else if (Array.isArray(data.results)) items = data.results;
  else if (Array.isArray(data.movies)) items = data.movies;
  else if (Array.isArray(data.series)) items = data.series;
  else if (Array.isArray(data.data)) items = data.data;
  else {
    console.warn('Unrecognized API response shape:', data);
    return [];
  }
  return items.filter((item) => item.media_type !== 'person');
}

const NO_POSTER_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450">
      <rect width="100%" height="100%" fill="#26263d"/>
      <text x="50%" y="50%" fill="#a0a0b8" font-family="sans-serif" font-size="18"
        text-anchor="middle" dominant-baseline="middle">No Poster</text>
    </svg>`
  );

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

function renderResults(results) {
  const fragment = document.createDocumentFragment();

  results.forEach((item) => {
    const isTV = item.media_type === 'tv';
    const title = item.title || item.name || item.original_title || item.original_name || 'Untitled';
    const year = item.release_date || item.first_air_date || '';
    const overview = item.overview || '';
    const poster = item.poster_path
      ? `${TMDB_IMAGE_BASE}${item.poster_path}`
      : '';

    const card = document.createElement('article');
    card.className = 'movie-card';

    const posterWrap = document.createElement('div');
    posterWrap.className = 'poster-wrap';

    const badge = document.createElement('span');
    badge.className = `type-badge ${isTV ? 'tv' : 'movie'}`;
    badge.textContent = isTV ? 'Series' : 'Movie';

    const img = document.createElement('img');
    img.className = 'movie-poster';
    img.src = poster || NO_POSTER_SVG;
    img.alt = `${title} poster`;
    img.loading = 'lazy';
    img.onerror = () => {
      img.src = NO_POSTER_SVG;
    };

    posterWrap.appendChild(badge);
    posterWrap.appendChild(img);

    const info = document.createElement('div');
    info.className = 'movie-info';

    const titleEl = document.createElement('h3');
    titleEl.className = 'movie-title';
    titleEl.textContent = title;

    const metaEl = document.createElement('p');
    metaEl.className = 'movie-meta';
    metaEl.textContent = year;

    const overviewEl = document.createElement('p');
    overviewEl.className = 'movie-overview';
    overviewEl.textContent = overview;

    info.appendChild(titleEl);
    if (year) info.appendChild(metaEl);
    if (overview) info.appendChild(overviewEl);

    card.appendChild(posterWrap);
    card.appendChild(info);
    fragment.appendChild(card);
  });

  resultsGrid.appendChild(fragment);
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;
  searchMovies(query);
});

retryBtn.addEventListener('click', () => {
  if (lastQuery) searchMovies(lastQuery);
});