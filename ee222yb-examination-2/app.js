'use strict'

const express = require('express')
const hbs = require('express-hbs')
const session = require('express-session')
const morgan = require('morgan')
const path = require('path')
const helmet = require('helmet')
const moment = require('moment')

const mongoose = require('./config/mongoose')
const routes = require('./routes/routes')
const errorController = require('./controllers/errorController')

const app = express()
const port = 8000

// Session cookie settings
const sessionOptions = {
  name: '1DV523A2_SESSIONID',
  secret: require('./credentials/session.json').cookieSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day in ms
    sameSite: 'strict',
    httpOnly: true,
    signed: true,
    secure: false // no https in standard local environment
  }
}

app.use(session(sessionOptions))

app.use(helmet())
app.use(morgan('tiny'))

// connect to DB
mongoose.connect().catch(err => {
  console.log('An error occured connecting to the database')
  console.error(err)
  process.exitCode = 1
})

// Handlebars, express settings
app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, '/views/layouts/default')
}))
app.set('view engine', 'hbs')

// handlebars helper that allows boolean comparisons to be made
hbs.registerHelper('equal', (arg1, arg2) => { // usage: {{#if (equal arg1 arg1)}} ... {{/if}}
  return arg1 === arg2
})

// links for snippet pagination
hbs.registerHelper('pagination', (currentPage, snippetsPerPage, nrOfSnippets, searchString, searchType) => {
  if (nrOfSnippets < snippetsPerPage) {
    // contains only one page - skip page numbers
    return
  }
  let paginationLinks = ''

  // previous pages
  for (let page = 1; page < currentPage && nrOfSnippets > page * snippetsPerPage; page++) {
    if (searchString) {
      paginationLinks += `<a href='/?page=${page}&q=${searchString}&t=${searchType}'>${page}</a>`
    } else {
      paginationLinks += `<a href='/?page=${page}'>${page}</a>`
    }
  }

  // current page
  paginationLinks += `<span class='selectedPage'>${currentPage}</span>`

  // next pages
  for (let page = currentPage + 1; nrOfSnippets > (page - 1) * snippetsPerPage; page++) {
    if (searchString) {
      paginationLinks += `<a href='/?page=${page}&q=${searchString}&t=${searchType}'>${page}</a>`
    } else {
      paginationLinks += `<a href='/?page=${page}'>${page}</a>`
    }
  }

  return new hbs.SafeString(paginationLinks)
})

hbs.registerHelper('results', (currentPage, snippetsPerPage, nrOfSnippets) => {
  let str = ''
  str += `showing snippets ${(currentPage - 1) * snippetsPerPage} to ${Math.min(nrOfSnippets, currentPage * snippetsPerPage)} of a total of ${nrOfSnippets}`
  return str
})

// used to format posted and edited dates
hbs.registerHelper('formatDate', date => {
  if (date.getFullYear() === new Date().getFullYear()) {
    return moment(date).format('Do MMM HH:mm')
  }
  return moment(date).format('Do MMM -YY HH:mm')
})

// path for static files like css and other client files
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: false }))

// Routes
app.use('/', routes)

// Error handling
// 404
app.use((req, res, next) => {
  res.status(404)
  errorController.pageNotFound(req, res)
})

// 500
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500)
  errorController.serverError(err, req, res)
})

app.listen(port, () => {
  console.log('App - Server listening on port ' + port)
})
