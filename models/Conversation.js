const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sujet: {
    type: String,
    required: true,
    trim: true
  },
  statut: {
    type: String,
    enum: ['ouverte', 'en_cours', 'resolue', 'fermee'],
    default: 'ouverte'
  },
  priorite: {
    type: String,
    enum: ['basse', 'normale', 'haute', 'urgente'],
    default: 'normale'
  },
  assigneA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  dernierMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  dateDernierMessage: Date,
  messagesNonLus: {
    type: Number,
    default: 0
  },
  messagesNonLusClient: {
    type: Number,
    default: 0
  },
  archive: {
    type: Boolean,
    default: false
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

conversationSchema.index({ client: 1, dateCreation: -1 })
conversationSchema.index({ statut: 1 })
conversationSchema.index({ assigneA: 1 })

conversationSchema.pre('save', function(next) {
  this.dateModification = Date.now()
  next()
})

module.exports = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema)
