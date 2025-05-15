import { Router } from "express";
import { ProductModel } from "../models/Product.model.js";
import { CartModel } from "../models/Cart.model.js";

const router = Router();

router.get('/realtimeproducts', async (req, res) => {
  const products = await ProductModel.find().lean();
  res.render('realTimeProducts', {
    title: 'Productos en Tiempo Real',
    products
  });
});
// ✅ Vista productos con paginación y botones
router.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filters = {};
    if (query) {
      if (query === "true" || query === "false") {
        filters.status = query === "true";
      } else {
        filters.category = query;
      }
    }

    const sortOption = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

    const result = await ProductModel.paginate(filters, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOption,
      lean: true,
    });

    res.render("products", {
      title: "Productos",
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      currentPage: result.page,
      totalPages: result.totalPages,
      query,
      sort,
      limit,
    });
  } catch (error) {
    console.error("❌ Error en /products (vista):", error.message);
    res.status(500).send("Error al cargar productos");
  }
});

// ✅ Vista de carrito con populate
router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartModel.findById(cid).populate("products.product").lean();

    if (!cart) return res.status(404).send("Carrito no encontrado");

    res.render("cart", {
      title: `Carrito #${cid}`,
      cart,
    });
  } catch (error) {
    console.error("❌ Error en /carts/:cid (vista):", error.message);
    res.status(500).send("Error al cargar carrito");
  }
});

export default router;