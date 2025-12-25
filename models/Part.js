const mongoose = require('mongoose')

const partSchema = new mongoose.Schema({
  typePiece: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PartType',
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
  compatibilite: [{
    marque: String,
    modele: String,
    anneeDebut: Number,
    anneeFin: Number,
    motorisation: String
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  stockMin: {
    type: Number,
    default: 5
  },
  gererStock: {
    type: Boolean,
    default: true
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
  statut: {
    type: String,
    enum: ['brouillon', 'publie', 'indisponible', 'rupture'],
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
    type: String
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
  datePublication: Date,
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

partSchema.index({ typePiece: 1, statut: 1 })
partSchema.index({ stock: 1 })
partSchema.index({ slug: 1 }, { unique: true, sparse: true })

partSchema.pre('save', function(next) {
  this.dateModification = Date.now()
  
  if (!this.slug && this.titre) {
    this.slug = this.titre
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  
  if (this.gererStock && this.stock <= 0) {
    this.statut = 'rupture'
  }
  
  next()
})

module.exports = mongoose.models.Part || mongoose.model('Part', partSchema)
