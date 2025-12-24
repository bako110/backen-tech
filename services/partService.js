const Part = require('../models/Part')

class PartService {
  async getParts(filters = {}) {
    const { page = 1, limit = 20, statut, typePiece, search } = filters

    const query = {}

    if (statut) query.statut = statut
    if (typePiece) query.typePiece = typePiece
    if (search) {
      query.$or = [
        { titre: { $regex: search, $options: 'i' } },
        { 'champsDynamiques.reference': { $regex: search, $options: 'i' } }
      ]
    }

    const parts = await Part.find(query)
      .populate('typePiece')
      .sort({ dateCreation: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const count = await Part.countDocuments(query)

    return {
      parts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    }
  }

  async getPartById(id) {
    const part = await Part.findById(id).populate('typePiece')

    if (!part) {
      throw new Error('Pièce non trouvée')
    }

    part.vues += 1
    await part.save()

    return part
  }

  async createPart(data, adminId) {
    data.creePar = adminId
    const part = await Part.create(data)
    return part
  }

  async updatePart(id, data, adminId) {
    data.modifiePar = adminId

    const part = await Part.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    )

    if (!part) {
      throw new Error('Pièce non trouvée')
    }

    return part
  }

  async deletePart(id) {
    const part = await Part.findByIdAndDelete(id)

    if (!part) {
      throw new Error('Pièce non trouvée')
    }

    return part
  }
}

module.exports = new PartService()
