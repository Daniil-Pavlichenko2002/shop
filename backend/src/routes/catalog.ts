import { Router } from "express";
import { asyncHandler, validateBody } from "../middleware/error";
import { optionalAuth, requireAuth, requireRole } from "../middleware/auth";
import {
  createCategory,
  createProduct,
  deleteProduct,
  getProductById,
  listCategories,
  listProducts,
  updateProduct,
} from "../services/catalogService";
import {
  createCategorySchema,
  createProductSchema,
  updateProductSchema,
} from "../validators/schemas";
import { notFound } from "../lib/errors";

export const categoriesRouter = Router();
export const productsRouter = Router();

categoriesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const categories = await listCategories();
    res.json(categories);
  }),
);

categoriesRouter.post(
  "/",
  requireAuth,
  requireRole("MANAGER"),
  validateBody(createCategorySchema),
  asyncHandler(async (req, res) => {
    const category = await createCategory(req.body);
    res.status(201).json(category);
  }),
);

productsRouter.get(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const isManager = req.user?.role === "MANAGER";
    const query = {
      q: typeof req.query.q === "string" ? req.query.q : undefined,
      categoryId: req.query.categoryId
        ? Number(req.query.categoryId)
        : undefined,
      price_gte: req.query.price_gte ? Number(req.query.price_gte) : undefined,
      price_lte: req.query.price_lte ? Number(req.query.price_lte) : undefined,
      isPublished:
        req.query.isPublished === undefined
          ? undefined
          : req.query.isPublished === "true",
      _sort: (req.query._sort as "price" | "createdAt" | "title" | "id") || undefined,
      _order: (req.query._order as "asc" | "desc") || undefined,
      _page: req.query._page ? Number(req.query._page) : undefined,
      _limit: req.query._limit ? Number(req.query._limit) : undefined,
      forcePublishedOnly: !isManager,
    };

    const result = await listProducts(query);
    res.setHeader("X-Total-Count", String(result.total));
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
    res.json(result.items);
  }),
);

productsRouter.get(
  "/:id",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      throw notFound("Product not found");
    }
    const product = await getProductById(
      id,
      req.user?.role === "MANAGER",
    );
    res.json(product);
  }),
);

productsRouter.post(
  "/",
  requireAuth,
  requireRole("MANAGER"),
  validateBody(createProductSchema),
  asyncHandler(async (req, res) => {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  }),
);

productsRouter.patch(
  "/:id",
  requireAuth,
  requireRole("MANAGER"),
  validateBody(updateProductSchema),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      throw notFound("Product not found");
    }
    const product = await updateProduct(id, req.body);
    res.json(product);
  }),
);

productsRouter.delete(
  "/:id",
  requireAuth,
  requireRole("MANAGER"),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      throw notFound("Product not found");
    }
    await deleteProduct(id);
    res.status(204).send();
  }),
);
