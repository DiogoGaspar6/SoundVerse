//* FETCH LAST-COMMIT
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('api/github/last-commit')
    const lastCommit = await response.json()
    const lastCommitMsg = document.querySelector('.githubCommit p')
    lastCommitMsg.innerHTML = `
    Ultimo commit: <a href='${lastCommit.html_url}' target='_blank'>${lastCommit.commit.message.split('\n')[2]}<\a>
    feito por <a href='${lastCommit.author.html_url}' target='_blank'>${lastCommit.commit.author.name}<\a>`
  } catch (error) {
    console.error('Error: ' + error)
  }
})

//* FETCH TOP-MUSICS
document.addEventListener('DOMContentLoaded', async () => {
  const loadingTopMusics = document.querySelector('.loading-topMusics')
  try {
    loadingTopMusics.style.display = 'block'
    const response = await fetch('api/lastfm/all-music')
    const musics = await response.json()
    const topMusics = document.querySelector('.top-musics')
    console.log(musics)
    musics.forEach((music, index) => {
      const musicDiv = document.createElement('div')
      musicDiv.classList.add('music-item')
      musicDiv.innerHTML = `
        <h2>${index + 1}</h2>
        <h3>${music.name}</h3>
        <p>${music.artist.name}</p>
        <a href='${music.url}' target='_blank'>Ouve Agora</a>
        <button onclick="moreContent('${music.name}','${music.artist.name}')">Ver mais</button>`
      topMusics.appendChild(musicDiv)
    })
  } catch (error) {
    console.error('ERROR: ' + error)
  } finally {
    loadingTopMusics.style.display = 'none'
  }
})

//* FETCH ALL-MUSICS
document.addEventListener('DOMContentLoaded', async () => {
  const loadingAllMuscis = document.querySelector('.loading-allMusics')
  try {
    loadingAllMuscis.style.display = 'block'
    const response = await fetch('api/spotify/all-tracks')
    const musics = await response.json()
    const allMusics = document.querySelector('.all-musics')
    console.log(musics)
    musics.forEach((music) => {
      const musicDiv = document.createElement('div')
      musicDiv.classList.add('music-item')
      musicDiv.innerHTML = `
        <h3>${music.name}</h3>
        <p>${music.artists.map(artist => artist.name).join(', ')}</p>
        <a href='${music.external_urls.spotify}' target='_blank'>Ouve Agora</a>
        <button onclick="moreContent('${music.name}','${music.artists[0].name}')">Ver mais</button>`
      allMusics.appendChild(musicDiv)
    })
  } catch (error) {
    console.error('ERROR: ' + error)
  } finally {
    loadingAllMuscis.style.display = 'none'
  }
})

let stopFetch;

// * SHOW THE BIO AND THE LYRICS
async function moreContent(music, artist) {
  const popup = document.querySelector('.popup')
  const titleLyrics = document.querySelector('.title-lyrics')
  const titleBio = document.querySelector('.title-bio')
  const lyricsContent = document.getElementById('lyrics-content')
  const biographyContent = document.getElementById('biography-content')
  const biographyContainer = document.querySelector('.bio-container')
  const loadingPopup = document.querySelector('.loading-popup')

  lyricsContent.style.color = ''
  lyricsContent.style.textAlign = ''

  if (stopFetch) {
    stopFetch.abort()
  }

  stopFetch = new AbortController()
  const signal = stopFetch.signal

  try {
    //* SHOW THE POP UP AND THE LOADING
    loadingPopup.style.display = 'block'
    popup.style.display = 'block'

    //* HIDE THE TITLES
    titleLyrics.style.display = 'none'
    titleBio.style.display = 'none'

    //* FETCH THE LYRICS
    const lyricsResponse = await fetch(`api/lyrics-ovh/lyrics?artist=${encodeURIComponent(artist)}&music=${encodeURIComponent(music)}`, { signal })
    const lyrics = await lyricsResponse.json()
    console.log(lyrics)

    //*FETCH THE BIO
    const biographyResponse = await fetch(`api/wikipedia/bio?artist=${encodeURIComponent(artist)}`, { signal })
    const biography = await biographyResponse.json()
    console.log(biography)

    //* SHOW TITLES
    titleBio.style.display = 'block'
    titleLyrics.style.display = 'block'

    //* SHOW THE BIO AND THE LYRICS
    lyricsContent.innerHTML = ''
    biographyContent.innerHTML = biography.extract_html

    // * ADD LYRICS AS PARAGRAPHS
    const lines = lyrics.split('\n');
    lines.forEach(line => {
      const p = document.createElement('p');
      p.textContent = line;
      lyricsContent.appendChild(p);
    });

    if (biography.thumbnail && biography.thumbnail.source) {
      const imgArtist = document.createElement('img');
      imgArtist.src = biography.thumbnail.source;
      imgArtist.alt = artist;
      imgArtist.classList.add('img-artist');
      biographyContainer.appendChild(imgArtist);
    }
  } catch (error) {
    console.error('ERROR: ' + error)
    lyricsContent.innerHTML = `<p style='display: flex; justify-content: center'>Nao foi possivel encontrar as letras e a biografia</p>`
    lyricsContent.style.color = 'red'
  } finally {
    loadingPopup.style.display = 'none'
  }
}
function closePopup() {
  //* CLEAN ALL TEXTS
  const titleLyrics = document.querySelector('.title-lyrics')
  const titleBio = document.querySelector('.title-bio')
  const lyricsContent = document.getElementById('lyrics-content')
  const biographyContent = document.getElementById('biography-content')
  const biographyContainer = document.querySelector('.bio-container')
  const imgArtist = document.querySelector('.img-artist')
  titleLyrics.style.display = 'none'
  titleBio.style.display = 'none'
  lyricsContent.innerHTML = ''
  biographyContent.innerHTML = ''

  if (imgArtist) {
    biographyContainer.removeChild(imgArtist);
  }

  //* CLOSE THE POPUP
  const popup = document.querySelector('.popup')
  popup.style.display = 'none'

  //* STOP FETCH
  if (stopFetch) {
    stopFetch.abort()
  }
}

//* CLEAR THE INPUT WHEN THE PAGE IS RESFRESHED
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input')
  searchInput.value = ''
})

//* MAKE THE SEARCH WHEN THE USER PRESS THE KEY ENTER
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input')

  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      searchArtist()
    }
  })
})


//* SEARCH THE ARTIST
async function searchArtist() {
  const searchInput = document.getElementById('search-input')
  const allMusics = document.querySelector('.all-musics')
  const musicDiv = document.createElement('div')
  musicDiv.classList.add('music-item')
  
  allMusics.innerHTML = ''

  let loadingAllMusics = document.querySelector('.loading-allMusics')

  //* MAKE THE LOADING ELEMENT
  //! THE SECOND TIME THAT I SEARCH THE LOADING DISAPPEAR 
  if (!loadingAllMusics) {
    console.log('nao existe');
    loadingAllMusics = document.createElement('div');
    loadingAllMusics.classList.add('loading-allMusics');
    allMusics.appendChild(loadingAllMusics);
  }

  let url
  if (searchInput.value === '') {
    url = 'api/spotify/all-tracks';
  } else {
    url = `api/spotify/search?artist=${encodeURIComponent(searchInput.value)}`;
  }

  try {
    loadingAllMusics.style.display = 'block'
    const response = await fetch(url)
    const musics = await response.json()
    allMusics.innerHTML = ''
    console.log(musics)
    musics.forEach((music) => {
      musicDiv.innerHTML = `
        <h3>${music.name}</h3>
        <p>${music.artists.map(artist => artist.name).join(', ')}</p>
        <a href='${music.external_urls.spotify}' target='_blank'>Ouve Agora</a>
        <button onclick="moreContent('${music.name}','${music.artists[0].name}')">Ver mais</button>`
      allMusics.appendChild(musicDiv)
    })
  } catch (error) {
    console.error('ERROR: ', error)
    musicDiv.innerHTML = `<h3>Nao foi possivel encontrar nenhuma musica desse artista</h3>`
    allMusics.appendChild(musicDiv)
  } finally {
    searchInput.value = ''
    loadingAllMusics.style.display = 'none'
  }
}