const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const resetDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB connecté')

    const db = mongoose.connection.db
    
    // Récupérer toutes les collections
    const collections = await db.listCollections().toArray()
    
    console.log(`📋 ${collections.length} collection(s) trouvée(s)`)
    
    // Supprimer toutes les collections
    for (const collection of collections) {
      await db.collection(collection.name).drop()
      console.log(`🗑️  Collection "${collection.name}" supprimée`)
    }
    
    console.log('✅ Base de données complètement effacée')
    
    // Fermer la connexion
    await mongoose.connection.close()
    console.log('🔌 Connexion fermée')
    
    console.log('\n🌱 Lancement du seed...\n')
    
    // Exécuter le seed
    require('./seed')
    
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

resetDatabase()
