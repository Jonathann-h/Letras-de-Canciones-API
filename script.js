document.getElementById('searchButton').addEventListener('click', () => {
    //Se obtiene el valor ingresado en los campos de texto, eliminando espacios al principio y al final.
    const artist = document.getElementById('artist').value.trim();
    const song = document.getElementById('song').value.trim();

    //Se verifica que se ingresaron tanto el artista como el titulo de la cancion
    if (!artist || !song) {
        //Mensaje que se muestra en caso de que alguno de los campos esta vacío.
        document.getElementById('result').innerHTML = `<p>Por favor, ingresa el artista y el título de la canción.</p>`;
        return;
    }

    //Aca se construte la URL de la API usando el artista y el título de la canción
    const url = `https://api.lyrics.ovh/v1/${artist}/${song}`;
    //Mensaje que se muestra mientras se busca la letra.
    document.getElementById('result').innerHTML = `<p>Buscando la letra...</p>`;

    fetch(url)
        .then(response => response.json()) //Se convierte la respuesta en formato JSON
        .then(data => {
            //Se verifica que se encontraron letras 
            if (data.lyrics) {
                document.getElementById('result').innerHTML = `
                    <h2>${artist} - ${song}</h2>
                    <pre>${data.lyrics}</pre>
                `;
            } else {
                //Mensaje que se muestra si no se encontraron letras
                document.getElementById('result').innerHTML = `<p>No se encontraron letras para esta canción.</p>`;
            }
        })
        .catch(error => {   //Si ocurre un error dentro de la busqueda
            console.error('Error:', error);
            document.getElementById('result').innerHTML = `<p>Error al buscar la letra. Verifica tu conexión a internet o intenta nuevamente.</p>`;
        });
});