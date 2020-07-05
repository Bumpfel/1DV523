'use strict'

const functions = require('./functions')
const controller = {}

/**
 * 404 page
 */
controller.pageNotFound = (req, res) => {
  res.render('error/404', functions.setLocals(req))
  delete req.session.flash
}

/**
 * 500 server error page
 */
controller.serverError = (err, req, res) => {
  res.status(err.status || 500).render('error/500', functions.setLocals(req))
  delete req.session.flash
}

/**
 * 403 forbidden page
 */
controller.forbidden = (req, res) => {
  res.status(403).render('error/403', functions.setLocals(req))
  delete req.session.flash
}

module.exports = controller
