const Cart = require('../models/Cart')
const Vehicule = require('../models/Vehicule')
const Piece = require('../models/Piece')

class CartService {
  async getCart(clientId) {
    let cart = await Cart.findOne({ client: clientId })
      .populate('items.produitId')
    
    if (!cart) {
      cart = await Cart.create({ client: clientId, items: [] })
    }

    return cart
  }

  async addItem(clientId, { produitId, type, quantite = 1 }) {
    let cart = await Cart.findOne({ client: clientId })
    
    if (!cart) {
      cart = await Cart.create({ client: clientId, items: [] })
    }

    let produit
    if (type === 'Vehicule') {
      produit = await Vehicule.findById(produitId)
    } else {
      produit = await Piece.findById(produitId)
    }

    if (!produit) {
      throw new Error('Produit non trouvé')
    }

    if (type === 'Piece' && produit.stock < quantite) {
      throw new Error('Stock insuffisant')
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.produitId.toString() === produitId && item.type === type
    )

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantite += quantite
    } else {
      cart.items.push({
        produitId,
        type,
        quantite,
        prix: produit.prix
      })
    }

    await cart.save()
    await cart.populate('items.produitId')
    
    return cart
  }

  async updateQuantity(clientId, itemId, quantite) {
    const cart = await Cart.findOne({ client: clientId })
    
    if (!cart) {
      throw new Error('Panier non trouvé')
    }

    const item = cart.items.id(itemId)
    
    if (!item) {
      throw new Error('Article non trouvé dans le panier')
    }

    if (quantite <= 0) {
      cart.items.pull(itemId)
    } else {
      if (item.type === 'Piece') {
        const piece = await Piece.findById(item.produitId)
        if (piece && piece.stock < quantite) {
          throw new Error('Stock insuffisant')
        }
      }
      item.quantite = quantite
    }

    await cart.save()
    await cart.populate('items.produitId')
    
    return cart
  }

  async removeItem(clientId, itemId) {
    const cart = await Cart.findOne({ client: clientId })
    
    if (!cart) {
      throw new Error('Panier non trouvé')
    }

    cart.items.pull(itemId)
    await cart.save()
    await cart.populate('items.produitId')
    
    return cart
  }

  async clearCart(clientId) {
    const cart = await Cart.findOne({ client: clientId })
    
    if (!cart) {
      throw new Error('Panier non trouvé')
    }

    cart.items = []
    await cart.save()
    
    return cart
  }

  async getCartTotal(clientId) {
    const cart = await this.getCart(clientId)
    
    const total = cart.items.reduce((sum, item) => {
      return sum + (item.prix * item.quantite)
    }, 0)

    return {
      items: cart.items.length,
      total
    }
  }
}

module.exports = new CartService()
