import { CartModel } from '../models/cart.model.js'

export const getCart = async (req, res) => {
  const cart = await CartModel.findOne({ userId: req.user.id }).populate('products.product')
  if (!cart) return res.status(404).json({ error: 'Carrito vacío' })
  res.json(cart)
}

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body
  let cart = await CartModel.findOne({ userId: req.user.id })

  if (!cart) {
    cart = await CartModel.create({ userId: req.user.id, products: [] })
  }

  const existing = cart.products.find(p => p.product.toString() === productId)
  if (existing) {
    existing.quantity += quantity
  } else {
    cart.products.push({ product: productId, quantity })
  }

  await cart.save()
  res.json(cart)
}