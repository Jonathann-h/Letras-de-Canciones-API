//Se obtienen referencias del DOM mediante sus IDs
const searchInput = document.getElementById("searchInput");         //Campo de texto donde el usuario ingresa el nombre de la cancion o Artista
const suggestionsList = document.getElementById("suggestionsList"); //Lista donde se van a mostrar las sugerencias de canciones
const lyricsDisplay = document.getElementById("lyricsDisplay");     //Aca se muestra la letra de la cancion seleccionada
const wikiDisplay = document.getElementById("wikiDisplay");         //Aca se muestra la info del artista (wikipediaAPI)

//Se definen dos variables booleanas para ver si se están cargando sugerencias de canciones. 
let isLoadingSuggestions = false;
let isLoadingLyrics = false;

// Función para buscar sugerencias
async function fetchSuggestions(keyword) {
  if (!keyword) {
    suggestionsList.innerHTML = '';
    wikiDisplay.innerHTML = 'Información de Wikipedia aparecerá aquí.';
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
  suggestionsList.innerHTML = ''; // Limpiar la lista de sugerencias
  wikiDisplay.innerHTML = 'Información de Wikipedia aparecerá aquí.'; // Limpiar información de Wikipedia
  try {
    const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
    if (response.ok) {
      const data = await response.json();
      lyricsDisplay.textContent = data.lyrics || "Letra no encontrada.";
      // Llamar a la función de Wikipedia solo para el artista
      fetchWikipediaInfo(artist); 
    } else {
      showSnackbar("No se pudo encontrar la letra.");
    }
  } catch (error) {
    showSnackbar("Ocurrió un error al obtener la letra.");
  } finally {
    isLoadingLyrics = false;
  }
}

// Función para buscar información en Wikipedia
async function fetchWikipediaInfo(artist) {
  try {
    const artistResponse = await fetch(`https://es.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${artist}&utf8=&origin=*`);
    
    const artistData = await artistResponse.json();
    displayWikipediaInfo(artistData.query.search);
  } catch (error) {
    wikiDisplay.innerHTML = "Ocurrió un error al obtener información de Wikipedia.";
  }
}

// Función para mostrar la información de Wikipedia
function displayWikipediaInfo(artistInfo) {
  let artistHTML = "";

  if (artistInfo.length > 0) {
    const firstArtistResult = artistInfo[0];
    artistHTML = `<h3>${firstArtistResult.title}</h3><p>${firstArtistResult.snippet}...</p><a href="https://es.wikipedia.org/wiki/${firstArtistResult.title}" target="_blank">Leer más</a>`;
  } else {
    artistHTML = "No se encontraron resultados para el artista.";
  }

  wikiDisplay.innerHTML = artistHTML;
}

// Función para limpiar la búsqueda
function clearSearch() {
  searchInput.value = '';
  suggestionsList.innerHTML = '';
  lyricsDisplay.textContent = 'Selecciona una canción para ver la letra.';
  wikiDisplay.innerHTML = 'Información de Wikipedia aparecerá aquí.';
}

// Mostrar notificación de error
function showSnackbar(message) {
  alert(message);
}

// Evento para buscar sugerencias al escribir
searchInput.addEventListener("input", () => {
  fetchSuggestions(searchInput.value);
});
