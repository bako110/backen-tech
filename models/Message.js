const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  expediteur: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'expediteurType',
    required: true
  },
  expediteurType: {
    type: String,
    enum: ['User', 'Admin'],
    required: true
  },
  contenu: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['texte', 'image', 'fichier'],
    default: 'texte'
  },
  fichier: {
    url: String,
    nom: String,
    type: String,
    taille: Number
  },
  lu: {
    type: Boolean,
    default: false
  },
  dateLecture: Date,
  modifie: {
    type: Boolean,
    default: false
  },
  dateModification: Date,
  supprime: {
    type: Boolean,
    default: false
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
})

messageSchema.index({ conversation: 1, dateCreation: -1 })
messageSchema.index({ expediteur: 1 })

module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema)
