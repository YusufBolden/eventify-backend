import express from 'express'
import {
  getSettings,
  getSettingByKey,
  getSettingById,
  upsertSetting,
} from '../controllers/settingsController.js'
import protect from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'

const router = express.Router()

router.route('/')
  .get(protect, adminMiddleware, getSettings)
  .post(protect, adminMiddleware, upsertSetting)

router.get('/id/:id', protect, adminMiddleware, getSettingById)
router.get('/:key', protect, adminMiddleware, getSettingByKey)

export default router
