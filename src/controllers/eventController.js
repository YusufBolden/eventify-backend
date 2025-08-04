import mongoose from 'mongoose';
import Event from '../models/Event.js';

export const createEvent = async (req, res) => {
  const { title, description, date, location } = req.body;

  try {
    const newEvent = await Event.create({
      title,
      description,
      date,
      location,
      owner: req.user._id,
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEvents = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const { userId } = req.query;
      let query = {};

      if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: 'Invalid userId format' });
        }
        query.owner = new mongoose.Types.ObjectId(userId);
        console.log(`getEvents Debug → Filtering events for userId: ${userId}`);
      }

      const events = await Event.find(query);
      return res.json(events);
    }

    const myEvents = await Event.find({ owner: req.user._id });
    return res.json(myEvents);
  } catch (error) {
    console.error("Get Events Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const myEvents = await Event.find({ owner: req.user._id }).sort({ date: 1 });
    return res.json(myEvents);
  } catch (error) {
    console.error("Get My Events Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEventById = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      return res.json(event);
    }

    const myEvent = await Event.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!myEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.json(myEvent);
  } catch (error) {
    console.error("Get Event By ID Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      return res.json(updatedEvent);
    }

    const updatedMyEvent = await Event.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!updatedMyEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.json(updatedMyEvent);
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const deletedEvent = await Event.findByIdAndDelete(req.params.id);
      if (!deletedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      return res.json({ message: 'Event deleted' });
    }

    const deletedMyEvent = await Event.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!deletedMyEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error("Delete Event Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
