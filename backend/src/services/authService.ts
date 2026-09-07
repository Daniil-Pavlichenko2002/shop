import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { Role, User } from "@prisma/client";
import { config } from "../config";
import { prisma } from "../lib/prisma";
import { conflict, notFound, unauthorized } from "../lib/errors";
import { toPublicUser } from "../lib/user";

type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

function parseDurationToMs(value: string): number {
  const match = /^(\d+)([smhd])$/.exec(value);
  if (!match) {
    return 7 * 24 * 60 * 60 * 1000;
  }
  const amount = Number(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return amount * multipliers[unit];
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function signAccessToken(user: User): string {
  const options: SignOptions = {
    expiresIn: config.jwt.accessExpiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: "access",
    },
    config.jwt.accessSecret,
    options,
  );
}

async function issueRefreshToken(userId: number): Promise<string> {
  const refreshToken = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(
    Date.now() + parseDurationToMs(config.jwt.refreshExpiresIn),
  );

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashToken(refreshToken),
      expiresAt,
    },
  });

  return refreshToken;
}

async function createTokenPair(user: User): Promise<TokenPair> {
  const accessToken = signAccessToken(user);
  const refreshToken = await issueRefreshToken(user.id);
  return { accessToken, refreshToken };
}

export async function registerUser(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });
  if (existing) {
    throw conflict("Email already registered");
  }

  const passwordHash = await bcrypt.hash(
    input.password,
    config.bcryptRounds,
  );

  const user = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      role: "USER" as Role,
    },
  });

  const tokens = await createTokenPair(user);
  return { ...tokens, user: toPublicUser(user) };
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });
  if (!user) {
    throw unauthorized("Invalid email or password");
  }

  const matches = await bcrypt.compare(input.password, user.passwordHash);
  if (!matches) {
    throw unauthorized("Invalid email or password");
  }

  const tokens = await createTokenPair(user);
  return { ...tokens, user: toPublicUser(user) };
}

export async function refreshSession(refreshToken: string) {
  const tokenHash = hashToken(refreshToken);
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!stored || stored.expiresAt < new Date()) {
    if (stored) {
      await prisma.refreshToken.delete({ where: { id: stored.id } });
    }
    throw unauthorized("Invalid or expired refresh token");
  }

  await prisma.refreshToken.delete({ where: { id: stored.id } });
  const tokens = await createTokenPair(stored.user);
  return { ...tokens, user: toPublicUser(stored.user) };
}

export async function logoutSession(refreshToken?: string) {
  if (!refreshToken) {
    return;
  }
  await prisma.refreshToken.deleteMany({
    where: { tokenHash: hashToken(refreshToken) },
  });
}

export async function getUserById(id: number) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw notFound("User not found");
  }
  return toPublicUser(user);
}

export async function updateUserProfile(
  id: number,
  input: {
    firstName?: string;
    lastName?: string;
    phone?: string | null;
  },
) {
  const user = await prisma.user.update({
    where: { id },
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
    },
  });
  return toPublicUser(user);
}
