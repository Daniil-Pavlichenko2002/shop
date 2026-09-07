import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";
import { config } from "../config";
import { forbidden, unauthorized } from "../lib/errors";
import { prisma } from "../lib/prisma";

export type AuthUser = {
  id: number;
  email: string;
  role: Role;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

type AccessPayload = {
  sub: number;
  email: string;
  role: Role;
  type: "access";
};

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw unauthorized("Missing or invalid Authorization header");
    }

    const token = header.slice("Bearer ".length);
    const payload = jwt.verify(
      token,
      config.jwt.accessSecret,
    ) as unknown as AccessPayload;

    if (payload.type !== "access") {
      throw unauthorized("Invalid token type");
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      throw unauthorized("User not found");
    }

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      next(unauthorized("Access token expired"));
      return;
    }
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      next(unauthorized("Invalid access token"));
      return;
    }
    next(error);
  }
}

export function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  if (!header) {
    next();
    return;
  }
  return requireAuth(req, res, next);
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(unauthorized());
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(forbidden("Insufficient role"));
      return;
    }
    next();
  };
}
