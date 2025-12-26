const Conversation = require('../models/Conversation')
const Message = require('../models/Message')

class MessageService {
  async getConversations(userId, filters = {}) {
    const { page = 1, limit = 20, statut } = filters

    const query = { client: userId, archive: false }
    if (statut) query.statut = statut

    const conversations = await Conversation.find(query)
      .populate('dernierMessage')
      .populate('assigneA', 'nom email')
      .sort({ dateDernierMessage: -1, dateCreation: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const count = await Conversation.countDocuments(query)

    return {
      conversations,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    }
  }

  async getConversation(conversationId, userId) {
    const conversation = await Conversation.findOne({ 
      _id: conversationId, 
      client: userId 
    })
      .populate('assigneA', 'nom email')

    if (!conversation) {
      throw new Error('Conversation non trouvée')
    }

    return conversation
  }

  async createConversation(data, userId) {
    if (!data.sujet || !data.message) {
      throw new Error('Le sujet et le message sont requis')
    }

    const conversation = await Conversation.create({
      client: userId,
      sujet: data.sujet,
      statut: 'ouverte',
      priorite: data.priorite || 'normale'
    })

    const message = await Message.create({
      conversation: conversation._id,
      expediteur: userId,
      expediteurType: 'User',
      contenu: data.message,
      type: 'texte'
    })

    conversation.dernierMessage = message._id
    conversation.dateDernierMessage = message.dateCreation
    await conversation.save()

    await conversation.populate('dernierMessage')

    return conversation
  }

  async getMessages(conversationId, userId, filters = {}) {
    const conversation = await Conversation.findOne({ 
      _id: conversationId, 
      client: userId 
    })

    if (!conversation) {
      throw new Error('Conversation non trouvée')
    }

    const { page = 1, limit = 50 } = filters

    const messages = await Message.find({ conversation: conversationId })
      .populate('expediteur', 'nom email')
      .sort({ dateCreation: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const count = await Message.countDocuments({ conversation: conversationId })

    // Marquer les messages comme lus
    await Message.updateMany(
      { 
        conversation: conversationId, 
        expediteurType: 'Admin',
        lu: false 
      },
      { 
        lu: true, 
        dateLecture: new Date() 
      }
    )

    // Réinitialiser le compteur de messages non lus pour le client
    conversation.messagesNonLusClient = 0
    await conversation.save()

    return {
      messages: messages.reverse(),
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    }
  }

  async sendMessage(conversationId, userId, data) {
    const conversation = await Conversation.findOne({ 
      _id: conversationId, 
      client: userId 
    })

    if (!conversation) {
      throw new Error('Conversation non trouvée')
    }

    if (!data.contenu) {
      throw new Error('Le message ne peut pas être vide')
    }

    const message = await Message.create({
      conversation: conversationId,
      expediteur: userId,
      expediteurType: 'User',
      contenu: data.contenu,
      type: data.type || 'texte',
      fichier: data.fichier
    })

    conversation.dernierMessage = message._id
    conversation.dateDernierMessage = message.dateCreation
    conversation.messagesNonLus += 1
    await conversation.save()

    await message.populate('expediteur', 'nom email')

    return message
  }

  async markAsRead(conversationId, userId) {
    const conversation = await Conversation.findOne({ 
      _id: conversationId, 
      client: userId 
    })

    if (!conversation) {
      throw new Error('Conversation non trouvée')
    }

    await Message.updateMany(
      { 
        conversation: conversationId, 
        expediteurType: 'Admin',
        lu: false 
      },
      { 
        lu: true, 
        dateLecture: new Date() 
      }
    )

    conversation.messagesNonLusClient = 0
    await conversation.save()

    return { success: true }
  }

  // Modifier un message
  async updateMessage(messageId, userId, newContent) {
    const message = await Message.findById(messageId)

    if (!message) {
      throw new Error('Message non trouvé')
    }

    // Vérifier que l'utilisateur est bien l'expéditeur
    if (message.expediteurType !== 'User' || message.expediteur.toString() !== userId.toString()) {
      throw new Error('Vous ne pouvez modifier que vos propres messages')
    }

    // Vérifier que le message n'a pas plus de 15 minutes
    const messageAge = Date.now() - new Date(message.dateCreation).getTime()
    const fifteenMinutes = 15 * 60 * 1000
    
    if (messageAge > fifteenMinutes) {
      throw new Error('Vous ne pouvez modifier un message que dans les 15 minutes suivant son envoi')
    }

    message.contenu = newContent
    message.modifie = true
    message.dateModification = new Date()
    await message.save()

    return message
  }

  // Supprimer un message
  async deleteMessage(messageId, userId) {
    const message = await Message.findById(messageId)

    if (!message) {
      throw new Error('Message non trouvé')
    }

    // Vérifier que l'utilisateur est bien l'expéditeur
    if (message.expediteurType !== 'User' || message.expediteur.toString() !== userId.toString()) {
      throw new Error('Vous ne pouvez supprimer que vos propres messages')
    }

    // Soft delete - marquer comme supprimé au lieu de supprimer réellement
    message.supprime = true
    message.contenu = 'Message supprimé'
    await message.save()

    return message
  }
}

module.exports = new MessageService()
