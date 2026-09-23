import { Router } from "express";
import { asyncHandler, validateBody } from "../middleware/error";
import { requireAuth } from "../middleware/auth";
import { notFound } from "../lib/errors";
import {
  addCartItem,
  clearCart,
  getCart,
  getCartInfo,
  removeCartItem,
  setCartItemQuantity,
} from "../services/cartService";
import {
  addCartItemSchema,
  updateCartItemSchema,
} from "../validators/schemas";

function parseProductId(raw: string) {
  const productId = Number(raw);
  if (!Number.isInteger(productId)) {
    throw notFound("Cart item not found");
  }
  return productId;
}

export const cartRouter = Router();

cartRouter.use(requireAuth);

cartRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const cart = await getCart(req.user!.id);
    res.json(cart);
  }),
);

cartRouter.get(
  "/info",
  asyncHandler(async (req, res) => {
    const info = await getCartInfo(req.user!.id);
    res.json(info);
  }),
);

cartRouter.post(
  "/items",
  validateBody(addCartItemSchema),
  asyncHandler(async (req, res) => {
    const cart = await addCartItem(req.user!.id, req.body);
    res.status(201).json(cart);
  }),
);

cartRouter.patch(
  "/items/:productId",
  validateBody(updateCartItemSchema),
  asyncHandler(async (req, res) => {
    const cart = await setCartItemQuantity(
      req.user!.id,
      parseProductId(req.params.productId),
      req.body.quantity,
    );
    res.json(cart);
  }),
);

cartRouter.delete(
  "/items/:productId",
  asyncHandler(async (req, res) => {
    const cart = await removeCartItem(
      req.user!.id,
      parseProductId(req.params.productId),
    );
    res.json(cart);
  }),
);

cartRouter.delete(
  "/",
  asyncHandler(async (req, res) => {
    await clearCart(req.user!.id);
    res.status(204).send();
  }),
);
