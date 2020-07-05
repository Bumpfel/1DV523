'use strict'

const express = require('express')
const router = express.Router()
const homeController = require('../controllers/homeController')

router.get('/', homeController.HomePageGet)

router.get('/createNumber', homeController.NumberPageGet)
router.post('/createNumber', homeController.NumberPagePost)

module.exports = router
