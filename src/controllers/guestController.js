import Guest from '../models/Guest.js'

export const addGuest = async (req, res) => {
  const { name, email, rsvpStatus, mealChoice, message } = req.body
  const eventId = req.params.eventId

  const guest = await Guest.create({
    name,
    email,
    rsvpStatus,
    mealChoice,
    message,
    event: eventId,
  })

  res.status(201).json(guest)
}

export const getGuests = async (req, res) => {
  const eventId = req.params.eventId
  const guests = await Guest.find({ event: eventId })
  res.json(guests)
}

export const updateGuest = async (req, res) => {
  const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
  if (!guest) return res.status(404).json({ message: 'Guest not found' })
  res.json(guest)
}

export const deleteGuest = async (req, res) => {
  const guest = await Guest.findByIdAndDelete(req.params.id)
  if (!guest) return res.status(404).json({ message: 'Guest not found' })
  res.json({ message: 'Guest deleted' })
}
