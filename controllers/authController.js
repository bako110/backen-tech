const { validationResult } = require('express-validator')
const authService = require('../services/authService')

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation',
        errors: errors.array()
      })
    }

    const { nom, email, telephone, motDePasse } = req.body

    const result = await authService.register(nom, email, telephone, motDePasse)

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      ...result
    })
  } catch (error) {
    console.error('Erreur inscription:', error)
    res.status(400).json({
      success: false,
      message: error.message || 'Erreur lors de l\'inscription'
    })
  }
}

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation',
        errors: errors.array()
      })
    }

    const { email, motDePasse } = req.body

    const result = await authService.login(email, motDePasse)

    res.json({
      success: true,
      ...result
    })
  } catch (error) {
    console.error('Erreur login:', error)
    res.status(401).json({
      success: false,
      message: error.message || 'Erreur lors de la connexion'
    })
  }
}

exports.logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  })
}

exports.getMe = async (req, res) => {
  try {
    const admin = await authService.getMe(req.admin._id)

    res.json({
      success: true,
      admin
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération du profil'
    })
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const admin = await authService.updateProfile(req.admin._id, req.body)

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      admin
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour du profil'
    })
  }
}

exports.changePassword = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { ancienMotDePasse, nouveauMotDePasse } = req.body

    await authService.changePassword(req.admin._id, ancienMotDePasse, nouveauMotDePasse)

    res.json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Erreur lors du changement de mot de passe'
    })
  }
}
