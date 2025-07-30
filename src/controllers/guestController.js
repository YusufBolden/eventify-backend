import Guest from '../models/Guest.js'

// Add guest to event
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

// Get all guests for an event
export const getGuests = async (req, res) => {
  const eventId = req.params.eventId
  const guests = await Guest.find({ event: eventId })
  res.json(guests)
}

// Update a guest
export const updateGuest = async (req, res) => {
  const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
  if (!guest) return res.status(404).json({ message: 'Guest not found' })
  res.json(guest)
}

// Delete a guest
export const deleteGuest = async (req, res) => {
  const guest = await Guest.findByIdAndDelete(req.params.id)
  if (!guest) return res.status(404).json({ message: 'Guest not found' })
  res.json({ message: 'Guest deleted' })
}
