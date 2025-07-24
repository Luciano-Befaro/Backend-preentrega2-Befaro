import { Router } from 'express'
import { purchaseCart } from '../controllers/purchase.controller.js'
import { authenticateToken } from '../middleware/auth.middleware.js'
import { authorizeRole } from '../middleware/role.middleware.js'

const router = Router()

router.post('/', authenticateToken, authorizeRole('user'), purchaseCart)

export default router