const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const { protect, authorize } = require('../middleware/auth')

router.use(protect)
router.use(authorize('super_admin', 'admin'))

router.route('/')
  .get(adminController.getAdmins)
  .post(adminController.createAdmin)

router.route('/:id')
  .get(adminController.getAdmin)
  .put(adminController.updateAdmin)
  .delete(adminController.deleteAdmin)

router.put('/:id/toggle-status', adminController.toggleAdminStatus)

module.exports = router
