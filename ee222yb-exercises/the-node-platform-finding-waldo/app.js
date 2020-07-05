const crawler = require('./lib/textcrawler')

const c = new crawler.TextCrawler(new RegExp('waldo', 'i'))
c.addListener('found', args => {
  console.log('Matched "' + args[0] + '" in file ' + args[1])
})
c.addListener('error', args => {
  console.log('No such file or directory, open "' + args[0] + '"')
})

c.addFile('file1.txt')
c.addFile('file2.txt')
c.addFile('file3.json')
c.addFile('file4.json')
c.addFile('file5.json')

c.find()
