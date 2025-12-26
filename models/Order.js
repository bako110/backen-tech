const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  numeroCommande: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client: {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    telephone: { type: String, required: true },
    email: String,
    adresse: String,
    ville: String,
    pays: String
  },
  produits: [{
    type: {
      type: String,
      enum: ['vehicule', 'piece'],
      required: true
    },
    produitId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'produits.type'
    },
    titre: String,
    prix: Number,
    quantite: {
      type: Number,
      default: 1,
      min: 1
    },
    sousTotal: Number,
    snapshot: mongoose.Schema.Types.Mixed
  }],
  sousTotal: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  devise: {
    type: String,
    default: 'FCFA'
  },
  statut: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderStatus'
  },
  historiqueStatuts: [{
    statut: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderStatus'
    },
    date: {
      type: Date,
      default: Date.now
    },
    commentaire: String,
    parAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    }
  }],
  noteClient: String,
  noteInterne: String,
  dateCommande: {
    type: Date,
    default: Date.now
  },
  dateConfirmation: Date,
  dateLivraison: Date,
  archive: {
    type: Boolean,
    default: false
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

orderSchema.index({ numeroCommande: 1 }, { unique: true })
orderSchema.index({ statut: 1 })
orderSchema.index({ 'client.telephone': 1 })
orderSchema.index({ dateCommande: -1 })

orderSchema.pre('save', function(next) {
  this.dateModification = Date.now()
  next()
})

orderSchema.statics.generateOrderNumber = async function() {
  const year = new Date().getFullYear()
  const lastOrder = await this.findOne({
    numeroCommande: new RegExp(`^CMD-${year}-`)
  }).sort({ numeroCommande: -1 })
  
  let nextNumber = 1
  if (lastOrder) {
    const lastNumber = parseInt(lastOrder.numeroCommande.split('-')[2])
    nextNumber = lastNumber + 1
  }
  
  return `CMD-${year}-${String(nextNumber).padStart(4, '0')}`
}

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema)
