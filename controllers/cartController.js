const cartService = require('../services/cartService')

exports.getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.client._id)

    res.json({
      success: true,
      data: cart
    })
  } catch (error) {
    console.error('Erreur getCart:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.addItem = async (req, res) => {
  try {
    const { produitId, type, quantite } = req.body

    if (!produitId || !type) {
      return res.status(400).json({
        success: false,
        message: 'produitId et type sont requis'
      })
    }

    if (!['Vehicule', 'Piece'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type invalide. Doit être Vehicule ou Piece'
      })
    }

    const cart = await cartService.addItem(req.client._id, {
      produitId,
      type,
      quantite: quantite || 1
    })

    res.json({
      success: true,
      message: 'Article ajouté au panier',
      data: cart
    })
  } catch (error) {
    console.error('Erreur addItem:', error)
    const status = error.message.includes('non trouvé') ? 404 : 
                   error.message.includes('Stock') ? 400 : 500
    res.status(status).json({
      success: false,
      message: error.message
    })
  }
}

exports.updateQuantity = async (req, res) => {
  try {
    const { itemId } = req.params
    const { quantite } = req.body

    if (quantite === undefined) {
      return res.status(400).json({
        success: false,
        message: 'quantite est requise'
      })
    }

    const cart = await cartService.updateQuantity(req.client._id, itemId, quantite)

    res.json({
      success: true,
      message: 'Quantité mise à jour',
      data: cart
    })
  } catch (error) {
    console.error('Erreur updateQuantity:', error)
    const status = error.message.includes('non trouvé') ? 404 : 
                   error.message.includes('Stock') ? 400 : 500
    res.status(status).json({
      success: false,
      message: error.message
    })
  }
}

exports.removeItem = async (req, res) => {
  try {
    const { itemId } = req.params

    const cart = await cartService.removeItem(req.client._id, itemId)

    res.json({
      success: true,
      message: 'Article retiré du panier',
      data: cart
    })
  } catch (error) {
    console.error('Erreur removeItem:', error)
    const status = error.message.includes('non trouvé') ? 404 : 500
    res.status(status).json({
      success: false,
      message: error.message
    })
  }
}

exports.clearCart = async (req, res) => {
  try {
    const cart = await cartService.clearCart(req.client._id)

    res.json({
      success: true,
      message: 'Panier vidé',
      data: cart
    })
  } catch (error) {
    console.error('Erreur clearCart:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.getCartTotal = async (req, res) => {
  try {
    const total = await cartService.getCartTotal(req.client._id)

    res.json({
      success: true,
      data: total
    })
  } catch (error) {
    console.error('Erreur getCartTotal:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
