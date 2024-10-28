document.getElementById('searchButton').addEventListener('click', handleSearch);

// Función que maneja la búsqueda de letras
async function handleSearch() {
    // Se obtienen los valores de los campos de entrada, eliminando espacios en blanco al inicio y al final
    const artist = document.getElementById('artist').value.trim();
    const song = document.getElementById('song').value.trim();

    // Se valida que ambos campos estén llenos
    if (!validateInputs(artist, song)) {
        displayMessage('Ingrese el artista y el título de la canción.');
        return;
    }

    // Se construye la URL de la API utilizando encodeURIComponent para manejar caracteres especiales
    const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`;
    
    // Se muestra un mensaje de carga mientras se busca la letra
    displayMessage('Buscando la letra...');

    try {
        //Se l}ama a la función para obtener la letra de la canción
        const data = await fetchLyrics(url);
        
        // Se verifica si se encontró la letra
        if (data.lyrics) {
            //Se muestra la letra de la canción en el resultado
            displayLyrics(artist, song, data.lyrics);
        } else {
            //Mensaje que se muestra si no se encontraron letras
            displayMessage('No se encontraron letras para esta canción.');
        }
    } catch (error) {
        //Manejo de errores: muestra un mensaje y registra el error en la consola
        console.error('Error:', error);
        displayMessage('Error al buscar la letra. Verifica tu conexión a internet o intenta nuevamente.');
    }
}

// Esta función valida que se hayan ingresado el artista y la canción
function validateInputs(artist, song) {
    return artist && song; // Retorna verdadero si ambos campos tienen valor
}

// Función asíncrona que obtiene la letra de la canción desde la API
async function fetchLyrics(url) {
    const response = await fetch(url); // Realiza la solicitud a la API
    if (!response.ok) {
        throw new Error('Error en la respuesta de la API'); // Lanza un error si la respuesta no es correcta
    }
    return await response.json(); // Devuelve la respuesta en formato JSON
}

// Función que muestra la letra de la canción en el elemento de resultado
function displayLyrics(artist, song, lyrics) {
    document.getElementById('result').innerHTML = `
        <h2>${artist} - ${song}</h2>
        <pre>${lyrics}</pre>
    `; // Utiliza plantillas literales para mostrar el artista, el título y la letra
}

// Función que muestra mensajes de estado en el elemento de resultado
function displayMessage(message) {
    document.getElementById('result').innerHTML = `<p>${message}</p>`; // Actualiza el contenido del resultado con el mensaje proporcionado
}
