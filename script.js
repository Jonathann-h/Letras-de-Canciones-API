const searchInput = document.getElementById("searchInput");
const suggestionsList = document.getElementById("suggestionsList");
const lyricsDisplay = document.getElementById("lyricsDisplay");

let isLoadingSuggestions = false;
let isLoadingLyrics = false;

// Función para buscar sugerencias
async function fetchSuggestions(keyword) {
  if (!keyword) {
    suggestionsList.innerHTML = '';
    return;
  }

  isLoadingSuggestions = true;
  try {
    const response = await fetch(`https://api.lyrics.ovh/suggest/${keyword}`);
    if (response.ok) {
      const data = await response.json();
      displaySuggestions(data.data);
    } else {
      showSnackbar("No se encontraron sugerencias.");
    }
  } catch (error) {
    showSnackbar("Ocurrió un error al obtener las sugerencias.");
  } finally {
    isLoadingSuggestions = false;
  }
}

// Función para mostrar las sugerencias
function displaySuggestions(suggestions) {
  suggestionsList.innerHTML = suggestions
    .map((suggestion) => {
      const artist = suggestion.artist.name;
      const title = suggestion.title;
      return `<li onclick="fetchLyrics('${artist}', '${title}')">${title} - ${artist}</li>`;
    })
    .join("");
}

// Función para obtener la letra de la canción
async function fetchLyrics(artist, title) {
  isLoadingLyrics = true;
  lyricsDisplay.textContent = "Cargando letra...";
  suggestionsList.innerHTML = ''; // Aca se limpia la lista de sugerencias cuando se selecciona una cancion
  try {
    const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
    if (response.ok) {
      const data = await response.json();
      lyricsDisplay.textContent = data.lyrics || "Letra no encontrada.";
    } else {
      showSnackbar("No se pudo encontrar la letra.");
    }
  } catch (error) {
    showSnackbar("Ocurrió un error al obtener la letra.");
  } finally {
    isLoadingLyrics = false;
  }
}

// Función para limpiar la búsqueda
function clearSearch() {
  searchInput.value = '';
  suggestionsList.innerHTML = '';
  lyricsDisplay.textContent = 'Selecciona una canción para ver la letra.';
}

// Mostrar notificación de error
function showSnackbar(message) {
  alert(message);
}

// Evento para buscar sugerencias al escribir
searchInput.addEventListener("input", () => {
  fetchSuggestions(searchInput.value);
});
