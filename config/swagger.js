const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MAB API Documentation',
      version: '1.0.0',
      description: 'API pour la plateforme MAB - Gestion de véhicules et pièces détachées',
      contact: {
        name: 'MAB Support',
        email: 'contact@mab.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Serveur de développement',
      },
      {
        url: 'https://api.mab.com/api',
        description: 'Serveur de production',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Message d\'erreur',
            },
          },
        },
        Admin: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            nom: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              example: 'admin@mab.com',
            },
            role: {
              type: 'string',
              enum: ['super_admin', 'admin', 'agent', 'vendeur'],
              example: 'admin',
            },
            actif: {
              type: 'boolean',
              example: true,
            },
            telephone: {
              type: 'string',
              example: '+221 77 123 45 67',
            },
            dateCreation: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Vehicle: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            titre: {
              type: 'string',
              example: 'Toyota Corolla 2024',
            },
            typeVehicule: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            description: {
              type: 'string',
            },
            champsDynamiques: {
              type: 'object',
              properties: {
                marque: { type: 'string', example: 'Toyota' },
                modele: { type: 'string', example: 'Corolla' },
                annee: { type: 'number', example: 2024 },
                kilometrage: { type: 'number', example: 0 },
                carburant: { type: 'string', example: 'Hybride' },
                boite: { type: 'string', example: 'Automatique' },
                couleur: { type: 'string', example: 'Blanc' },
              },
            },
            prix: {
              type: 'number',
              example: 15000000,
            },
            statut: {
              type: 'string',
              enum: ['brouillon', 'publie', 'indisponible', 'vendu'],
              example: 'publie',
            },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: { type: 'string' },
                  ordre: { type: 'number' },
                  principale: { type: 'boolean' },
                },
              },
            },
          },
        },
        Part: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            titre: {
              type: 'string',
              example: 'Plaquettes de frein avant',
            },
            typePiece: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            champsDynamiques: {
              type: 'object',
              properties: {
                reference: { type: 'string', example: 'REF-FR-001' },
                marque: { type: 'string', example: 'Bosch' },
                etat: { type: 'string', example: 'Neuf' },
              },
            },
            prix: {
              type: 'number',
              example: 45000,
            },
            stock: {
              type: 'number',
              example: 25,
            },
            statut: {
              type: 'string',
              enum: ['brouillon', 'publie', 'indisponible', 'rupture'],
              example: 'publie',
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            numeroCommande: {
              type: 'string',
              example: 'CMD-2024-0001',
            },
            client: {
              type: 'object',
              properties: {
                nom: { type: 'string', example: 'Diallo' },
                prenom: { type: 'string', example: 'Mohamed' },
                telephone: { type: 'string', example: '+221 77 123 45 67' },
                email: { type: 'string', example: 'client@email.com' },
              },
            },
            produits: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['vehicule', 'piece'] },
                  produitId: { type: 'string' },
                  titre: { type: 'string' },
                  prix: { type: 'number' },
                  quantite: { type: 'number' },
                },
              },
            },
            total: {
              type: 'number',
              example: 15000000,
            },
            statut: {
              type: 'string',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.swagger.js'],
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = swaggerSpec
