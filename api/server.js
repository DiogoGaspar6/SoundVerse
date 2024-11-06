const express = require('express')
const axios = require('axios')
const path = require('path')
const qs = require('qs')
const cheerio = require('cheerio');

const app = express()
const PORT = process.env.PORT || 3000;

const LASTFM_API_KEY = '870afe7d6adf980b9d86bd0f0dc16d7e'

const SPOTIFY_CLIENT_ID = '154440126f8146fda1ed16a303bc842e'
const SPOTIFY_CLIENT_SECRET = 'edd0d7a4161047c1b3bbe343c5c19919'

app.use(express.static(path.join(__dirname, '../frontend')))

//* OPEN THE INDEX PAGE
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'))
})

//* ENDPOINT FOR THE LAST COMMIT
app.get('/api/github/last-commit', async(req, res) =>{
  try{
    const response = await axios.get('https://api.github.com/repos/DiogoGaspar6/SoundVerse/commits')
    const lastCommit = response.data[0]
    res.json(lastCommit)
  }catch(error){
    res.status(500).send('ERROR: ' + error)
  }
})

//* ENDPOINT TO THE TOP MUSICS (LAST.FM)
app.get('/api/lastfm/all-music', async (req, res) => {
  try {
    const response = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${LASTFM_API_KEY}&format=json`)
    // console.log(response.data.tracks)
    const allMusic = response.data.tracks.track
    res.json(allMusic)
  } catch (error) {
    res.status(500).send('ERROR: ' + error)
  }
})

//* ENDPOINT TO THE SPOTIFY TOKEN
app.get('/api/spotify/token', async (req, res) =>{
  try{
    const response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
      grant_type: 'client_credentials',
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
      }
    })
    res.json(response.data)
  }catch(error){
    res.status(500).send('ERROR: ', error)
  }
})

//* ENDPOINT TO THE ALL MUSICS FROM SPOTIFY
app.get('/api/spotify/all-tracks', async (req, res) => {
  try {
    const tokenResponse = await axios.get(`http://localhost:${PORT}/api/spotify/token`)
    const accessToken = tokenResponse.data.access_token

    //* GET NEW RELEASES
    const trackResponse = await axios.get('https://api.spotify.com/v1/browse/new-releases', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        limit: 50 
      }
    })

    //* EXTRAT THE TRACKS FROM THE ALBUNS
    const albums = trackResponse.data.albums.items
    const tracks = []

    for (const album of albums){
      const albumTracksResponse = await axios.get(`https://api.spotify.com/v1/albums/${album.id}/tracks`, {
        headers:{
          'Authorization': `Bearer ${accessToken}`
        }
      })
      tracks.push(...albumTracksResponse.data.items)
    }

    res.json(tracks)
  } catch (error) {
    res.status(500).send('ERROR: ' + error)
  }
})

//* ENDPOINT TO THE BIOGRAPHY
app.get('/api/wikipedia/bio', async(req, res) =>{
  const artist = req.query.artist
  try{
    const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(artist)}`)
    res.json(response.data)
  }catch(error){
    res.status(500).send('ERROR: ' + error)
  }
})

//* ENDPOINT TO THE LYRICS
app.get('/api/lyrics-ovh/lyrics', async(req, res) => {
  const artist = req.query.artist
  const music = req.query.music
  try{
    const searchResponse = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(music)}`)
    const lyricsResponse = searchResponse.data.lyrics
    // console.log(searchResponse.data)
    res.json(lyricsResponse)
  }catch(error){
    if (error.response && error.response.status === 404) {
      res.status(404).send('Lyrics not found');
    } else {
      res.status(500).send('ERROR: ' + error);
    }
  }
})

//* ENDPOINT TO SEARCH ARTIST
app.get('/api/spotify/search', async(req, res) => {
  const artist = req.query.artist
  try{
    const tokenResponse = await axios.get(`http://localhost:${PORT}/api/spotify/token`)
    const accessToken = tokenResponse.data.access_token

    const searchResponse = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        q: artist,
        type: 'artist'
      }
    })

    const artistId = searchResponse.data.artists.items[0].id

    const musicResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    res.json(musicResponse.data.tracks)
  }catch(error){
    res.status(500).send('ERROR: ', error)
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})