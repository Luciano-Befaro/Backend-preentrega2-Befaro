import { Router } from 'express';
import { ProductModel } from '../models/Product.model.js';

const router = Router();

// GET /api/products?limit=5&page=2&sort=asc&query=categoria
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filters = {};

    // Filtrar por categoría o disponibilidad
    if (query) {
      if (query === "true" || query === "false") {
        filters.status = query === "true";
      } else {
        filters.category = query;
      }
    }

    // Ordenamiento por precio asc/desc
    const sortOptions = sort === 'asc'
      ? { price: 1 }
      : sort === 'desc'
        ? { price: -1 }
        : {};

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOptions,
      lean: true
    };

    const result = await ProductModel.paginate(filters, options);

    const { docs, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage } = result;

    const generateLink = (p) =>
      `/api/products?limit=${limit}&page=${p}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`;

    res.json({
      status: 'success',
      payload: docs,
      totalPages,
      page: result.page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      prevLink: hasPrevPage ? generateLink(prevPage) : null,
      nextLink: hasNextPage ? generateLink(nextPage) : null,
    });

  } catch (error) {
    console.error("❌ Error en GET /products:", error.message);
    res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
  }
});

export default router;