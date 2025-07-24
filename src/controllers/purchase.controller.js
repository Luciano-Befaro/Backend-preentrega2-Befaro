import { CartModel } from '../models/cart.model.js'
import { ProductRepository } from '../repository/product.repository.js'
import { TicketModel } from '../models/ticket.model.js'
import { v4 as uuidv4 } from 'uuid'

const productRepo = new ProductRepository()

export const purchaseCart = async (req, res) => {
  const userId = req.user.id
  const cart = await CartModel.findOne({ userId }).populate('products.product')
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' })

  let total = 0
  const purchased = []

  for (const item of cart.products) {
    if (item.product.stock >= item.quantity) {
      await productRepo.updateStock(item.product._id, item.quantity)
      total += item.product.price * item.quantity
      purchased.push(item)
    }
  }

  cart.products = cart.products.filter(p => !purchased.includes(p))
  await cart.save()

  const ticket = await TicketModel.create({
    code: uuidv4(),
    purchaser: req.user.email,
    amount: total
  })

  res.json({ ticket, unprocessed: cart.products })
}