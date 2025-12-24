const express = require('express')
const router = express.Router()
const vehicleController = require('../controllers/vehicleController')
const { protect, authorize } = require('../middleware/auth')

router.use(protect)

router.route('/')
  .get(vehicleController.getVehicles)
  .post(authorize('super_admin', 'admin', 'agent'), vehicleController.createVehicle)

router.route('/:id')
  .get(vehicleController.getVehicle)
  .put(authorize('super_admin', 'admin', 'agent'), vehicleController.updateVehicle)
  .delete(authorize('super_admin', 'admin'), vehicleController.deleteVehicle)

module.exports = router
