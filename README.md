# SoundVerse

A SoundVerse é uma aplicação web que permite aos utilizadores pesquisarem artistas, explorarem músicas populares e visualizarem detalhes adicionais como biografias e letras. O projeto foi desenvolvido como parte do curso de Engenharia Informática no IPVC - ESTG.

## Autores do Trabalho
- **Diogo Gaspar**  
  GitHub: [DiogoGaspar6](https://github.com/DiogoGaspar6)
- **Gustavo Barbosa**  
  GitHub: [GustavoBarbosa2](https://github.com/GustavoBarbosa2)

## Repositório GitHub
O repositório encontra-se no GitHub: [SoundVerse Repository](https://github.com/DiogoGaspar6/SoundVerse)

## Publicação
A aplicação está disponível em: [https://soundverse.onrender.com](https://soundverse.onrender.com)

## Descrição do Projeto (Mini-relatório)

### Objetivo do Projeto
O objetivo do SoundVerse é proporcionar uma experiência interativa e acessível para os fãs de música, permitindo que descubram novas músicas, visualizem letras e consigam ter mais informações sobre seus artistas favoritos. 

### Funcionalidades Principais
- **Top Músicas**: Lista de músicas populares utilizando a API Last.fm.
- **Pesquisa de Artistas**: Pesquisa por artistas e visualização de músicas associadas, utilizando a API do Spotify.
- **Letras e Biografia**: Exibição de letras (API Lyrics.ovh) e biografia do artista (API Wikipedia).

### Arquitetura e Encadeamento das APIs
- **Last.fm API**: Utilizada para obter as músicas mais populares.
- **Spotify API**: Autenticação com OAuth e recuperação de músicas e biografias dos artistas. 
- **Wikipedia API**: Obtém a biografia dos artistas.
- **Lyrics.ovh API**: Exibe letras das músicas.
- **GitHub API**: Vai procurar e exibe o último commit do repositório.

As requisições às APIs são feitas no backend com o **Express.js** e enviadas ao frontend, garantindo uma conexão contínua entre o cliente e o servidor.

### Bibliotecas e Frameworks Utilizados
- **Node.js e Express.js**: Configuração do servidor backend, criação de endpoints de API e controlo de autenticação.
- **Axios**: Usado para realizar requisições HTTP para as diferentes APIs.
- **Cheerio**: Facilita o scraping de dados HTML no backend, caso necessário.
- **QS (Query String)**: Para formatar e enviar dados da autenticação Spotify.
- **Frontend**: HTML, CSS e JavaScript puro, com Google Icons para os ícones e animações customizadas.

### Endpoints da API
- **GET /**: Retorna a pagina inicial da aplicação.
- **GET /api/github/last-commit**: Retorna o ultimo commit do repostiorio e que "merged" na main.
- **GET /api/lastfm/all-music**: Retorna as top tracks da api LAST.FM 
- **GET /api/spotify/token**: É o endpoint para retornar o token do spotify para conseguir posteriormente utilizar a api do spotify
- **GET /api/spotify/all-tracks**: Retorna as musicas "new realeases", foi a forma que decidimos para retornar as musicas do spotify pois é impossivel retornar TODAS as musicas do spotify
- **GET /api/wikipedia/bio**: Retorna a biografia de um artista, que é passado neste endpoint da API externa **https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(artist)}**
- **GET /api/lyrics-ovh/lyrics**: Retorna as letras da musica que passa como query o nome do artista e o nome da musica e usamos o endpoint da API externa **https://api.lyrics.ovh/v1/{encodeURIComponent(artist)}/${encodeURIComponent(music)}**
- **GET /api/spotify/search**: Retorna todas as musicas que sao do artista que é passado como query

## Instruções de Instalação


### Pré-requisitos
- Node.js e npm instalados

### Instalação do Projeto
1. Clone o repositório:
    ```bash
    git clone https://github.com/DiogoGaspar6/SoundVerse.git
    ```
2. Navegue até a pasta do projeto:
    ```bash
    cd SoundVerse
    ```
3. Instale as dependências:
    ```bash
    npm install
    ```

### Execução
Para iniciar o servidor local:
```bash
cd api
```
E por fim:
```bash
node server.js
```