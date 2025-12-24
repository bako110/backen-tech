const Vehicle = require('../models/Vehicle')

class VehicleService {
  async getVehicles(filters = {}) {
    const { page = 1, limit = 20, statut, typeVehicule, search } = filters

    const query = {}

    if (statut) query.statut = statut
    if (typeVehicule) query.typeVehicule = typeVehicule
    if (search) {
      query.$or = [
        { titre: { $regex: search, $options: 'i' } },
        { 'champsDynamiques.marque': { $regex: search, $options: 'i' } }
      ]
    }

    const vehicles = await Vehicle.find(query)
      .populate('typeVehicule')
      .sort({ dateCreation: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const count = await Vehicle.countDocuments(query)

    return {
      vehicles,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    }
  }

  async getVehicleById(id) {
    const vehicle = await Vehicle.findById(id).populate('typeVehicule')

    if (!vehicle) {
      throw new Error('Véhicule non trouvé')
    }

    vehicle.vues += 1
    await vehicle.save()

    return vehicle
  }

  async createVehicle(data, adminId) {
    data.creePar = adminId
    const vehicle = await Vehicle.create(data)
    return vehicle
  }

  async updateVehicle(id, data, adminId) {
    data.modifiePar = adminId

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    )

    if (!vehicle) {
      throw new Error('Véhicule non trouvé')
    }

    return vehicle
  }

  async deleteVehicle(id) {
    const vehicle = await Vehicle.findByIdAndDelete(id)

    if (!vehicle) {
      throw new Error('Véhicule non trouvé')
    }

    return vehicle
  }
}

module.exports = new VehicleService()
