const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')
const { protect, authorize } = require('../middleware/auth')

router.use(protect)

router.route('/')
  .get(orderController.getOrders)
  .post(orderController.createOrder)

router.route('/:id')
  .get(orderController.getOrder)
  .put(authorize('super_admin', 'admin', 'agent'), orderController.updateOrder)
  .delete(authorize('super_admin', 'admin'), orderController.deleteOrder)

router.put('/:id/status', authorize('super_admin', 'admin', 'agent'), orderController.updateOrderStatus)

module.exports = router
