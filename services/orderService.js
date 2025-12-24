const Order = require('../models/Order')
const OrderStatus = require('../models/OrderStatus')

class OrderService {
  async getOrders(filters = {}) {
    const { page = 1, limit = 20, statut, search } = filters

    const query = {}

    if (statut) query.statut = statut
    if (search) {
      query.$or = [
        { numeroCommande: { $regex: search, $options: 'i' } },
        { 'client.nom': { $regex: search, $options: 'i' } },
        { 'client.prenom': { $regex: search, $options: 'i' } },
        { 'client.telephone': { $regex: search, $options: 'i' } }
      ]
    }

    const orders = await Order.find(query)
      .populate('statut')
      .sort({ dateCommande: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const count = await Order.countDocuments(query)

    return {
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    }
  }

  async getOrderById(id) {
    const order = await Order.findById(id)
      .populate('statut')
      .populate('historiqueStatuts.statut')
      .populate('historiqueStatuts.parAdmin')

    if (!order) {
      throw new Error('Commande non trouvée')
    }

    return order
  }

  async createOrder(data) {
    const numeroCommande = await Order.generateOrderNumber()
    data.numeroCommande = numeroCommande

    const defaultStatus = await OrderStatus.findOne({ code: 'nouvelle' })
    if (defaultStatus) {
      data.statut = defaultStatus._id
      data.historiqueStatuts = [{
        statut: defaultStatus._id,
        date: new Date(),
        commentaire: 'Commande créée'
      }]
    }

    const order = await Order.create(data)
    return order
  }

  async updateOrder(id, data, adminId) {
    data.modifiePar = adminId

    const order = await Order.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    ).populate('statut')

    if (!order) {
      throw new Error('Commande non trouvée')
    }

    return order
  }

  async updateOrderStatus(id, statutId, commentaire, adminId) {
    const order = await Order.findById(id)

    if (!order) {
      throw new Error('Commande non trouvée')
    }

    order.statut = statutId
    order.historiqueStatuts.push({
      statut: statutId,
      date: new Date(),
      commentaire,
      parAdmin: adminId
    })

    await order.save()
    await order.populate('statut')

    return order
  }

  async deleteOrder(id) {
    const order = await Order.findByIdAndDelete(id)

    if (!order) {
      throw new Error('Commande non trouvée')
    }

    return order
  }
}

module.exports = new OrderService()
