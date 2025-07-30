import Event from '../models/Event.js'

export const createEvent = async (req, res) => {
  const { title, description, date, location } = req.body

  const event = await Event.create({
    title,
    description,
    date,
    location,
    owner: req.user._id,
  })

  res.status(201).json(event)
}

export const getEvents = async (req, res) => {
  let events

  if (req.user.isAdmin) {
    events = await Event.find({})
  } else {
    events = await Event.find({ owner: req.user._id })
  }

  res.json(events)
}

export const getEventById = async (req, res) => {
  const event = await Event.findOne({
    _id: req.params.id,
    owner: req.user._id,
  })

  if (!event) return res.status(404).json({ message: 'Event not found' })

  res.json(event)
}

export const updateEvent = async (req, res) => {
  const event = await Event.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    req.body,
    { new: true }
  )

  if (!event) return res.status(404).json({ message: 'Event not found' })

  res.json(event)
}

export const deleteEvent = async (req, res) => {
  const event = await Event.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  })

  if (!event) return res.status(404).json({ message: 'Event not found' })

  res.json({ message: 'Event deleted' })
}
