'use strict'

const mongoose = require('mongoose')

// Login credentials should not really be here
const CONNECTION_STRING = 'mongodb+srv://dbUser:4MN8XiiAdHwzH8iv@exercises-zdrf7.mongodb.net/test?retryWrites=true&w=majority'

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
  return mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
}
