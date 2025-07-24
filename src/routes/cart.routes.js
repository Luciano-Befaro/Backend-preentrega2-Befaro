import { Router } from 'express'
import { getCart, addToCart } from '../controllers/cart.controller.js'
import { authenticateToken } from '../middleware/auth.middleware.js'
import { authorizeRole } from '../middleware/role.middleware.js'

const router = Router()

// Obtener carrito del usuario autenticado
router.get('/', authenticateToken, getCart)

// Agregar producto al carrito (solo usuario)
router.post('/', authenticateToken, authorizeRole('user'), addToCart)

export default router
