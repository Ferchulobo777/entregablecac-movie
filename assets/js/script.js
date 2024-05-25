// Definimos la URL Base de la API Movie DB
const API_SERVER = "https://api.themoviedb.org/3";
const API_KEY = "909e20377128c4afda61483bb037ffe6";

// Función para crear elementos HTML
const createElement = (tag, className, attributes = {}) => {
  const element = document.createElement(tag);
  if (className) {
    element.classList.add(className);
  }
  Object.entries(attributes).forEach(([key, value]) =>
    element.setAttribute(key, value)
  );
  return element;
};

// Función para manejar la búsqueda de películas
const handleSearch = async (event) => {
  event.preventDefault();
  const query = document.getElementById("buscar").value.trim();
  const tendenciasContainer = document.getElementById("tendencias-peliculas");

  // Si el campo de búsqueda está vacío, recargar las películas populares
  if (!query) {
    const savedPage = localStorage.getItem('currentPage');
    const page = savedPage ? Number(savedPage) : 1;
    movieFetchGrid(page);
    return;
  }

  tendenciasContainer.innerHTML = "";

  const response = await fetch(
    `${API_SERVER}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  const movies = data.results;

  // Filtramos las películas que coinciden exactamente con el nombre buscado
  const exactMatches = movies.filter(movie => movie.title.toLowerCase() === query.toLowerCase());

  const peliculasContainer = createElement("div", "peliculas");

  exactMatches.forEach((movie) => {
    const anchor = createElement("a", "");
    anchor.href = `../../pages/detalle.html?id=${movie.id}`;
    const peliculaItem = createElement("div", "pelicula");
    const img = createElement("img", "img-tendencia", {
      src: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      alt: movie.title,
      loading: "lazy",
    });
    const tituloPelicula = createElement("div", "titulo-pelicula");
    const titulo = createElement("h4", "");
    titulo.textContent = movie.title;
    tituloPelicula.appendChild(titulo);
    peliculaItem.append(img, tituloPelicula);
    anchor.appendChild(peliculaItem);
    peliculasContainer.appendChild(anchor);
  });

  tendenciasContainer.appendChild(peliculasContainer);
};

// Función para cargar películas en la cuadrícula de tendencias
const movieFetchGrid = async (page = 1) => {
  const response = await fetch(
    `${API_SERVER}/movie/popular?api_key=${API_KEY}&page=${page}`
  );
  const data = await response.json();
  const movies = data.results;
  const tendenciasContainer = document.getElementById("tendencias-peliculas");
  tendenciasContainer.innerHTML = "";
  const peliculasContainer = createElement("div", "peliculas");
  movies.forEach((movie) => {
    const anchor = createElement("a", "");
    anchor.href = `../../pages/detalle.html?id=${movie.id}`;
    const peliculaItem = createElement("div", "pelicula");
    const img = createElement("img", "img-tendencia", {
      src: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      alt: movie.title,
      loading: "lazy",
    });
    const tituloPelicula = createElement("div", "titulo-pelicula");
    const titulo = createElement("h4", "");
    titulo.textContent = movie.title;
    tituloPelicula.appendChild(titulo);
    peliculaItem.append(img, tituloPelicula);
    anchor.appendChild(peliculaItem);
    peliculasContainer.appendChild(anchor);
  });
  tendenciasContainer.appendChild(peliculasContainer);
  tendenciasContainer.parentElement.setAttribute("data-page", page);

  // Guardamos la página actual en localStorage
  localStorage.setItem('currentPage', page);
};

// Función para cargar películas en el carrusel de películas aclamadas
const movieFetchflex = async () => {
  const response = await fetch(
    `${API_SERVER}/movie/popular?api_key=${API_KEY}`
  );
  const data = await response.json();
  const movies = data.results;
  const aclamadasContainer = document.getElementById("aclamadas-container");
  aclamadasContainer.innerHTML = "";
  movies.forEach((movie) => {
    const anchor = createElement("a", "");
    anchor.href = `../../pages/detalle.html?id=${movie.id}`;
    const peliculaItem = createElement("div", "pelicula-item");
    const img = createElement("img", "img-aclamada", {
      src: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      alt: movie.title,
      loading: "lazy",
    });
    peliculaItem.appendChild(img);
    anchor.appendChild(peliculaItem);
    aclamadasContainer.appendChild(anchor);
  });
};

// Event listener para el botón "Anterior"
document.querySelector(".anterior").addEventListener("click", () => {
  let currentPage = Number(
    document.querySelector("#tendencias").getAttribute("data-page")
  );
  if (currentPage <= 1) return;
  movieFetchGrid(currentPage - 1);
});

// Event listener para el botón "Siguiente"
document.querySelector(".siguiente").addEventListener("click", () => {
  let currentPage = Number(
    document.querySelector("#tendencias").getAttribute("data-page")
  );
  movieFetchGrid(currentPage + 1);
});

// Ejecutamos las funciones de carga de películas al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const savedPage = localStorage.getItem('currentPage');
  const page = savedPage ? Number(savedPage) : 1;
  movieFetchGrid(page);
  movieFetchflex();
});

// Event listener para el campo de búsqueda
document.getElementById("buscar").addEventListener("input", (event) => {
  if (!event.target.value.trim()) {
    const savedPage = localStorage.getItem('currentPage');
    const page = savedPage ? Number(savedPage) : 1;
    movieFetchGrid(page);
  }
});