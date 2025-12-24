const express = require('express')
const router = express.Router()
const settingController = require('../controllers/settingController')
const { protect, authorize } = require('../middleware/auth')

router.get('/', settingController.getSettings)

router.use(protect)

router.put('/', authorize('super_admin', 'admin'), settingController.updateSettings)

module.exports = router
