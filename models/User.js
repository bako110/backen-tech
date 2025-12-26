const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
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
  telephone: {
    type: String,
    required: [true, 'Le téléphone est requis'],
    trim: true
  },
  motDePasse: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false
  },
  role: {
    type: String,
    enum: ['client', 'admin', 'super_admin'],
    default: 'client'
  },
  adresse: {
    rue: String,
    ville: String,
    codePostal: String,
    pays: { type: String, default: 'Maroc' }
  },
  permissions: [{
    type: String
  }],
  actif: {
    type: Boolean,
    default: true
  },
  dateInscription: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

userSchema.pre('save', async function(next) {
  if (!this.isModified('motDePasse')) {
    return next()
  }
  
  const salt = await bcrypt.genSalt(10)
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt)
  next()
})

userSchema.methods.comparePassword = async function(motDePasse) {
  return await bcrypt.compare(motDePasse, this.motDePasse)
}

module.exports = mongoose.models.User || mongoose.model('User', userSchema)
