const express = require('express')
const router = express.Router()
const mobileController = require('../controllers/mobileController')
const messageController = require('../controllers/messageController')
const notificationController = require('../controllers/notificationController')
const { protectClient } = require('../middleware/auth')

router.get('/config', mobileController.getConfig)
router.get('/home', mobileController.getHome)
router.get('/vehicles', mobileController.getVehicles)
router.get('/vehicles/:id', mobileController.getVehicle)
router.get('/parts', mobileController.getParts)
router.get('/parts/:id', mobileController.getPart)
router.get('/part-types', mobileController.getPartTypes)

// Routes protégées (client connecté)
router.post('/orders', protectClient, mobileController.createOrder)
router.get('/orders', protectClient, mobileController.getMyOrders)
router.get('/orders/:id', protectClient, mobileController.getMyOrder)

// Routes de messagerie
router.get('/conversations', protectClient, messageController.getConversations)
router.post('/conversations', protectClient, messageController.createConversation)
router.get('/conversations/:id', protectClient, messageController.getConversation)
router.get('/conversations/:id/messages', protectClient, messageController.getMessages)
router.post('/conversations/:id/messages', protectClient, messageController.sendMessage)
router.put('/conversations/:id/read', protectClient, messageController.markAsRead)
router.put('/messages/:messageId', protectClient, messageController.updateMessage)
router.delete('/messages/:messageId', protectClient, messageController.deleteMessage)

// Routes de notifications
router.get('/notifications', protectClient, notificationController.getNotifications)
router.put('/notifications/:id/read', protectClient, notificationController.markAsRead)
router.put('/notifications/read-all', protectClient, notificationController.markAllAsRead)
router.delete('/notifications/:id', protectClient, notificationController.deleteNotification)

module.exports = router
