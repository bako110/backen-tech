/**
 * @swagger
 * tags:
 *   name: Mobile
 *   description: API pour l'application mobile (publique)
 */

/**
 * @swagger
 * /mobile/config:
 *   get:
 *     summary: Configuration de l'application mobile
 *     tags: [Mobile]
 *     security: []
 *     responses:
 *       200:
 *         description: Configuration récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 config:
 *                   type: object
 *                   properties:
 *                     nomApplication:
 *                       type: string
 *                       example: MAB
 *                     logo:
 *                       type: string
 *                     theme:
 *                       type: object
 *                     devise:
 *                       type: object
 *                     langues:
 *                       type: array
 *                     contact:
 *                       type: object
 */

/**
 * @swagger
 * /mobile/home:
 *   get:
 *     summary: Contenu de l'accueil mobile
 *     tags: [Mobile]
 *     security: []
 *     responses:
 *       200:
 *         description: Accueil récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 home:
 *                   type: object
 *                   properties:
 *                     vehiculesNeufs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Vehicle'
 *                     vehiculesOccasion:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Vehicle'
 *                     piecesPopulaires:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Part'
 */

/**
 * @swagger
 * /mobile/vehicles:
 *   get:
 *     summary: Liste des véhicules publiés (mobile)
 *     tags: [Mobile]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: typeVehicule
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrix
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrix
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Liste des véhicules
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 vehicles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vehicle'
 */

/**
 * @swagger
 * /mobile/vehicles/{id}:
 *   get:
 *     summary: Détails d'un véhicule (mobile)
 *     tags: [Mobile]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Véhicule récupéré
 *       404:
 *         description: Véhicule non trouvé
 */

/**
 * @swagger
 * /mobile/parts:
 *   get:
 *     summary: Liste des pièces publiées (mobile)
 *     tags: [Mobile]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: typePiece
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des pièces
 */

/**
 * @swagger
 * /mobile/part-types:
 *   get:
 *     summary: Liste des types de pièces actifs
 *     tags: [Mobile]
 *     security: []
 *     responses:
 *       200:
 *         description: Types de pièces récupérés
 */

/**
 * @swagger
 * /mobile/orders:
 *   post:
 *     summary: Créer une commande depuis le mobile
 *     tags: [Mobile]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - client
 *               - produits
 *               - total
 *             properties:
 *               client:
 *                 type: object
 *                 required:
 *                   - nom
 *                   - prenom
 *                   - telephone
 *                 properties:
 *                   nom:
 *                     type: string
 *                   prenom:
 *                     type: string
 *                   telephone:
 *                     type: string
 *                   email:
 *                     type: string
 *               produits:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [vehicule, piece]
 *                     produitId:
 *                       type: string
 *                     quantite:
 *                       type: number
 *               total:
 *                 type: number
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *       500:
 *         description: Erreur serveur
 */
