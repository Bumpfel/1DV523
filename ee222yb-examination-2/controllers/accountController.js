'use strict'

const User = require('../models/user')
const functions = require('./functions')
const errorController = require('./errorController')
const msg = require('../strings/msgs')

const accountController = {}

/**
 *  Sets active user
 * @param {*} session request.session
 * @param {User} user object read from database. use undefined to unset
 */
const setUser = (session, user) => {
  if (user) {
    session.username = user.username
    session.userId = user._id
  } else {
    delete session.username
    delete session.userId
  }
}

/**
 * Login page (GET)
 */
accountController.login = (req, res) => {
  res.render('account/login', functions.setLocals(req))
  delete req.session.flash
}

/**
 * Login (POST) - expects req.body.username, req.body.password to authorize user
 */
accountController.loginPost = async (req, res) => {
  const user = await User.findOne({ username: req.body.username })
    .catch(err => {
      console.error(err)
      errorController.serverError(err, req, res) // error with db or db query
    })

  if (user && await user.authUser(req.body.password)) {
    // successful login
    functions.setFlashSuccessMsg(req.session, 'Welcome ' + req.body.username) // should be safe to print request body. Will only print it if user is already authorized
    setUser(req.session, user)

    res.redirect(req.session.prevUrl || '/') // go to previous url or home page
  } else {
    // unsuccessful login
    functions.setFlashErrorMsg(req.session, msg.badCredentials)
    res.status(401).render('account/login', functions.setLocals(req))
    // res.redirect('login')
  }
}

/**
 * Logout (GET)
 */
accountController.logout = async (req, res) => {
  if (req.session.userId) {
    setUser(req.session, undefined)
    functions.setFlashSuccessMsg(req.session, msg.loggedOut)
  }
  res.redirect(req.session.prevUrl || '/') // go to previous url or home page
  delete req.session.flash
}

/**
 * Create user page (GET)
 */
accountController.create = (req, res) => {
  const locals = functions.setLocals(req)
  locals.constraints = User.constraints
  locals.username = req.session.username
  delete req.session.username
  res.render('account/create', locals)
  delete req.session.flash
}

/**
 * Create user (POST) - expects req.body.username, req.body.password, and req.body.confirmPassword
 */
accountController.createPost = async (req, res) => {
  if (req.body.password !== req.body.confirmPassword) {
    // password does not match confirmPassword
    functions.setFlashErrorMsg(req.session, msg.badPasswordMatch)
    res.redirect('create')
    return
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password
  }).catch(err => {
    // db error or db query error
    functions.setFlashErrorMsg(req.session, err.message)
    req.session.username = req.body.username
    res.redirect('create')
  })

  if (user) {
    // new user credentials passed validation and was created
    setUser(req.session, user)
    functions.setFlashSuccessMsg(req.session, msg.accountCreated)
    res.redirect('/')
  }
}

module.exports = accountController
