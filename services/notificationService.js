const Notification = require('../models/Notification')

class NotificationService {
  async getNotifications(userId, filters = {}) {
    const { page = 1, limit = 20, type, lue } = filters

    const query = { destinataire: userId }
    if (type) query.type = type
    if (lue !== undefined) query.lue = lue === 'true'

    const notifications = await Notification.find(query)
      .sort({ dateCreation: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const count = await Notification.countDocuments(query)
    const nonLues = await Notification.countDocuments({ destinataire: userId, lue: false })

    return {
      notifications,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
      nonLues
    }
  }

  async createNotification(data) {
    if (!data.destinataire || !data.type || !data.titre || !data.message) {
      throw new Error('Données de notification incomplètes')
    }

    const notification = await Notification.create(data)
    return notification
  }

  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({ 
      _id: notificationId, 
      destinataire: userId 
    })

    if (!notification) {
      throw new Error('Notification non trouvée')
    }

    notification.lue = true
    notification.dateLecture = new Date()
    await notification.save()

    return notification
  }

  async markAllAsRead(userId) {
    await Notification.updateMany(
      { destinataire: userId, lue: false },
      { lue: true, dateLecture: new Date() }
    )

    return { success: true }
  }

  async deleteNotification(notificationId, userId) {
    const notification = await Notification.findOneAndDelete({ 
      _id: notificationId, 
      destinataire: userId 
    })

    if (!notification) {
      throw new Error('Notification non trouvée')
    }

    return { success: true }
  }

  // Méthodes utilitaires pour créer des notifications automatiques
  async notifyOrderStatus(userId, orderId, numeroCommande, statutNom) {
    const typeIcons = {
      'nouvelle': { icon: 'receipt', color: '#3B82F6' },
      'confirmee': { icon: 'checkmark-circle', color: '#10B981' },
      'en_preparation': { icon: 'time', color: '#F59E0B' },
      'disponible': { icon: 'cube', color: '#22C55E' },
      'livree': { icon: 'checkmark-done', color: '#6B7280' },
      'annulee': { icon: 'close-circle', color: '#EF4444' }
    }

    const config = typeIcons[statutNom.toLowerCase()] || { icon: 'notifications', color: '#3B82F6' }

    return this.createNotification({
      destinataire: userId,
      type: 'commande',
      titre: `Commande ${numeroCommande}`,
      message: `Votre commande est maintenant : ${statutNom}`,
      icone: config.icon,
      couleur: config.color,
      lien: `/orders/${orderId}`,
      donnees: { orderId, numeroCommande, statut: statutNom }
    })
  }

  async notifyNewMessage(userId, conversationId, sujet) {
    return this.createNotification({
      destinataire: userId,
      type: 'message',
      titre: 'Nouveau message',
      message: `Vous avez reçu un nouveau message concernant : ${sujet}`,
      icone: 'chatbubble',
      couleur: '#3B82F6',
      lien: `/messages/${conversationId}`,
      donnees: { conversationId, sujet }
    })
  }
}

module.exports = new NotificationService()
