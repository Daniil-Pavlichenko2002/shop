import { Router } from "express";
import { asyncHandler, validateBody } from "../middleware/error";
import { requireAuth } from "../middleware/auth";
import {
  createOrder,
  getOrderById,
  listOrders,
  updateOrderStatus,
} from "../services/orderService";
import { createOrderSchema, updateOrderSchema } from "../validators/schemas";
import { notFound } from "../lib/errors";

export const ordersRouter = Router();

ordersRouter.use(requireAuth);

ordersRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    const orders = await listOrders({
      requesterId: req.user!.id,
      requesterRole: req.user!.role,
      userId,
    });
    res.json(orders);
  }),
);

ordersRouter.post(
  "/",
  validateBody(createOrderSchema),
  asyncHandler(async (req, res) => {
    const order = await createOrder(req.user!.id, req.body.items);
    res.status(201).json(order);
  }),
);

ordersRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      throw notFound("Order not found");
    }
    const order = await getOrderById(id, req.user!.id, req.user!.role);
    res.json(order);
  }),
);

ordersRouter.patch(
  "/:id",
  validateBody(updateOrderSchema),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      throw notFound("Order not found");
    }
    const order = await updateOrderStatus({
      orderId: id,
      nextStatus: req.body.status,
      requesterId: req.user!.id,
      requesterRole: req.user!.role,
    });
    res.json(order);
  }),
);
