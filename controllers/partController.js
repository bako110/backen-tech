const partService = require('../services/partService')

exports.getParts = async (req, res) => {
  try {
    const result = await partService.getParts(req.query)

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
    const part = await partService.getPartById(req.params.id)

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

exports.createPart = async (req, res) => {
  try {
    const part = await partService.createPart(req.body, req.admin._id)

    res.status(201).json({
      success: true,
      message: 'Pièce créée avec succès',
      part
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la création de la pièce'
    })
  }
}

exports.updatePart = async (req, res) => {
  try {
    const part = await partService.updatePart(req.params.id, req.body, req.admin._id)

    res.json({
      success: true,
      message: 'Pièce mise à jour avec succès',
      part
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour de la pièce'
    })
  }
}

exports.deletePart = async (req, res) => {
  try {
    await partService.deletePart(req.params.id)

    res.json({
      success: true,
      message: 'Pièce supprimée avec succès'
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Erreur lors de la suppression de la pièce'
    })
  }
}
