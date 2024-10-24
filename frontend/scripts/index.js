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

document.addEventListener('DOMContentLoaded', async() =>{
  try{
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
        <a href='${music.url}' target='_blank'>Ouve Agora</a>`
        topMusics.appendChild(musicDiv)
    })
  }catch(error){
    console.log('ERROR: ' + error)
  }
})

document.addEventListener('DOMContentLoaded', async() =>{
  try{
    const response = await fetch('api/spotify/all-music')
    const musics = await response.json()
    const topMusics = document.querySelector('.all-musics')
    console.log(musics)
    musics.forEach((music) => {
      const musicDiv = document.createElement('div')
      musicDiv.classList.add('music-item')
      musicDiv.innerHTML = `
        <h3>${music.name}</h3>
        <p>${music.artists[0].name}</p>
        <a href='${music.external_urls.spotify}' target='_blank'>Ouve Agora</a>`
        topMusics.appendChild(musicDiv)
    })
  }catch(error){
    console.log('ERROR: ' + error)
  }
})