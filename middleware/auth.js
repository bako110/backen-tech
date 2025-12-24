const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

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
    
    req.admin = await Admin.findById(decoded.id).select('-motDePasse')
    
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Administrateur non trouvé'
      })
    }

    if (!req.admin.actif) {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé'
      })
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
