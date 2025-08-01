import express from 'express'
import protect from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file?.path) {
    return res.status(400).json({ message: 'Image upload failed' })
  }
  res.json({ imageUrl: req.file.path })
})

export default router
