const Admin = require('../models/Admin')

class AdminService {
  async getAdmins(filters = {}) {
    const { page = 1, limit = 20, role, actif } = filters

    const query = {}
    if (role) query.role = role
    if (actif !== undefined) query.actif = actif === 'true'

    const admins = await Admin.find(query)
      .select('-motDePasse')
      .sort({ dateCreation: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const count = await Admin.countDocuments(query)

    return {
      admins,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    }
  }

  async getAdminById(id) {
    const admin = await Admin.findById(id).select('-motDePasse')

    if (!admin) {
      throw new Error('Administrateur non trouvé')
    }

    return admin
  }

  async createAdmin(data, creatorId) {
    data.creePar = creatorId

    const admin = await Admin.create(data)

    const adminData = admin.toObject()
    delete adminData.motDePasse

    return adminData
  }

  async updateAdmin(id, data) {
    if (data.motDePasse) {
      delete data.motDePasse
    }

    const admin = await Admin.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    ).select('-motDePasse')

    if (!admin) {
      throw new Error('Administrateur non trouvé')
    }

    return admin
  }

  async deleteAdmin(id, currentAdminId) {
    if (id === currentAdminId) {
      throw new Error('Vous ne pouvez pas supprimer votre propre compte')
    }

    const admin = await Admin.findByIdAndDelete(id)

    if (!admin) {
      throw new Error('Administrateur non trouvé')
    }

    return admin
  }

  async toggleAdminStatus(id) {
    const admin = await Admin.findById(id)

    if (!admin) {
      throw new Error('Administrateur non trouvé')
    }

    admin.actif = !admin.actif
    await admin.save()

    return admin
  }
}

module.exports = new AdminService()
