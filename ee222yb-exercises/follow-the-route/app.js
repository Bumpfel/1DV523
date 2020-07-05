'use strict'

const express = require('express')
const hbs = require('express-hbs')
const path = require('path')
const mongoose = require('./config/mongoose')

const errorController = require('./controllers/errorController')
const app = express()
const port = 8000

mongoose.connect().catch(err => {
  console.log('An error occured connecting to the database')
  console.error(err)
  process.exitCode = 1
})

app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, '/views/layouts/default')
}))
app.set('view engine', 'hbs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))

app.use('/', require('./routes/homeRoutes'))
app.use('/product', require('./routes/productRoutes'))

// error mgmt
app.use((req, res, next) => {
  // TODO use error layout
  res.status(404)
  errorController.pageNotFound(req, res)
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500)
})

app.listen(port, () => {
  console.log('App - Server listening on port ' + port)
})
