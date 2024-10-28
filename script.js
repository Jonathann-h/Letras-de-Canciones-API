document.getElementById('searchButton').addEventListener('click', () => {
    const artist = document.getElementById('artist').value.trim();
    const song = document.getElementById('song').value.trim();

    if (!artist || !song) {
        document.getElementById('result').innerHTML = `<p>Por favor, ingresa el artista y el título de la canción.</p>`;
        return;
    }

    const url = `https://api.lyrics.ovh/v1/${artist}/${song}`;
    document.getElementById('result').innerHTML = `<p>Buscando la letra...</p>`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.lyrics) {
                document.getElementById('result').innerHTML = `
                    <h2>${artist} - ${song}</h2>
                    <pre>${data.lyrics}</pre>
                `;
            } else {
                document.getElementById('result').innerHTML = `<p>No se encontraron letras para esta canción.</p>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('result').innerHTML = `<p>Error al buscar la letra. Verifica tu conexión a internet o intenta nuevamente.</p>`;
        });
});
