'use strict'

const express = require('express')
const hbs = require('express-hbs')
const session = require('express-session')
const path = require('path')
const mongoose = require('./config/mongoose')

const errorController = require('./controllers/errorController')
const app = express()
const port = 8000

const sessionOptions = {
  name: 'sessCookie',
  secret: '!SDF#55€asd2¨`31a', // should not really be stored here
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day in ms
  }
}

app.use(session(sessionOptions))

// connect to DB
mongoose.connect().catch(err => {
  console.log('An error occured connecting to the database')
  console.error(err)
  process.exitCode = 1
})

// Settings
app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, '/views/layouts/default')
}))
app.set('view engine', 'hbs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))

// Routes
app.use('/', require('./routes/routes'))
app.use('/createNumber', require('./routes/routes'))

// Error handling
// 404
app.use((req, res, next) => {
  // TODO use error layout
  res.status(404)
  errorController.pageNotFound(req, res)
})

// 500
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500)
})

app.listen(port, () => {
  console.log('App - Server listening on port ' + port)
})
