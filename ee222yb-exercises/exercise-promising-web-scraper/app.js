'use strict'

const fs = require('fs-extra')
const scraper = require('./lib/scraper')

const Path = 'data/'
const File = 'links.json'

/**
 * Extracts links from web addresses and puts unique links in a json file
 * @param {Array} links
 */
async function appendLinksToFile (urls, saveFile = File, attempt = 1) {
  let uniqueLinks = new Set()

  // check if file exists, if so read contents to set
  if (await fs.exists(Path + saveFile)) {
    try {
      const fileContent = await fs.readJSON(Path + saveFile)
      uniqueLinks = new Set(fileContent)
    } catch {
      // could not read json - file corrupt
      // find next uncorrupt file in order to not overwrite old corrupt data
      const newSaveFile = 'links(' + attempt + ').json'
      console.log('-- current file ' + saveFile + ' is corrupt. saving new data to ' + newSaveFile)
      appendLinksToFile(urls, newSaveFile, attempt + 1)
      return
    }
  }

  // add extracted links from url(s) to set
  const links = await scraper.mapLinks(urls)
  links.forEach(link => uniqueLinks.add(link))

  // convert to array and sort
  const allLinks = Array.from(uniqueLinks)
  allLinks.sort((a, b) => a - b)

  // write to file
  try {
    fs.writeJSON(Path + saveFile, allLinks, { spaces: 2, EOL: '\n' })
    console.log('Successfully mapped links to file ' + Path + saveFile)
  } catch {
    console.log('-- error writing to file')
  }
}

// Execution
appendLinksToFile(process.argv.slice(2))
// npm start https://nodejs.org/en/ https://developer.mozilla.org/en-US/
