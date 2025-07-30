import express from 'express'
import {
  addGuest,
  getGuests,
  updateGuest,
  deleteGuest,
} from '../controllers/guestController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// All routes protected
router
  .route('/:eventId')
  .post(protect, addGuest)
  .get(protect, getGuests)

router
  .route('/single/:id')
  .put(protect, updateGuest)
  .delete(protect, deleteGuest)

export default router
