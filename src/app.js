import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'
import purchaseRoutes from './routes/purchase.routes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/purchase', purchaseRoutes)

export default app