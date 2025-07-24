import { Router } from 'express'
import {
  register, login, current,
  requestResetPassword, resetPassword
} from '../controllers/auth.controller.js'
import { authenticateToken } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/current', authenticateToken, current)
router.post('/forgot-password', requestResetPassword)
router.post('/reset-password', resetPassword)

export default router