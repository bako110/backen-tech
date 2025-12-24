const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Admin = require('../models/Admin')
const VehicleType = require('../models/VehicleType')
const PartType = require('../models/PartType')
const OrderStatus = require('../models/OrderStatus')
const Setting = require('../models/Setting')

dotenv.config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB connecté')
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error.message)
    process.exit(1)
  }
}

const seedData = async () => {
  try {
    await Admin.deleteMany()
    await VehicleType.deleteMany()
    await PartType.deleteMany()
    await OrderStatus.deleteMany()
    await Setting.deleteMany()

    console.log('🗑️  Données existantes supprimées')

    const admin = await Admin.create({
      nom: 'Super Admin',
      email: 'admin@mab.com',
      motDePasse: 'admin123',
      role: 'super_admin',
      actif: true,
      permissions: ['all']
    })

    console.log('✅ Admin créé:', admin.email)

    const vehicleTypes = await VehicleType.insertMany([
      {
        nom: 'Véhicule Neuf',
        nomFr: 'Véhicule Neuf',
        nomEn: 'New Vehicle',
        code: 'neuf',
        description: 'Véhicules neufs disponibles',
        icone: 'car',
        couleur: '#3B82F6',
        ordre: 1,
        actif: true,
        visible: true
      },
      {
        nom: 'Véhicule d\'Occasion',
        nomFr: 'Véhicule d\'Occasion',
        nomEn: 'Used Vehicle',
        code: 'occasion',
        description: 'Véhicules d\'occasion en bon état',
        icone: 'car',
        couleur: '#10B981',
        ordre: 2,
        actif: true,
        visible: true
      }
    ])

    console.log('✅ Types de véhicules créés:', vehicleTypes.length)

    const partTypes = await PartType.insertMany([
      {
        nom: 'Moteur',
        nomFr: 'Moteur',
        nomEn: 'Engine',
        code: 'moteur',
        description: 'Pièces du moteur',
        icone: 'engine',
        couleur: '#EF4444',
        ordre: 1,
        actif: true,
        visible: true
      },
      {
        nom: 'Freinage',
        nomFr: 'Freinage',
        nomEn: 'Braking',
        code: 'freinage',
        description: 'Système de freinage',
        icone: 'brake',
        couleur: '#F59E0B',
        ordre: 2,
        actif: true,
        visible: true
      },
      {
        nom: 'Suspension',
        nomFr: 'Suspension',
        nomEn: 'Suspension',
        code: 'suspension',
        description: 'Système de suspension',
        icone: 'suspension',
        couleur: '#8B5CF6',
        ordre: 3,
        actif: true,
        visible: true
      },
      {
        nom: 'Électricité',
        nomFr: 'Électricité',
        nomEn: 'Electrical',
        code: 'electricite',
        description: 'Système électrique',
        icone: 'electric',
        couleur: '#06B6D4',
        ordre: 4,
        actif: true,
        visible: true
      },
      {
        nom: 'Transmission',
        nomFr: 'Transmission',
        nomEn: 'Transmission',
        code: 'transmission',
        description: 'Système de transmission',
        icone: 'transmission',
        couleur: '#14B8A6',
        ordre: 5,
        actif: true,
        visible: true
      },
      {
        nom: 'Carrosserie',
        nomFr: 'Carrosserie',
        nomEn: 'Body',
        code: 'carrosserie',
        description: 'Pièces de carrosserie',
        icone: 'body',
        couleur: '#6366F1',
        ordre: 6,
        actif: true,
        visible: true
      }
    ])

    console.log('✅ Types de pièces créés:', partTypes.length)

    const orderStatuses = await OrderStatus.insertMany([
      {
        nom: 'Nouvelle',
        nomFr: 'Nouvelle',
        nomEn: 'New',
        code: 'nouvelle',
        description: 'Nouvelle commande',
        couleur: '#3B82F6',
        icone: 'new',
        ordre: 1,
        actif: true,
        notifierClient: true,
        messageClient: 'Votre commande a été reçue'
      },
      {
        nom: 'Confirmée',
        nomFr: 'Confirmée',
        nomEn: 'Confirmed',
        code: 'confirmee',
        description: 'Commande confirmée',
        couleur: '#10B981',
        icone: 'check',
        ordre: 2,
        actif: true,
        notifierClient: true,
        messageClient: 'Votre commande a été confirmée'
      },
      {
        nom: 'En préparation',
        nomFr: 'En préparation',
        nomEn: 'In preparation',
        code: 'en_preparation',
        description: 'Commande en cours de préparation',
        couleur: '#F59E0B',
        icone: 'preparation',
        ordre: 3,
        actif: true,
        notifierClient: true,
        messageClient: 'Votre commande est en préparation'
      },
      {
        nom: 'Disponible',
        nomFr: 'Disponible',
        nomEn: 'Available',
        code: 'disponible',
        description: 'Commande prête',
        couleur: '#22C55E',
        icone: 'available',
        ordre: 4,
        actif: true,
        notifierClient: true,
        messageClient: 'Votre commande est disponible'
      },
      {
        nom: 'Livrée',
        nomFr: 'Livrée',
        nomEn: 'Delivered',
        code: 'livree',
        description: 'Commande livrée',
        couleur: '#6B7280',
        icone: 'delivered',
        ordre: 5,
        actif: true,
        notifierClient: true,
        messageClient: 'Votre commande a été livrée'
      },
      {
        nom: 'Annulée',
        nomFr: 'Annulée',
        nomEn: 'Cancelled',
        code: 'annulee',
        description: 'Commande annulée',
        couleur: '#EF4444',
        icone: 'cancelled',
        ordre: 6,
        actif: true,
        notifierClient: true,
        messageClient: 'Votre commande a été annulée'
      }
    ])

    console.log('✅ Statuts de commande créés:', orderStatuses.length)

    const settings = await Setting.create({
      nomApplication: 'MAB',
      theme: {
        couleurPrimaire: '#1E40AF',
        couleurSecondaire: '#10B981',
        couleurAccent: '#F59E0B',
        couleurTexte: '#1F2937',
        couleurFond: '#FFFFFF',
        modeSombre: false
      },
      devise: {
        code: 'FCFA',
        symbole: 'FCFA',
        position: 'apres'
      },
      langues: [
        {
          code: 'fr',
          nom: 'Français',
          actif: true,
          parDefaut: true
        },
        {
          code: 'en',
          nom: 'English',
          actif: true,
          parDefaut: false
        }
      ],
      contact: {
        telephone: '+221 XX XXX XX XX',
        email: 'contact@mab.com',
        whatsapp: '+221 XX XXX XX XX',
        adresse: 'Dakar, Sénégal'
      },
      horaires: [
        { jour: 'lundi', ouvert: true, heureOuverture: '08:00', heureFermeture: '18:00' },
        { jour: 'mardi', ouvert: true, heureOuverture: '08:00', heureFermeture: '18:00' },
        { jour: 'mercredi', ouvert: true, heureOuverture: '08:00', heureFermeture: '18:00' },
        { jour: 'jeudi', ouvert: true, heureOuverture: '08:00', heureFermeture: '18:00' },
        { jour: 'vendredi', ouvert: true, heureOuverture: '08:00', heureFermeture: '18:00' },
        { jour: 'samedi', ouvert: true, heureOuverture: '09:00', heureFermeture: '13:00' },
        { jour: 'dimanche', ouvert: false, heureOuverture: '', heureFermeture: '' }
      ],
      mobile: {
        versionMinimale: '1.0.0',
        forcerMiseAJour: false,
        modeMaintenanceMobile: false,
        modeLectureSeule: false
      }
    })

    console.log('✅ Paramètres créés')

    console.log('\n🎉 Seed terminé avec succès!')
    console.log('\n📧 Email: admin@mab.com')
    console.log('🔑 Mot de passe: admin123')

    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur seed:', error)
    process.exit(1)
  }
}

connectDB().then(seedData)
