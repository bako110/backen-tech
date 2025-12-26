const notificationService = require('../services/notificationService')

exports.getNotifications = async (req, res) => {
  try {
    const result = await notificationService.getNotifications(req.client._id, req.query)

    res.json({
      success: true,
      ...result
    })
  } catch (error) {
    console.error('Erreur getNotifications:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération des notifications'
    })
  }
}

exports.markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.client._id)

    res.json({
      success: true,
      message: 'Notification marquée comme lue',
      notification
    })
  } catch (error) {
    console.error('Erreur markAsRead:', error)
    const status = error.message === 'Notification non trouvée' ? 404 : 500
    res.status(status).json({
      success: false,
      message: error.message
    })
  }
}

exports.markAllAsRead = async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.client._id)

    res.json({
      success: true,
      message: 'Toutes les notifications ont été marquées comme lues'
    })
  } catch (error) {
    console.error('Erreur markAllAsRead:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.deleteNotification = async (req, res) => {
  try {
    await notificationService.deleteNotification(req.params.id, req.client._id)

    res.json({
      success: true,
      message: 'Notification supprimée'
    })
  } catch (error) {
    console.error('Erreur deleteNotification:', error)
    const status = error.message === 'Notification non trouvée' ? 404 : 500
    res.status(status).json({
      success: false,
      message: error.message
    })
  }
}
