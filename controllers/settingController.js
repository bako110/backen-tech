const settingService = require('../services/settingService')

exports.getSettings = async (req, res) => {
  try {
    const settings = await settingService.getSettings()

    res.json({
      success: true,
      settings
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération des paramètres'
    })
  }
}

exports.updateSettings = async (req, res) => {
  try {
    const settings = await settingService.updateSettings(req.body, req.admin._id)

    res.json({
      success: true,
      message: 'Paramètres mis à jour avec succès',
      settings
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour des paramètres'
    })
  }
}
