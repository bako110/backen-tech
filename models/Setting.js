const mongoose = require('mongoose')

const settingSchema = new mongoose.Schema({
  nomApplication: {
    type: String,
    default: 'MAB'
  },
  logo: String,
  logoMobile: String,
  favicon: String,
  theme: {
    couleurPrimaire: { type: String, default: '#1E40AF' },
    couleurSecondaire: { type: String, default: '#10B981' },
    couleurAccent: { type: String, default: '#F59E0B' },
    couleurTexte: { type: String, default: '#1F2937' },
    couleurFond: { type: String, default: '#FFFFFF' },
    modeSombre: { type: Boolean, default: false }
  },
  devise: {
    code: { type: String, default: 'FCFA' },
    symbole: { type: String, default: 'FCFA' },
    position: { type: String, enum: ['avant', 'apres'], default: 'apres' }
  },
  langues: [{
    code: String,
    nom: String,
    actif: Boolean,
    parDefaut: Boolean
  }],
  zones: [{
    pays: String,
    villes: [String],
    actif: Boolean
  }],
  contact: {
    telephone: String,
    email: String,
    whatsapp: String,
    adresse: String,
    facebook: String,
    instagram: String,
    twitter: String
  },
  horaires: [{
    jour: String,
    ouvert: Boolean,
    heureOuverture: String,
    heureFermeture: String
  }],
  mobile: {
    versionMinimale: String,
    forcerMiseAJour: { type: Boolean, default: false },
    modeMaintenanceMobile: { type: Boolean, default: false },
    messageMaintenanceMobile: String,
    modeLectureSeule: { type: Boolean, default: false }
  },
  modifiePar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  dateModification: {
    type: Date,
    default: Date.now
  }
})

settingSchema.pre('save', function(next) {
  this.dateModification = Date.now()
  next()
})

module.exports = mongoose.model('Setting', settingSchema)
