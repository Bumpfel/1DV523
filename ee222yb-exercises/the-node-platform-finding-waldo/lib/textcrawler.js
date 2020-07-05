const { EventEmitter } = require('events')
const fs = require('fs-extra')

class TextCrawler extends EventEmitter {
  /**
   * @param {RegExp} regex
   */
  constructor (regex) {
    super()
    this.regex = regex
    this.filePaths = []
  }

  addFile (filePath) {
    this.filePaths.push(filePath)
  }

  async find () {
    for (const filePath of this.filePaths) {
      try {
        const file = await fs.readFile(filePath)
        const text = String(file)
        if (text.search(this.regex) > -1) {
          this.emit('found', [this.regex, filePath])
        }
      } catch (err) {
        this.emit('error', [filePath])
      }
    }
  }
}

module.exports = {
  TextCrawler: TextCrawler
}
