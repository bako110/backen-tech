const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  })
}

class AuthService {
  async login(email, motDePasse) {
    const admin = await Admin.findOne({ email }).select('+motDePasse')

    if (!admin) {
      throw new Error('Email ou mot de passe incorrect')
    }

    if (!admin.actif) {
      throw new Error('Votre compte est désactivé')
    }

    const isPasswordMatch = await admin.comparePassword(motDePasse)

    if (!isPasswordMatch) {
      throw new Error('Email ou mot de passe incorrect')
    }

    admin.dernierConnexion = Date.now()
    await admin.save()

    const token = generateToken(admin._id)

    const adminData = admin.toObject()
    delete adminData.motDePasse

    return { token, admin: adminData }
  }

  async getMe(adminId) {
    const admin = await Admin.findById(adminId)
    return admin
  }

  async updateProfile(adminId, data) {
    const { nom, email, telephone, avatar } = data

    const admin = await Admin.findById(adminId)

    if (nom) admin.nom = nom
    if (email) admin.email = email
    if (telephone) admin.telephone = telephone
    if (avatar) admin.avatar = avatar

    await admin.save()

    return admin
  }

  async changePassword(adminId, ancienMotDePasse, nouveauMotDePasse) {
    const admin = await Admin.findById(adminId).select('+motDePasse')

    const isMatch = await admin.comparePassword(ancienMotDePasse)

    if (!isMatch) {
      throw new Error('Ancien mot de passe incorrect')
    }

    admin.motDePasse = nouveauMotDePasse
    await admin.save()

    return true
  }
}

module.exports = new AuthService()
