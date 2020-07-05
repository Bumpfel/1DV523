'use strict'

const fetch = require('node-fetch')
const jsdom = require('jsdom')

const extractLinks = async (url) => { // async function extractLinks (urls)
  const linkSet = new Set()
  try {
    const response = await fetch(url)
    const htmlDOM = new jsdom.JSDOM(await response.text()) // convert html string to traversable dom
    const links = htmlDOM.window.document.querySelectorAll('a')
    // add all anchors if they're external links
    for (const link of links) {
      if (link.href.startsWith('http://') || link.href.startsWith('https://')) {
        linkSet.add(link.href)
      }
    }
  } catch {
    console.log('-- invalid url')
    process.exit(-1)
  }
  return linkSet
}

const mapLinks = async (urls) => { // async function mapLinks (urls)
  // no url arguments given
  if (urls.length === 0) {
    return
  }

  const hyperLinks = new Set()
  for (const url of urls) {
    const linksFromUrl = await extractLinks(url)
    linksFromUrl.forEach(link => hyperLinks.add(link))
  }
  return Array.from(hyperLinks)
}

module.exports = {
  mapLinks
}
