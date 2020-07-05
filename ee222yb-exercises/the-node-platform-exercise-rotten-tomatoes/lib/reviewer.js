const fs = require('fs-extra')
const xml2JS = require('xml2js')

const path = 'lib/movies/'
const imdbJSONFile = 'movies.json'
const rottenTomatoesXMLFile = 'movies.xml'

const xmlParsingTimer = 'xmlParsingTimer'
const jsonParsingTimer = 'jsonParsingTimer'
const printTimer = 'printTimer'

async function readXML (file) {
  console.time(xmlParsingTimer)
  const read = await fs.readFile(file)
  const ret = await xml2JS.parseStringPromise(read)
  console.timeEnd(xmlParsingTimer)
  return ret.movies.movie
}

async function printAverageRating (source, promise) {
  console.time(printTimer + source)
  const movies = await promise
  let rating = 0
  for (const movie of movies) {
    rating += parseInt(movie.rating)
  }
  rating /= movies.length
  console.log('average ' + source + ' rating: ' + rating)
  console.timeEnd(printTimer + source)
}

// Execution
console.time(jsonParsingTimer)
const imdb = fs.readJson(path + imdbJSONFile)
console.timeEnd(jsonParsingTimer)
const rottenTomatoes = readXML(path + rottenTomatoesXMLFile)

printAverageRating('imdb', imdb)
printAverageRating('rotten tomatoes', rottenTomatoes)
