const express = require('express')
const axios = require('axios')
const path = require('path')
const qs = require('qs')

const app = express()
const PORT = process.env.PORT || 3000;

const LASTFM_API_KEY = '870afe7d6adf980b9d86bd0f0dc16d7e'

const SPOTIFY_CLIENT_ID = '154440126f8146fda1ed16a303bc842e'
const SPOTIFY_CLIENT_SECRET = 'edd0d7a4161047c1b3bbe343c5c19919'

app.use(express.static(path.join(__dirname, '../frontend')))

// OPEN THE INDEX PAGE
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'))
})

// ENDPOINT FOR THE LAST COMMIT
app.get('/api/github/last-commit', async(req, res) =>{
  try{
    const response = await axios.get('https://api.github.com/repos/DiogoGaspar6/SoundVerse/commits')
    const lastCommit = response.data[0]
    res.json(lastCommit)
  }catch(error){
    res.status(500).send('ERROR: ' + error)
  }
})

// ENDPOINT TO THE TOP MUSICS (LAST.FM)
app.get('/api/lastfm/all-music', async (req, res) =>{
  try{
    const response = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=cher&api_key=${LASTFM_API_KEY}&format=json`)
    const allMusic = response.data.tracks.track
    res.json(allMusic)
  }catch(error){
    res.status(500).send('ERROR: ' + error)
  }
})

// ENDPOINT TO THE SPOTIFY TOKEN
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

// ENDPOINT TO THE ALL MUSICS FROM SPOTIFY
app.get('/api/spotify/all-music', async(req, res) =>{
  try{
    const tokenResponse = await axios.get(`http://localhost:${PORT}/api/spotify/token`)
    const token = tokenResponse.data.access_token

    const musicResponse = await axios.get('https://api.spotify.com/v1/browse/new-releases', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    res.json(musicResponse.data.albums.items)
  }catch(error){
    res.status(500).send('ERROR: ', error)
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})