const Setting = require('../models/Setting')
const Vehicle = require('../models/Vehicle')
const Part = require('../models/Part')
const PartType = require('../models/PartType')
const VehicleType = require('../models/VehicleType')
const Order = require('../models/Order')
const OrderStatus = require('../models/OrderStatus')

class MobileService {
  async getConfig() {
    let settings = await Setting.findOne()

    if (!settings) {
      settings = await Setting.create({})
    }

    const config = {
      nomApplication: settings.nomApplication,
      logo: settings.logo,
      logoMobile: settings.logoMobile,
      theme: settings.theme,
      devise: settings.devise,
      langues: settings.langues,
      contact: settings.contact,
      horaires: settings.horaires,
      mobile: settings.mobile
    }

    return config
  }

  async getHome() {
    const vehiculesNeufs = await Vehicle.find({
      statut: 'publie',
      typeVehicule: await VehicleType.findOne({ code: 'neuf' })
    })
      .limit(10)
      .sort({ miseEnAvant: -1, dateCreation: -1 })

    const vehiculesOccasion = await Vehicle.find({
      statut: 'publie',
      typeVehicule: await VehicleType.findOne({ code: 'occasion' })
    })
      .limit(10)
      .sort({ miseEnAvant: -1, dateCreation: -1 })

    const piecesPopulaires = await Part.find({
      statut: 'publie',
      populaire: true
    })
      .populate('typePiece')
      .limit(10)
      .sort({ vues: -1 })

    return {
      vehiculesNeufs,
      vehiculesOccasion,
      piecesPopulaires
    }
  }

  async getVehicles(filters = {}) {
    const { page = 1, limit = 20, typeVehicule, search, minPrix, maxPrix } = filters

    const query = { statut: 'publie' }

    if (typeVehicule) query.typeVehicule = typeVehicule
    if (search) {
      query.$or = [
        { titre: { $regex: search, $options: 'i' } },
        { 'champsDynamiques.marque': { $regex: search, $options: 'i' } }
      ]
    }
    if (minPrix || maxPrix) {
      query.prix = {}
      if (minPrix) query.prix.$gte = Number(minPrix)
      if (maxPrix) query.prix.$lte = Number(maxPrix)
    }

    const vehicles = await Vehicle.find(query)
      .populate('typeVehicule')
      .sort({ miseEnAvant: -1, dateCreation: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const count = await Vehicle.countDocuments(query)

    return {
      vehicles,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    }
  }

  async getVehicleById(id) {
    const vehicle = await Vehicle.findById(id).populate('typeVehicule')

    if (!vehicle || vehicle.statut !== 'publie') {
      throw new Error('Véhicule non trouvé')
    }

    vehicle.vues += 1
    await vehicle.save()

    return vehicle
  }

  async getParts(filters = {}) {
    const { page = 1, limit = 20, typePiece, search, minPrix, maxPrix } = filters

    const query = { statut: 'publie' }

    if (typePiece) query.typePiece = typePiece
    if (search) {
      query.$or = [
        { titre: { $regex: search, $options: 'i' } },
        { 'champsDynamiques.reference': { $regex: search, $options: 'i' } }
      ]
    }
    if (minPrix || maxPrix) {
      query.prix = {}
      if (minPrix) query.prix.$gte = Number(minPrix)
      if (maxPrix) query.prix.$lte = Number(maxPrix)
    }

    const parts = await Part.find(query)
      .populate('typePiece')
      .sort({ miseEnAvant: -1, dateCreation: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const count = await Part.countDocuments(query)

    return {
      parts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    }
  }

  async getPartById(id) {
    const part = await Part.findById(id).populate('typePiece')

    if (!part || part.statut !== 'publie') {
      throw new Error('Pièce non trouvée')
    }

    part.vues += 1
    await part.save()

    return part
  }

  async getPartTypes() {
    const partTypes = await PartType.find({ actif: true, visible: true })
      .sort({ ordre: 1 })

    return partTypes
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
        commentaire: 'Commande créée depuis l\'application mobile'
      }]
    }

    const order = await Order.create(data)
    return order
  }
}

module.exports = new MobileService()
