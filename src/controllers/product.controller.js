import { ProductRepository } from '../repository/product.repository.js'

const repo = new ProductRepository()

export const getProducts = async (req, res) => {
  const products = await repo.getAll()
  res.json(products)
}

export const getProductById = async (req, res) => {
  const product = await repo.getById(req.params.id)
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' })
  res.json(product)
}

export const createProduct = async (req, res) => {
  const product = await repo.create(req.body)
  res.status(201).json(product)
}

export const updateProduct = async (req, res) => {
  const product = await repo.update(req.params.id, req.body)
  if (!product) return res.status(404).json({ error: 'No encontrado' })
  res.json(product)
}

export const deleteProduct = async (req, res) => {
  const deleted = await repo.delete(req.params.id)
  if (!deleted) return res.status(404).json({ error: 'No encontrado' })
  res.json({ message: 'Producto eliminado' })
}