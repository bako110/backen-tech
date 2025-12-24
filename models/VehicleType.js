const mongoose = require('mongoose')

const vehicleTypeSchema = new mongoose.Schema({
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
    unique: true,
    lowercase: true,
    trim: true
  },
  description: String,
  icone: String,
  couleur: String,
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

vehicleTypeSchema.index({ code: 1 })
vehicleTypeSchema.index({ actif: 1, ordre: 1 })

module.exports = mongoose.model('VehicleType', vehicleTypeSchema)
