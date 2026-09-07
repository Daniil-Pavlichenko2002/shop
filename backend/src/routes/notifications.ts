import { Router } from "express";
import { asyncHandler, validateBody } from "../middleware/error";
import { requireAuth } from "../middleware/auth";
import {
  createNotification,
  listNotifications,
  markNotificationRead,
} from "../services/notificationService";
import {
  createNotificationSchema,
  updateNotificationSchema,
} from "../validators/schemas";
import { notFound } from "../lib/errors";

export const notificationsRouter = Router();

notificationsRouter.use(requireAuth);

notificationsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    const sort =
      req.query._sort === "createdAt" ? ("createdAt" as const) : undefined;
    const order =
      req.query._order === "asc" || req.query._order === "desc"
        ? req.query._order
        : undefined;

    const notifications = await listNotifications({
      requesterId: req.user!.id,
      requesterRole: req.user!.role,
      userId,
      sort,
      order,
    });
    res.json(notifications);
  }),
);

notificationsRouter.post(
  "/",
  validateBody(createNotificationSchema),
  asyncHandler(async (req, res) => {
    if (req.user!.role === "USER" && req.body.userId !== req.user!.id) {
      req.body.userId = req.user!.id;
    }
    const notification = await createNotification(req.body);
    res.status(201).json(notification);
  }),
);

notificationsRouter.patch(
  "/:id",
  validateBody(updateNotificationSchema),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      throw notFound("Notification not found");
    }
    const notification = await markNotificationRead({
      id,
      requesterId: req.user!.id,
      requesterRole: req.user!.role,
      isRead: req.body.isRead,
    });
    res.json(notification);
  }),
);
