const orderService = require('../services/orderService')

exports.getOrders = async (req, res) => {
  try {
    const result = await orderService.getOrders(req.query)

    res.json({
      success: true,
      ...result
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération des commandes'
    })
  }
}

exports.getOrder = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id)

    res.json({
      success: true,
      order
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération de la commande'
    })
  }
}

exports.createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body)

    res.status(201).json({
      success: true,
      message: 'Commande créée avec succès',
      order
    })
  } catch (error) {
    console.error('Erreur createOrder:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la création de la commande'
    })
  }
}

exports.updateOrder = async (req, res) => {
  try {
    const order = await orderService.updateOrder(req.params.id, req.body, req.admin._id)

    res.json({
      success: true,
      message: 'Commande mise à jour avec succès',
      order
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour de la commande'
    })
  }
}

exports.updateOrderStatus = async (req, res) => {
  try {
    const { statutId, commentaire } = req.body

    const order = await orderService.updateOrderStatus(
      req.params.id,
      statutId,
      commentaire,
      req.admin._id
    )

    res.json({
      success: true,
      message: 'Statut mis à jour avec succès',
      order
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour du statut'
    })
  }
}

exports.deleteOrder = async (req, res) => {
  try {
    await orderService.deleteOrder(req.params.id)

    res.json({
      success: true,
      message: 'Commande supprimée avec succès'
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Erreur lors de la suppression de la commande'
    })
  }
}
