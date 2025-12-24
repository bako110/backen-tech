/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Gestion des véhicules
 */

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Liste des véhicules
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *           enum: [brouillon, publie, indisponible, vendu]
 *         description: Filtrer par statut
 *       - in: query
 *         name: typeVehicule
 *         schema:
 *           type: string
 *         description: ID du type de véhicule
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche par titre ou marque
 *     responses:
 *       200:
 *         description: Liste des véhicules récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 vehicles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vehicle'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 total:
 *                   type: integer
 *       401:
 *         description: Non autorisé
 */

/**
 * @swagger
 * /vehicles/{id}:
 *   get:
 *     summary: Détails d'un véhicule
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du véhicule
 *     responses:
 *       200:
 *         description: Véhicule récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 vehicle:
 *                   $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Véhicule non trouvé
 */

/**
 * @swagger
 * /vehicles:
 *   post:
 *     summary: Créer un véhicule
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *               - typeVehicule
 *               - prix
 *             properties:
 *               titre:
 *                 type: string
 *                 example: Toyota Corolla 2024
 *               typeVehicule:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               description:
 *                 type: string
 *               champsDynamiques:
 *                 type: object
 *               prix:
 *                 type: number
 *                 example: 15000000
 *               statut:
 *                 type: string
 *                 enum: [brouillon, publie, indisponible, vendu]
 *                 default: brouillon
 *     responses:
 *       201:
 *         description: Véhicule créé avec succès
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Permissions insuffisantes
 */

/**
 * @swagger
 * /vehicles/{id}:
 *   put:
 *     summary: Mettre à jour un véhicule
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       200:
 *         description: Véhicule mis à jour avec succès
 *       404:
 *         description: Véhicule non trouvé
 *   delete:
 *     summary: Supprimer un véhicule
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Véhicule supprimé avec succès
 *       404:
 *         description: Véhicule non trouvé
 */
