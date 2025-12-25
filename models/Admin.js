const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const adminSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true
  },
  motDePasse: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: 6,
    select: false
  },
  telephone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'agent', 'vendeur'],
    default: 'agent'
  },
  avatar: {
    type: String
  },
  actif: {
    type: Boolean,
    default: true
  },
  permissions: [{
    type: String
  }],
  dernierConnexion: {
    type: Date
  },
  creePar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dateModification: {
    type: Date,
    default: Date.now
  }
})

adminSchema.pre('save', async function(next) {
  if (!this.isModified('motDePasse')) {
    return next()
  }
  
  const salt = await bcrypt.genSalt(10)
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt)
  next()
})

adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.motDePasse)
}

adminSchema.pre('save', function(next) {
  this.dateModification = Date.now()
  next()
})

module.exports = mongoose.models.Admin || mongoose.model('Admin', adminSchema)
