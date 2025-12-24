const adminService = require('../services/adminService')

exports.getAdmins = async (req, res) => {
  try {
    const result = await adminService.getAdmins(req.query)

    res.json({
      success: true,
      ...result
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération des administrateurs'
    })
  }
}

exports.getAdmin = async (req, res) => {
  try {
    const admin = await adminService.getAdminById(req.params.id)

    res.json({
      success: true,
      admin
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération de l\'administrateur'
    })
  }
}

exports.createAdmin = async (req, res) => {
  try {
    const admin = await adminService.createAdmin(req.body, req.admin._id)

    res.status(201).json({
      success: true,
      message: 'Administrateur créé avec succès',
      admin
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Cet email existe déjà'
      })
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la création de l\'administrateur'
    })
  }
}

exports.updateAdmin = async (req, res) => {
  try {
    const admin = await adminService.updateAdmin(req.params.id, req.body)

    res.json({
      success: true,
      message: 'Administrateur mis à jour avec succès',
      admin
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour de l\'administrateur'
    })
  }
}

exports.deleteAdmin = async (req, res) => {
  try {
    await adminService.deleteAdmin(req.params.id, req.admin._id.toString())

    res.json({
      success: true,
      message: 'Administrateur supprimé avec succès'
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Erreur lors de la suppression de l\'administrateur'
    })
  }
}

exports.toggleAdminStatus = async (req, res) => {
  try {
    const admin = await adminService.toggleAdminStatus(req.params.id)

    res.json({
      success: true,
      message: `Administrateur ${admin.actif ? 'activé' : 'désactivé'} avec succès`,
      admin
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Erreur lors du changement de statut'
    })
  }
}
