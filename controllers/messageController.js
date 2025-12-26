const messageService = require('../services/messageService')

exports.getConversations = async (req, res) => {
  try {
    const result = await messageService.getConversations(req.client._id, req.query)

    res.json({
      success: true,
      ...result
    })
  } catch (error) {
    console.error('Erreur getConversations:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération des conversations'
    })
  }
}

exports.getConversation = async (req, res) => {
  try {
    const conversation = await messageService.getConversation(req.params.id, req.client._id)

    res.json({
      success: true,
      conversation
    })
  } catch (error) {
    console.error('Erreur getConversation:', error)
    const status = error.message === 'Conversation non trouvée' ? 404 : 500
    res.status(status).json({
      success: false,
      message: error.message
    })
  }
}

exports.createConversation = async (req, res) => {
  try {
    const conversation = await messageService.createConversation(req.body, req.client._id)

    res.status(201).json({
      success: true,
      message: 'Conversation créée avec succès',
      conversation
    })
  } catch (error) {
    console.error('Erreur createConversation:', error)
    const status = error.message.includes('requis') ? 400 : 500
    res.status(status).json({
      success: false,
      message: error.message
    })
  }
}

exports.getMessages = async (req, res) => {
  try {
    const result = await messageService.getMessages(req.params.id, req.client._id, req.query)

    res.json({
      success: true,
      ...result
    })
  } catch (error) {
    console.error('Erreur getMessages:', error)
    const status = error.message === 'Conversation non trouvée' ? 404 : 500
    res.status(status).json({
      success: false,
      message: error.message
    })
  }
}

exports.sendMessage = async (req, res) => {
  try {
    const message = await messageService.sendMessage(req.params.id, req.client._id, req.body)

    res.status(201).json({
      success: true,
      message: 'Message envoyé avec succès',
      data: message
    })
  } catch (error) {
    console.error('Erreur sendMessage:', error)
    const status = error.message === 'Conversation non trouvée' ? 404 : 
                   error.message.includes('vide') ? 400 : 500
    res.status(status).json({
      success: false,
      message: error.message
    })
  }
}

exports.markAsRead = async (req, res) => {
  try {
    const result = await messageService.markAsRead(req.params.id, req.client._id)

    res.json({
      success: true,
      message: 'Messages marqués comme lus'
    })
  } catch (error) {
    console.error('Erreur markAsRead:', error)
    const status = error.message === 'Conversation non trouvée' ? 404 : 500
    res.status(status).json({
      success: false,
      message: error.message
    })
  }
}

// Modifier un message
exports.updateMessage = async (req, res) => {
  try {
    const { contenu } = req.body

    if (!contenu || !contenu.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Le contenu du message est requis'
      })
    }

    const message = await messageService.updateMessage(
      req.params.messageId,
      req.client._id,
      contenu.trim()
    )

    res.json({
      success: true,
      message: 'Message modifié avec succès',
      data: message
    })
  } catch (error) {
    console.error('Erreur updateMessage:', error)
    const status = error.message.includes('non trouvé') ? 404 : 
                   error.message.includes('ne pouvez') ? 403 : 400
    res.status(status).json({
      success: false,
      message: error.message
    })
  }
}

// Supprimer un message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await messageService.deleteMessage(
      req.params.messageId,
      req.client._id
    )

    res.json({
      success: true,
      message: 'Message supprimé avec succès',
      data: message
    })
  } catch (error) {
    console.error('Erreur deleteMessage:', error)
    const status = error.message.includes('non trouvé') ? 404 : 
                   error.message.includes('ne pouvez') ? 403 : 400
    res.status(status).json({
      success: false,
      message: error.message
    })
  }
}
