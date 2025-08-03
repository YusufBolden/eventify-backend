import Event from '../models/Event.js'

export const createEvent = async (req, res) => {
  const { title, description, date, location } = req.body

  try {
    const newEvent = await Event.create({
      title,
      description,
      date,
      location,
      owner: req.user._id,
    })

    res.status(201).json(newEvent)
  } catch (error) {
    console.error("Create Event Error:", error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getEvents = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      console.log("getEvents Debug → Admin fetching ALL events")
      const allEvents = await Event.find({})
      return res.json(allEvents)
    }

    console.log("getEvents Debug → User fetching OWN events")
    const myEvents = await Event.find({ owner: req.user._id })
    return res.json(myEvents)
  } catch (error) {
    console.error("Get Events Error:", error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getMyEvents = async (req, res) => {
  try {
    const myEvents = await Event.find({ owner: req.user._id }).sort({ date: 1 })
    return res.json(myEvents)
  } catch (error) {
    console.error("Get My Events Error:", error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getEventById = async (req, res) => {
  console.log("getEventById Debug → User:", req.user?.email, "| isAdmin:", req.user?.isAdmin)
  console.log("getEventById Debug → Params ID:", req.params.id)

  try {
    if (req.user.isAdmin) {
      console.log("getEventById Debug → Admin fetching ANY event")
      const anyEvent = await Event.findById(req.params.id)
      console.log("getEventById Debug → Mongo _id match check:", req.params.id === anyEvent?._id.toString())
      console.log("getEventById Debug → Found event:", anyEvent)

      if (!anyEvent) {
        console.log("getEventById Debug → Event not found for admin")
        return res.status(404).json({ message: 'Event not found' })
      }
      return res.json(anyEvent)
    }

    console.log("getEventById Debug → User fetching OWN event")
    const myEvent = await Event.findOne({
      _id: req.params.id,
      owner: req.user._id,
    })
    console.log("getEventById Debug → Found event for user:", myEvent)

    if (!myEvent) {
      console.log("getEventById Debug → Event not found for user")
      return res.status(404).json({ message: 'Event not found' })
    }
    return res.json(myEvent)
  } catch (error) {
    console.error("Get Event By ID Error:", error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateEvent = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      console.log("updateEvent Debug → Admin updating event")
      const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found' })
      }
      return res.json(updatedEvent)
    }

    console.log("updateEvent Debug → User updating OWN event")
    const updatedMyEvent = await Event.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    )
    if (!updatedMyEvent) {
      return res.status(404).json({ message: 'Event not found' })
    }
    return res.json(updatedMyEvent)
  } catch (error) {
    console.error("Update Event Error:", error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const deleteEvent = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      console.log("deleteEvent Debug → Admin deleting event")
      const deletedEvent = await Event.findByIdAndDelete(req.params.id)
      if (!deletedEvent) {
        return res.status(404).json({ message: 'Event not found' })
      }
      return res.json({ message: 'Event deleted' })
    }

    console.log("deleteEvent Debug → User deleting OWN event")
    const deletedMyEvent = await Event.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    })
    if (!deletedMyEvent) {
      return res.status(404).json({ message: 'Event not found' })
    }
    return res.json({ message: 'Event deleted' })
  } catch (error) {
    console.error("Delete Event Error:", error)
    res.status(500).json({ message: 'Server error' })
  }
}
