const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Non autorisé - Token manquant'
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const user = await User.findById(decoded.id).select('-motDePasse')
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      })
    }

    if (!user.actif) {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé'
      })
    }

    // Compatibilité : req.user pour tous, req.admin si admin, req.client si client
    req.user = user
    if (user.role === 'client') {
      req.client = user
    } else {
      req.admin = user
    }

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    })
  }
}

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas les permissions nécessaires'
      })
    }
    next()
  }
}

exports.protectClient = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Non autorisé - Token manquant'
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const user = await User.findById(decoded.id).select('-motDePasse')
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      })
    }

    if (!user.actif) {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé'
      })
    }

    if (user.role !== 'client') {
      return res.status(403).json({
        success: false,
        message: 'Accès réservé aux clients'
      })
    }

    req.user = user
    req.client = user

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    })
  }
}
