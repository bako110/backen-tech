const Setting = require('../models/Setting')

class SettingService {
  async getSettings() {
    let settings = await Setting.findOne()

    if (!settings) {
      settings = await Setting.create({})
    }

    return settings
  }

  async updateSettings(data, adminId) {
    data.modifiePar = adminId

    let settings = await Setting.findOne()

    if (!settings) {
      settings = await Setting.create(data)
    } else {
      settings = await Setting.findByIdAndUpdate(
        settings._id,
        data,
        { new: true, runValidators: true }
      )
    }

    return settings
  }
}

module.exports = new SettingService()
