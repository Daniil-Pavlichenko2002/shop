import { Router } from "express";
import { asyncHandler, validateBody } from "../middleware/error";
import { requireAuth } from "../middleware/auth";
import { forbidden, notFound } from "../lib/errors";
import { getUserById, updateUserProfile } from "../services/authService";
import { updateUserSchema } from "../validators/schemas";
import { prisma } from "../lib/prisma";

export const usersRouter = Router();

usersRouter.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      throw notFound("User not found");
    }

    if (req.user!.role === "USER" && req.user!.id !== id) {
      throw forbidden("Cannot view another user's profile");
    }

    const user = await getUserById(id);
    res.json(user);
  }),
);

usersRouter.patch(
  "/:id",
  requireAuth,
  validateBody(updateUserSchema),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      throw notFound("User not found");
    }

    if (req.user!.role === "USER" && req.user!.id !== id) {
      throw forbidden("Cannot update another user's profile");
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw notFound("User not found");
    }

    const user = await updateUserProfile(id, req.body);
    res.json(user);
  }),
);
