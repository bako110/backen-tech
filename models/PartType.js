const mongoose = require('mongoose')

const partTypeSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  nomFr: String,
  nomEn: String,
  code: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  description: String,
  icone: String,
  couleur: String,
  image: String,
  ordre: {
    type: Number,
    default: 0
  },
  actif: {
    type: Boolean,
    default: true
  },
  visible: {
    type: Boolean,
    default: true
  },
  nombrePieces: {
    type: Number,
    default: 0
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

partTypeSchema.index({ code: 1 }, { unique: true })
partTypeSchema.index({ actif: 1, ordre: 1 })

partTypeSchema.pre('save', function(next) {
  this.dateModification = Date.now()
  next()
})

module.exports = mongoose.models.PartType || mongoose.model('PartType', partTypeSchema)
