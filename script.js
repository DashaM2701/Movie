const API_KEY = "8553fd0a-251a-4ac2-9cf4-b5bfbbd7dee7";
const API_URL_PREMIER =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL&page=1";
const API_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_ID = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/'
const form = document.querySelector("form");
const search = document.querySelector(".header__search");
const magnifer = document.querySelector('.header__search-img');

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const apiSearchUrl = `${API_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearchUrl);
  }
  search.value = "";
});
magnifer.addEventListener('click', (e) => {
  event.preventDefault();
  const apiSearchUrl = `${API_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearchUrl);
  }
  search.value = "";
});

getMovies(API_URL_PREMIER);

async function getMovies(url) {
  const resp = await fetch(url, {
    headers: {
      "X-API-KEY": API_KEY,
      "Content-Type": "application/json",
    },
  });
  const respData = await resp.json();
  showMovies(respData);

}
// magnifer.addEventListener('click', getMovies);


function getClassByRate(vote) {
  if (vote >= 7) {
    return "green";
  } else if (vote > 5) {
    return "orange";
  } else {
    return "red";
  }
}
function showMovies(data) {
  const moviesEl = document.querySelector(".movies");
  document.querySelector(".movies").innerHTML = "";

  const movies = data.films || data.items;
  movies.forEach((movie) => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    const rating =
      movie.ratingKinopoisk || movie.rating || movie.ratingImdb || movie.rating;
    movieEl.innerHTML = `
                
                <div class="movie__cover-inner">
                    <img src="${movie.posterUrl}" class="movie__cover" alt="${
      movie.nameRu
    }">
                    <div class="movie__cover--darkened"></div>
                </div>
                <div class="movie__info"></div>
                <div class="movie__title">${movie.nameRu}</div>
                <div class="movie__category">${movie.genres.map(
                  (genre) => ` ${genre.genre}`
                )}</div>
                ${
                  rating
                    ? `<div class="movie__average movie__average--${getClassByRate(
                        rating
                      )}">${rating}</div>`
                    : ""
                }
           
`;
   const filmId = movie.kinopoiskId || movie.filmId
    movieEl.addEventListener('click',() => openModal(filmId))
    moviesEl.appendChild(movieEl);

  });
}

//Modal

const modalEl = document.querySelector('.modal');

async function openModal(id) {
  modalEl.classList.add('modal--show')
 document.body.classList.add('stop-scrolling');

  const resp = await fetch(API_URL_ID + id, {
    headers: {
      "X-API-KEY": API_KEY,
      "Content-Type": "application/json",
    },
  });
  const respData = await resp.json();

modalEl.innerHTML = `
<div class="modal__card">
      <img class="modal__movie-backdrop" src="${respData.posterUrl}" alt="${respData.nameRu}">
      <h2>
        <span class="modal__movie-title">${respData.nameRu}</span>
        <span class="modal__movie-release-year"> - ${respData.year}</span>
      </h2>
      <ul class="modal__movie-info">
        <div class="loader"></div>
        <li class="modal__movie-genre">Жанр - ${respData.genres.map((el) => `<span>${el.genre}</span>`)}</li>
        ${respData.filmLength ? `<li class="modal__movie-runtime">Время - ${respData.filmLength} минут</li>` : ''}
        <li >Сайт: <a target="_blank" class="modal__movie-site" href="${respData.webUrl}">${respData.webUrl}</a></li>
        <li class="modal__movie-overview">Описание - ${respData.description}</li>
      </ul>
      <button type="button" class="modal__button-close">Закрыть</button>
    </div>
    
`;

const btnClose = document.querySelector('.modal__button-close');

btnClose.addEventListener('click', () => closeModal())
}

function closeModal(){
  modalEl.classList.remove('modal--show');
 document.body.classList.remove('stop-scrolling');

}

window.addEventListener('click', (e) => {
  if(e.target === modalEl){
    closeModal()
  }
})

window.addEventListener('keydown', (e) => {
  if(e.key === 'Escape'){
    closeModal();
  }
})
