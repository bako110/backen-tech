const express = require('express')
const router = express.Router()
const mobileController = require('../controllers/mobileController')

router.get('/config', mobileController.getConfig)
router.get('/home', mobileController.getHome)
router.get('/vehicles', mobileController.getVehicles)
router.get('/vehicles/:id', mobileController.getVehicle)
router.get('/parts', mobileController.getParts)
router.get('/parts/:id', mobileController.getPart)
router.get('/part-types', mobileController.getPartTypes)
router.post('/orders', mobileController.createOrder)

module.exports = router
