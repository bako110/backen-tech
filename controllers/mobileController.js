const mobileService = require('../services/mobileService')

exports.getConfig = async (req, res) => {
  try {
    const config = await mobileService.getConfig()

    res.json({
      success: true,
      config
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération de la configuration'
    })
  }
}

exports.getHome = async (req, res) => {
  try {
    const home = await mobileService.getHome()

    res.json({
      success: true,
      home
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération de l\'accueil'
    })
  }
}

exports.getVehicles = async (req, res) => {
  try {
    const result = await mobileService.getVehicles(req.query)

    res.json({
      success: true,
      ...result
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération des véhicules'
    })
  }
}

exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await mobileService.getVehicleById(req.params.id)

    res.json({
      success: true,
      vehicle
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération du véhicule'
    })
  }
}

exports.getParts = async (req, res) => {
  try {
    const result = await mobileService.getParts(req.query)

    res.json({
      success: true,
      ...result
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération des pièces'
    })
  }
}

exports.getPart = async (req, res) => {
  try {
    const part = await mobileService.getPartById(req.params.id)

    res.json({
      success: true,
      part
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération de la pièce'
    })
  }
}

exports.getPartTypes = async (req, res) => {
  try {
    const partTypes = await mobileService.getPartTypes()

    res.json({
      success: true,
      partTypes
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération des types de pièces'
    })
  }
}

exports.createOrder = async (req, res) => {
  try {
    const order = await mobileService.createOrder(req.body)

    res.status(201).json({
      success: true,
      message: 'Commande créée avec succès',
      order
    })
  } catch (error) {
    console.error('Erreur createOrder mobile:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la création de la commande'
    })
  }
}
