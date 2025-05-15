import { Router } from 'express';
import { CartModel } from '../models/Cart.model.js';
import { ProductModel } from '../models/Product.model.js';

const router = Router();

// ✅ POST: Crear carrito vacío
router.post('/', async (req, res) => {
  try {
    const newCart = await CartModel.create({ products: [] });
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al crear el carrito' });
  }
});

// ✅ GET: Obtener carrito con productos populados
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await CartModel.findById(cid).populate('products.product');

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    res.json({ status: 'success', payload: cart });

  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener el carrito' });
  }
});

// ✅ POST: Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await CartModel.findById(cid);
    const product = await ProductModel.findById(pid);

    if (!cart || !product) {
      return res.status(404).json({ status: 'error', message: 'Carrito o producto no encontrado' });
    }

    const prodInCart = cart.products.find(p => p.product.equals(pid));
    if (prodInCart) {
      prodInCart.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json({ status: 'success', message: 'Producto agregado al carrito', payload: cart });

  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al agregar producto' });
  }
});

// ✅ PUT: Actualizar todo el carrito (reemplazar productos)
router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    // Validar que los productos existan
    for (const item of products) {
      const exists = await ProductModel.findById(item.product);
      if (!exists) {
        return res.status(400).json({ status: 'error', message: `Producto no válido: ${item.product}` });
      }
    }

    const cart = await CartModel.findByIdAndUpdate(cid, { products }, { new: true });
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    res.json({ status: 'success', message: 'Carrito actualizado', payload: cart });

  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al actualizar carrito' });
  }
});

// ✅ PUT: Actualizar cantidad de un producto específico
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ status: 'error', message: 'Cantidad inválida' });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const prodInCart = cart.products.find(p => p.product.equals(pid));
    if (!prodInCart) {
      return res.status(404).json({ status: 'error', message: 'Producto no está en el carrito' });
    }

    prodInCart.quantity = quantity;
    await cart.save();

    res.json({ status: 'success', message: 'Cantidad actualizada', payload: cart });

  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al actualizar cantidad' });
  }
});

// ✅ DELETE: Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = cart.products.filter(p => !p.product.equals(pid));
    await cart.save();

    res.json({ status: 'success', message: 'Producto eliminado del carrito' });

  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al eliminar producto' });
  }
});

// ✅ DELETE: Vaciar el carrito completo
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = [];
    await cart.save();

    res.json({ status: 'success', message: 'Carrito vaciado' });

  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al vaciar el carrito' });
  }
});

export default router;