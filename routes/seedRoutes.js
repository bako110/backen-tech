const express = require('express')
const router = express.Router()
const { protect, authorize } = require('../middleware/auth')
const mongoose = require('mongoose')
const Admin = require('../models/Admin')
const VehicleType = require('../models/VehicleType')
const PartType = require('../models/PartType')
const OrderStatus = require('../models/OrderStatus')
const Setting = require('../models/Setting')

/**
 * @swagger
 * /api/seed:
 *   get:
 *     summary: Informations sur l'API de seed
 *     tags: [Seed]
 *     responses:
 *       200:
 *         description: Instructions pour utiliser l'API de seed
 */
router.get('/', (req, res) => {
  res.json({
    message: 'API de Seed - MAB Backend',
    endpoints: {
      'POST /api/seed/execute': {
        description: 'Exécuter le script de seed (réinitialise toutes les données)',
        authentication: 'Bearer Token (Super Admin uniquement)',
        method: 'POST',
        example: {
          curl: 'curl -X POST https://backen-tech-zz81.onrender.com/api/seed/execute -H "Authorization: Bearer YOUR_TOKEN"'
        }
      },
      'GET /api/seed/status': {
        description: 'Vérifier le statut de la base de données',
        authentication: 'Bearer Token (Super Admin uniquement)',
        method: 'GET'
      },
      'GET /api/seed/execute-unsafe': {
        description: 'Exécuter le seed via GET (NON SÉCURISÉ - uniquement pour test)',
        authentication: 'Aucune',
        method: 'GET',
        warning: '⚠️ Supprime toutes les données sans authentification'
      }
    },
    instructions: [
      '1. Connectez-vous via POST /api/auth/login avec email: admin@mab.com et password: admin123',
      '2. Récupérez le token JWT de la réponse',
      '3. Utilisez POST /api/seed/execute avec le header Authorization: Bearer TOKEN',
      '4. Ou utilisez GET /api/seed/execute-unsafe pour un test rapide (non sécurisé)'
    ]
  })
})

/**
 * @swagger
 * /api/seed/execute:
 *   post:
 *     summary: Exécuter le script de seed (Super Admin uniquement)
 *     tags: [Seed]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Seed exécuté avec succès
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
router.post('/execute', protect, authorize('super_admin'), async (req, res) => {
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
      message: '✅ Admin créé avec succès',
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

/**
 * @swagger
 * /api/seed/execute-unsafe:
 *   get:
 *     summary: Créer l'admin via GET (NON SÉCURISÉ - pour test uniquement)
 *     tags: [Seed]
 *     responses:
 *       200:
 *         description: Admin créé avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/execute-unsafe', async (req, res) => {
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
      message: '🎉 Admin créé avec succès via GET (non sécurisé)',
      warning: '⚠️ Cet endpoint devrait être désactivé en production',
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

/**
 * @swagger
 * /api/seed/status:
 *   get:
 *     summary: Vérifier le nombre d'admins
 *     tags: [Seed]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statut de la base de données
 */
router.get('/status', protect, authorize('super_admin'), async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments()

    res.json({
      success: true,
      adminCount,
      message: adminCount === 0 ? 'Aucun admin - Seed recommandé' : `${adminCount} admin(s) trouvé(s)`
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification du statut',
      error: error.message
    })
  }
})

module.exports = router
