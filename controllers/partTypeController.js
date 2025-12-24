const partTypeService = require('../services/partTypeService')

exports.getPartTypes = async (req, res) => {
  try {
    const partTypes = await partTypeService.getPartTypes(req.query)

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

exports.getPartType = async (req, res) => {
  try {
    const partType = await partTypeService.getPartTypeById(req.params.id)

    res.json({
      success: true,
      partType
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération du type de pièce'
    })
  }
}

exports.createPartType = async (req, res) => {
  try {
    const partType = await partTypeService.createPartType(req.body, req.admin._id)

    res.status(201).json({
      success: true,
      message: 'Type de pièce créé avec succès',
      partType
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ce code existe déjà'
      })
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la création du type de pièce'
    })
  }
}

exports.updatePartType = async (req, res) => {
  try {
    const partType = await partTypeService.updatePartType(req.params.id, req.body)

    res.json({
      success: true,
      message: 'Type de pièce mis à jour avec succès',
      partType
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour du type de pièce'
    })
  }
}

exports.deletePartType = async (req, res) => {
  try {
    await partTypeService.deletePartType(req.params.id)

    res.json({
      success: true,
      message: 'Type de pièce supprimé avec succès'
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Erreur lors de la suppression du type de pièce'
    })
  }
}

exports.reorderPartType = async (req, res) => {
  try {
    const { ordre } = req.body
    const partType = await partTypeService.reorderPartType(req.params.id, ordre)

    res.json({
      success: true,
      message: 'Ordre mis à jour avec succès',
      partType
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour de l\'ordre'
    })
  }
}
