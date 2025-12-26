const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Admin = require('../models/Admin')

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  })
}

class AuthService {
  async register(nom, email, telephone, motDePasse) {
    const userExists = await User.findOne({ email })
    
    if (userExists) {
      throw new Error('Un compte avec cet email existe déjà')
    }

    const user = await User.create({
      nom,
      email,
      telephone,
      motDePasse,
      role: 'client'
    })

    const token = generateToken(user._id, user.role)

    return {
      token,
      client: {
        _id: user._id,
        nom: user.nom,
        email: user.email,
        telephone: user.telephone,
        role: user.role
      }
    }
  }

  async login(email, motDePasse) {
    // Chercher d'abord dans Admin
    let user = await Admin.findOne({ email }).select('+motDePasse')
    
    // Si pas trouvé dans Admin, chercher dans User
    if (!user) {
      user = await User.findOne({ email }).select('+motDePasse')
    }

    if (!user) {
      throw new Error('Email ou mot de passe incorrect')
    }

    if (!user.actif) {
      throw new Error('Votre compte est désactivé')
    }

    const isPasswordMatch = await user.comparePassword(motDePasse)

    if (!isPasswordMatch) {
      throw new Error('Email ou mot de passe incorrect')
    }

    const token = generateToken(user._id, user.role)

    const userData = user.toObject()
    delete userData.motDePasse

    const responseKey = user.role === 'client' ? 'client' : 'admin'

    return { token, [responseKey]: userData }
  }

  async getMe(userId) {
    const user = await User.findById(userId)
    return user
  }

  async updateProfile(userId, data) {
    const allowedFields = ['nom', 'email', 'telephone', 'adresse']
    const updates = {}

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updates[field] = data[field]
      }
    })

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    )

    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }

    return user
  }

  async changePassword(userId, ancienMotDePasse, nouveauMotDePasse) {
    const user = await User.findById(userId).select('+motDePasse')

    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }

    const isMatch = await user.comparePassword(ancienMotDePasse)

    if (!isMatch) {
      throw new Error('Ancien mot de passe incorrect')
    }

    user.motDePasse = nouveauMotDePasse
    await user.save()

    return true
  }
}

module.exports = new AuthService()
