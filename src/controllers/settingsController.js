import Settings from '../models/Settings.js'

export const getSettings = async (req, res) => {
  const settings = await Settings.find({})
  res.json(settings)
}

export const getSettingByKey = async (req, res) => {
  const setting = await Settings.findOne({ key: req.params.key })
  if (setting) {
    res.json(setting)
  } else {
    res.status(404)
    throw new Error('Setting not found')
  }
}

export const getSettingById = async (req, res) => {
  const setting = await Settings.findById(req.params.id)
  if (setting) {
    res.json(setting)
  } else {
    res.status(404)
    throw new Error('Setting not found')
  }
}

export const upsertSetting = async (req, res) => {
  const { key, value } = req.body

  let setting = await Settings.findOne({ key })

  if (setting) {
    setting.value = value
    await setting.save()
    res.json({ message: `Setting '${key}' updated`, setting })
  } else {
    const newSetting = await Settings.create({ key, value })
    res.status(201).json({ message: `Setting '${key}' created`, setting: newSetting })
  }
}
