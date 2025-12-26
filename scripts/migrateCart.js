const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const migrateCart = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB connecté')

    const db = mongoose.connection.db
    const cartsCollection = db.collection('carts')

    // Supprimer tous les paniers existants (solution simple)
    const result = await cartsCollection.deleteMany({})
    console.log(`🗑️  ${result.deletedCount} panier(s) supprimé(s)`)

    // Alternative: Migrer les données existantes
    // const updateResult = await cartsCollection.updateMany(
    //   { 'items.type': 'Vehicule' },
    //   { $set: { 'items.$[elem].type': 'Vehicle' } },
    //   { arrayFilters: [{ 'elem.type': 'Vehicule' }] }
    // )
    // console.log(`✅ ${updateResult.modifiedCount} Vehicule → Vehicle`)

    // await cartsCollection.updateMany(
    //   { 'items.type': 'Piece' },
    //   { $set: { 'items.$[elem].type': 'Part' } },
    //   { arrayFilters: [{ 'elem.type': 'Piece' }] }
    // )
    // console.log(`✅ ${updateResult.modifiedCount} Piece → Part`)

    console.log('✅ Migration terminée')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

migrateCart()
