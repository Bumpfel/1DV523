'use strict'

const express = require('express')
const router = express.Router()
const snippetController = require('../controllers/snippetController')
const accountController = require('../controllers/accountController')

// snippet routes
router.get('/', snippetController.index) // also search route
router.get('/snippet', snippetController.index)

router.get('/snippet/create', snippetController.create)
router.post('/snippet/create', snippetController.createPost)

router.get('/snippet/delete/:id', snippetController.delete)

router.get('/snippet/edit/:id', snippetController.edit)
router.post('/snippet/edit/:id', snippetController.editPost)

// account routes
router.get('/account/login', accountController.login)
router.post('/account/login', accountController.loginPost)

router.get('/logout', accountController.logout)

router.get('/account/create', accountController.create)
router.post('/account/create', accountController.createPost)

module.exports = router
