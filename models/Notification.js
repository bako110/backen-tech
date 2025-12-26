const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  destinataire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['commande', 'message', 'promotion', 'systeme', 'alerte'],
    required: true
  },
  titre: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  icone: {
    type: String,
    default: 'notifications'
  },
  couleur: {
    type: String,
    default: '#3B82F6'
  },
  lien: {
    type: String
  },
  donnees: {
    type: mongoose.Schema.Types.Mixed
  },
  lue: {
    type: Boolean,
    default: false
  },
  dateLecture: Date,
  dateCreation: {
    type: Date,
    default: Date.now
  }
})

notificationSchema.index({ destinataire: 1, dateCreation: -1 })
notificationSchema.index({ lue: 1 })
notificationSchema.index({ type: 1 })

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema)
