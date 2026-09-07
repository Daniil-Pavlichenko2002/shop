import { Router } from "express";
import { asyncHandler, validateBody } from "../middleware/error";
import {
  loginUser,
  logoutSession,
  refreshSession,
  registerUser,
} from "../services/authService";
import {
  loginSchema,
  refreshSchema,
  registerSchema,
} from "../validators/schemas";

export const authRouter = Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  asyncHandler(async (req, res) => {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  }),
);

authRouter.post(
  "/login",
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const result = await loginUser(req.body);
    res.json(result);
  }),
);

authRouter.post(
  "/refresh",
  validateBody(refreshSchema),
  asyncHandler(async (req, res) => {
    const result = await refreshSession(req.body.refreshToken);
    res.json(result);
  }),
);

authRouter.post(
  "/logout",
  validateBody(refreshSchema.partial()),
  asyncHandler(async (req, res) => {
    await logoutSession(req.body.refreshToken);
    res.status(204).send();
  }),
);
