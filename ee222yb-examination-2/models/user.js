'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const constraints = {}
constraints.username = { min: 4, max: 30 }
constraints.password = { min: 6 }

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, minlength: constraints.username.min, maxlength: constraints.username.maxlength },
  password: { type: String, required: true, minlength: constraints.password.min }
}, { timestamps: true })

userSchema.statics.constraints = constraints

// hashes password to unrecognition before inserting into the db when creating a new user
userSchema.pre('save', async function (next) {
  const hashPassword = await bcrypt.hash(this.password, 12)
  this.password = hashPassword
})

// hashes the typed password with the same hashing algorithm and compares equality with the password in the database
userSchema.methods.authUser = async function (typedPassword) {
  return bcrypt.compare(typedPassword, this.password)
}

userSchema.path('username').validate(username => {
  return username.trim() === username
}, 'Username must not contain spaces at the beginning or the end')

module.exports = mongoose.model('User', userSchema)
