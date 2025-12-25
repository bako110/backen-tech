const express = require('express')
const router = express.Router()
const Admin = require('../models/Admin')

router.post('/execute-unsafe', async (req, res) => {
  try {
    await Admin.deleteMany()

    const admin = await Admin.create({
      nom: 'Super Admin',
      email: 'admin@mab.com',
      motDePasse: 'admin123',
      role: 'super_admin',
      actif: true,
      permissions: ['all']
    })

    res.json({
      success: true,
      message: ' Admin créé avec succès',
      data: {
        admin: {
          nom: admin.nom,
          email: admin.email,
          role: admin.role
        }
      },
      credentials: {
        email: 'admin@mab.com',
        password: 'admin123'
      }
    })
  } catch (error) {
    console.error('Erreur seed:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'admin',
      error: error.message
    })
  }
})

module.exports = router
