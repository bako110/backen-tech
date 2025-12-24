const express = require('express')
const router = express.Router()
const partTypeController = require('../controllers/partTypeController')
const { protect, authorize } = require('../middleware/auth')

router.use(protect)

router.route('/')
  .get(partTypeController.getPartTypes)
  .post(authorize('super_admin', 'admin'), partTypeController.createPartType)

router.route('/:id')
  .get(partTypeController.getPartType)
  .put(authorize('super_admin', 'admin'), partTypeController.updatePartType)
  .delete(authorize('super_admin', 'admin'), partTypeController.deletePartType)

router.put('/:id/reorder', authorize('super_admin', 'admin'), partTypeController.reorderPartType)

module.exports = router
