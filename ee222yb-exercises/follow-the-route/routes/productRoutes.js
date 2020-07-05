'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/controller')

router.get('/', controller.getProductsOverview)
router.get('/create', controller.getCreateProduct)
router.get('/:id', controller.getProductInfo)
router.get('/:id/delete', controller.deleteProduct)
router.post('/create', controller.postNewProduct)

module.exports = router
