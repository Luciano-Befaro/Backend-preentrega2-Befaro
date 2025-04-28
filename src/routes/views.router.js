import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get('/home', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { title: "Home | Productos", products });
});

router.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { title: "Productos en Tiempo Real", products });
});

export default router;