const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
  produitId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'items.type',
    required: true
  },
  type: {
    type: String,
    enum: ['Vehicle', 'Part'],
    required: true
  },
  quantite: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  prix: {
    type: Number,
    required: true
  }
})

const cartSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dateModification: {
    type: Date,
    default: Date.now
  }
})

cartSchema.index({ client: 1 })

cartSchema.pre('save', function(next) {
  this.dateModification = new Date()
  next()
})

module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema)
