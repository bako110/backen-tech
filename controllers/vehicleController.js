const vehicleService = require('../services/vehicleService')

exports.getVehicles = async (req, res) => {
  try {
    const result = await vehicleService.getVehicles(req.query)

    res.json({
      success: true,
      ...result
    })
  } catch (error) {
    console.error('Erreur getVehicles:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération des véhicules'
    })
  }
}

exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id)

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

exports.createVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body, req.admin._id)

    res.status(201).json({
      success: true,
      message: 'Véhicule créé avec succès',
      vehicle
    })
  } catch (error) {
    console.error('Erreur createVehicle:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la création du véhicule'
    })
  }
}

exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body, req.admin._id)

    res.json({
      success: true,
      message: 'Véhicule mis à jour avec succès',
      vehicle
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour du véhicule'
    })
  }
}

exports.deleteVehicle = async (req, res) => {
  try {
    await vehicleService.deleteVehicle(req.params.id)

    res.json({
      success: true,
      message: 'Véhicule supprimé avec succès'
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Erreur lors de la suppression du véhicule'
    })
  }
}
