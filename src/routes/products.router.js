import { Router } from "express";
import { ProductModel } from "../models/Product.model.js";

const router = Router();

// GET 
router.get("/", async (req, res) => {
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

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Error al obtener productos" });
  }
});

// POST 
router.post("/", async (req, res) => {
  try {
    const product = await ProductModel.create(req.body);
    res.status(201).json({ status: "success", payload: product });
  } catch (err) {
    res.status(400).json({ status: "error", message: "Error al crear producto" });
  }
});

// PUT 
router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const update = req.body;

    // Prohibir cambiar el ID
    if (update._id) delete update._id;

    const updated = await ProductModel.findByIdAndUpdate(pid, update, { new: true });

    if (!updated) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }

    res.json({ status: "success", payload: updated });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Error al actualizar producto" });
  }
});

// DELETE 
router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const result = await ProductModel.findByIdAndDelete(pid);

    if (!result) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }

    res.json({ status: "success", message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Error al eliminar producto" });
  }
});

export default router;