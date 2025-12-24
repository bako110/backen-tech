const PartType = require('../models/PartType')
const Part = require('../models/Part')

class PartTypeService {
  async getPartTypes(filters = {}) {
    const { actif } = filters

    const query = {}
    if (actif !== undefined) query.actif = actif === 'true'

    const partTypes = await PartType.find(query).sort({ ordre: 1 })
    return partTypes
  }

  async getPartTypeById(id) {
    const partType = await PartType.findById(id)

    if (!partType) {
      throw new Error('Type de pièce non trouvé')
    }

    const nombrePieces = await Part.countDocuments({ typePiece: partType._id })
    partType.nombrePieces = nombrePieces
    await partType.save()

    return partType
  }

  async createPartType(data, adminId) {
    data.creePar = adminId

    if (!data.code) {
      data.code = data.nom
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/(^_|_$)/g, '')
    }

    const partType = await PartType.create(data)
    return partType
  }

  async updatePartType(id, data) {
    const partType = await PartType.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    )

    if (!partType) {
      throw new Error('Type de pièce non trouvé')
    }

    return partType
  }

  async deletePartType(id) {
    const partType = await PartType.findById(id)

    if (!partType) {
      throw new Error('Type de pièce non trouvé')
    }

    const nombrePieces = await Part.countDocuments({ typePiece: partType._id })

    if (nombrePieces > 0) {
      throw new Error(`Impossible de supprimer ce type. ${nombrePieces} pièce(s) y sont associées.`)
    }

    await partType.deleteOne()
    return partType
  }

  async reorderPartType(id, ordre) {
    const partType = await PartType.findByIdAndUpdate(
      id,
      { ordre },
      { new: true }
    )

    if (!partType) {
      throw new Error('Type de pièce non trouvé')
    }

    return partType
  }
}

module.exports = new PartTypeService()
