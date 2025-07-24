import { Router } from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js'
import { authenticateToken } from '../middleware/auth.middleware.js'
import { authorizeRole } from '../middleware/role.middleware.js'

const router = Router()

// ✅ Obtener todos los productos (público)
router.get('/', getProducts)

// ✅ Obtener un producto por ID (público)
router.get('/:id', getProductById)

// ✅ Crear producto (solo admin)
router.post('/', authenticateToken, authorizeRole('admin'), createProduct)

// ✅ Actualizar producto (solo admin)
router.put('/:id', authenticateToken, authorizeRole('admin'), updateProduct)

// ✅ Eliminar producto (solo admin)
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteProduct)

export default router