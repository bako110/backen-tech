const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema({
  typeVehicule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VehicleType',
    required: true
  },
  titre: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  champsDynamiques: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  prix: {
    type: Number,
    required: true,
    min: 0
  },
  prixPromo: {
    type: Number,
    min: 0
  },
  devise: {
    type: String,
    default: 'FCFA'
  },
  afficherPrix: {
    type: Boolean,
    default: true
  },
  images: [{
    url: String,
    ordre: Number,
    principale: Boolean
  }],
  videos: [{
    url: String,
    type: String
  }],
  statut: {
    type: String,
    enum: ['brouillon', 'publie', 'indisponible', 'vendu'],
    default: 'brouillon'
  },
  miseEnAvant: {
    type: Boolean,
    default: false
  },
  nouveau: {
    type: Boolean,
    default: false
  },
  populaire: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  tags: [String],
  vues: {
    type: Number,
    default: 0
  },
  favoris: {
    type: Number,
    default: 0
  },
  partages: {
    type: Number,
    default: 0
  },
  datePublication: Date,
  dateArchivage: Date,
  archive: {
    type: Boolean,
    default: false
  },
  creePar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  modifiePar: {
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

vehicleSchema.index({ statut: 1, miseEnAvant: -1 })
vehicleSchema.index({ 'champsDynamiques.marque': 1 })
vehicleSchema.index({ slug: 1 })

vehicleSchema.pre('save', function(next) {
  this.dateModification = Date.now()
  
  if (!this.slug && this.titre) {
    this.slug = this.titre
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  
  next()
})

module.exports = mongoose.model('Vehicle', vehicleSchema)
