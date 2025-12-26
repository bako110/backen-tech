const express = require('express')
const router = express.Router()
const Admin = require('../models/Admin')
const VehicleType = require('../models/VehicleType')
const PartType = require('../models/PartType')
const OrderStatus = require('../models/OrderStatus')
const Setting = require('../models/Setting')
const Vehicle = require('../models/Vehicle')
const Part = require('../models/Part')

router.post('/execute', async (req, res) => {
  try {
    // Supprimer toutes les données existantes
    await Admin.deleteMany()
    await VehicleType.deleteMany()
    await PartType.deleteMany()
    await OrderStatus.deleteMany()
    await Setting.deleteMany()
    await Vehicle.deleteMany()
    await Part.deleteMany()

    console.log('🗑️  Données existantes supprimées')

    // Créer l'admin
    const admin = await Admin.create({
      nom: 'Super Admin',
      email: 'admin@mab.com',
      motDePasse: 'admin123',
      role: 'super_admin',
      actif: true,
      permissions: ['all']
    })

    console.log('✅ Admin créé:', admin.email)

    // Créer les types de véhicules
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

    // Créer les types de pièces
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

    // Créer les statuts de commande
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

    // Créer les paramètres
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

    // Créer les véhicules
    const vehicles = await Vehicle.insertMany([
      {
        typeVehicule: vehicleTypes[0]._id,
        titre: 'Toyota Corolla 2024',
        description: 'Véhicule neuf, économique et fiable. Parfait pour la ville.',
        prix: 15000000,
        prixPromo: 14500000,
        statut: 'publie',
        miseEnAvant: true,
        nouveau: true,
        populaire: true,
        champsDynamiques: {
          marque: 'Toyota',
          modele: 'Corolla',
          annee: 2024,
          kilometrage: 0,
          carburant: 'Essence',
          transmission: 'Automatique',
          couleur: 'Blanc'
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', ordre: 1, principale: true },
          { url: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800', ordre: 2, principale: false }
        ],
        creePar: admin._id
      },
      {
        typeVehicule: vehicleTypes[0]._id,
        titre: 'Honda Civic 2024',
        description: 'Berline sportive et élégante avec technologie avancée.',
        prix: 16500000,
        statut: 'publie',
        miseEnAvant: true,
        nouveau: true,
        champsDynamiques: {
          marque: 'Honda',
          modele: 'Civic',
          annee: 2024,
          kilometrage: 0,
          carburant: 'Essence',
          transmission: 'Automatique',
          couleur: 'Noir'
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800', ordre: 1, principale: true }
        ],
        creePar: admin._id
      },
      {
        typeVehicule: vehicleTypes[1]._id,
        titre: 'Mercedes-Benz C-Class 2020',
        description: 'Véhicule d\'occasion en excellent état, luxueux et confortable.',
        prix: 18000000,
        prixPromo: 17000000,
        statut: 'publie',
        populaire: true,
        champsDynamiques: {
          marque: 'Mercedes-Benz',
          modele: 'C-Class',
          annee: 2020,
          kilometrage: 45000,
          carburant: 'Diesel',
          transmission: 'Automatique',
          couleur: 'Gris'
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', ordre: 1, principale: true }
        ],
        creePar: admin._id
      },
      {
        typeVehicule: vehicleTypes[1]._id,
        titre: 'BMW Serie 3 2019',
        description: 'Berline sportive allemande, performances exceptionnelles.',
        prix: 16500000,
        statut: 'publie',
        populaire: true,
        champsDynamiques: {
          marque: 'BMW',
          modele: 'Serie 3',
          annee: 2019,
          kilometrage: 52000,
          carburant: 'Essence',
          transmission: 'Automatique',
          couleur: 'Bleu'
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', ordre: 1, principale: true }
        ],
        creePar: admin._id
      },
      {
        typeVehicule: vehicleTypes[0]._id,
        titre: 'Nissan Patrol 2024',
        description: 'SUV robuste et spacieux, idéal pour les familles.',
        prix: 25000000,
        statut: 'publie',
        miseEnAvant: true,
        nouveau: true,
        champsDynamiques: {
          marque: 'Nissan',
          modele: 'Patrol',
          annee: 2024,
          kilometrage: 0,
          carburant: 'Diesel',
          transmission: 'Automatique',
          couleur: 'Blanc'
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800', ordre: 1, principale: true }
        ],
        creePar: admin._id
      },
      {
        typeVehicule: vehicleTypes[1]._id,
        titre: 'Audi A4 2018',
        description: 'Berline premium avec intérieur raffiné.',
        prix: 14000000,
        statut: 'publie',
        champsDynamiques: {
          marque: 'Audi',
          modele: 'A4',
          annee: 2018,
          kilometrage: 68000,
          carburant: 'Diesel',
          transmission: 'Automatique',
          couleur: 'Argent'
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', ordre: 1, principale: true }
        ],
        creePar: admin._id
      }
    ])

    console.log('✅ Véhicules créés:', vehicles.length)

    // Créer les pièces
    const parts = await Part.insertMany([
      {
        typePiece: partTypes[0]._id,
        titre: 'Filtre à huile Toyota',
        description: 'Filtre à huile d\'origine Toyota, compatible avec Corolla, Camry, RAV4.',
        prix: 8500,
        stock: 45,
        statut: 'publie',
        populaire: true,
        miseEnAvant: true,
        compatibilite: [
          { marque: 'Toyota', modele: 'Corolla', anneeDebut: 2015, anneeFin: 2024 },
          { marque: 'Toyota', modele: 'Camry', anneeDebut: 2015, anneeFin: 2024 }
        ],
        images: [
          { url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400', ordre: 1, principale: true }
        ],
        creePar: admin._id
      },
      {
        typePiece: partTypes[1]._id,
        titre: 'Plaquettes de frein avant',
        description: 'Plaquettes de frein haute performance pour berlines.',
        prix: 25000,
        stock: 30,
        statut: 'publie',
        populaire: true,
        compatibilite: [
          { marque: 'Honda', modele: 'Civic', anneeDebut: 2016, anneeFin: 2024 },
          { marque: 'Toyota', modele: 'Corolla', anneeDebut: 2016, anneeFin: 2024 }
        ],
        images: [
          { url: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400', ordre: 1, principale: true }
        ],
        creePar: admin._id
      },
      {
        typePiece: partTypes[2]._id,
        titre: 'Amortisseurs arrière',
        description: 'Amortisseurs de qualité supérieure pour un confort optimal.',
        prix: 85000,
        stock: 12,
        statut: 'publie',
        miseEnAvant: true,
        compatibilite: [
          { marque: 'Mercedes-Benz', modele: 'C-Class', anneeDebut: 2015, anneeFin: 2021 }
        ],
        images: [
          { url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400', ordre: 1, principale: true }
        ],
        creePar: admin._id
      },
      {
        typePiece: partTypes[3]._id,
        titre: 'Batterie 12V 70Ah',
        description: 'Batterie puissante et durable pour tous types de véhicules.',
        prix: 65000,
        stock: 20,
        statut: 'publie',
        populaire: true,
        nouveau: true,
        images: [
          { url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400', ordre: 1, principale: true }
        ],
        creePar: admin._id
      },
      {
        typePiece: partTypes[4]._id,
        titre: 'Kit d\'embrayage complet',
        description: 'Kit d\'embrayage incluant disque, plateau et butée.',
        prix: 120000,
        stock: 8,
        statut: 'publie',
        compatibilite: [
          { marque: 'Nissan', modele: 'Patrol', anneeDebut: 2010, anneeFin: 2020 }
        ],
        images: [
          { url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400', ordre: 1, principale: true }
        ],
        creePar: admin._id
      },
      {
        typePiece: partTypes[5]._id,
        titre: 'Pare-chocs avant',
        description: 'Pare-chocs avant d\'origine, finition parfaite.',
        prix: 150000,
        prixPromo: 135000,
        stock: 5,
        statut: 'publie',
        miseEnAvant: true,
        compatibilite: [
          { marque: 'BMW', modele: 'Serie 3', anneeDebut: 2015, anneeFin: 2019 }
        ],
        images: [
          { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400', ordre: 1, principale: true }
        ],
        creePar: admin._id
      },
      {
        typePiece: partTypes[0]._id,
        titre: 'Filtre à air sport',
        description: 'Filtre à air haute performance pour améliorer les performances.',
        prix: 15000,
        stock: 35,
        statut: 'publie',
        nouveau: true,
        images: [
          { url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400', ordre: 1, principale: true }
        ],
        creePar: admin._id
      },
      {
        typePiece: partTypes[1]._id,
        titre: 'Disques de frein ventilés',
        description: 'Disques de frein ventilés pour un freinage optimal.',
        prix: 45000,
        stock: 18,
        statut: 'publie',
        populaire: true,
        images: [
          { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', ordre: 1, principale: true }
        ],
        creePar: admin._id
      }
    ])

    console.log('✅ Pièces créées:', parts.length)

    res.json({
      success: true,
      message: '🎉 Base de données peuplée avec succès!',
      data: {
        admin: {
          email: admin.email,
          nom: admin.nom,
          role: admin.role
        },
        stats: {
          vehicleTypes: vehicleTypes.length,
          partTypes: partTypes.length,
          orderStatuses: orderStatuses.length,
          vehicles: vehicles.length,
          parts: parts.length
        }
      },
      credentials: {
        email: 'admin@mab.com',
        password: 'admin123'
      }
    })
  } catch (error) {
    console.error('❌ Erreur seed:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors du seed',
      error: error.message
    })
  }
})

module.exports = router
