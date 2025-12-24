const express = require('express')
const router = express.Router()
const partController = require('../controllers/partController')
const { protect, authorize } = require('../middleware/auth')

router.use(protect)

router.route('/')
  .get(partController.getParts)
  .post(authorize('super_admin', 'admin', 'agent'), partController.createPart)

router.route('/:id')
  .get(partController.getPart)
  .put(authorize('super_admin', 'admin', 'agent'), partController.updatePart)
  .delete(authorize('super_admin', 'admin'), partController.deletePart)

module.exports = router
