'use strict'

const mongoose = require('mongoose')

// to avoid deprecation warnings
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

module.exports.connect = async () => {
  // Notificiations for events
  mongoose.connection.on('connected', () => console.log('Mongoose connection opened'))
  mongoose.connection.on('error', err => console.error('Mongoose connection error: ' + err))
  mongoose.connection.on('disconnect', () => console.log('Mongoose connection disconnected'))

  // Close connection on node application termination
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.error('Mongoose disconnected due to application termination')
      process.exit(0)
    })
  })

  // Connect
  // return mongoose.connect('mongodb://db:27017', { useNewUrlParser: true, useUnifiedTopology: true })
  return mongoose.connect(require('../credentials/mongoose.json').connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
}
