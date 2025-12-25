const mongoose = require('mongoose')

const orderStatusSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  nomFr: String,
  nomEn: String,
  code: {
    type: String,
    required: true,
    lowercase: true
  },
  description: String,
  couleur: String,
  icone: String,
  ordre: {
    type: Number,
    default: 0
  },
  actif: {
    type: Boolean,
    default: true
  },
  notifierClient: {
    type: Boolean,
    default: false
  },
  messageClient: String,
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dateModification: {
    type: Date,
    default: Date.now
  }
})

orderStatusSchema.index({ code: 1 }, { unique: true })
orderStatusSchema.index({ ordre: 1 })

module.exports = mongoose.model('OrderStatus', orderStatusSchema)
