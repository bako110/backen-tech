const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const authController = require('../controllers/authController')
const { protect } = require('../middleware/auth')

router.post('/register', [
  body('nom').notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('telephone').notEmpty().withMessage('Le téléphone est requis'),
  body('motDePasse').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
], authController.register)

router.post('/login', [
  body('email').isEmail().withMessage('Email invalide'),
  body('motDePasse').notEmpty().withMessage('Mot de passe requis')
], authController.login)

router.post('/logout', protect, authController.logout)

router.get('/me', protect, authController.getMe)

router.put('/profile', protect, authController.updateProfile)

router.put('/change-password', protect, [
  body('ancienMotDePasse').notEmpty().withMessage('Ancien mot de passe requis'),
  body('nouveauMotDePasse').isLength({ min: 6 }).withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
], authController.changePassword)

module.exports = router
