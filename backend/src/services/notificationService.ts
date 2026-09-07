import { prisma } from "../lib/prisma";
import { forbidden, notFound } from "../lib/errors";
import type { Role } from "@prisma/client";

export async function listNotifications(params: {
  requesterId: number;
  requesterRole: Role;
  userId?: number;
  sort?: "createdAt";
  order?: "asc" | "desc";
}) {
  const targetUserId =
    params.requesterRole === "MANAGER" && params.userId
      ? params.userId
      : params.requesterId;

  if (
    params.requesterRole === "USER" &&
    params.userId &&
    params.userId !== params.requesterId
  ) {
    throw forbidden("Cannot read another user's notifications");
  }

  return prisma.notification.findMany({
    where: { userId: targetUserId },
    orderBy: {
      [params.sort ?? "createdAt"]: params.order ?? "desc",
    },
  });
}

export async function createNotification(input: {
  userId: number;
  text: string;
}) {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      text: input.text,
    },
  });
}

export async function markNotificationRead(params: {
  id: number;
  requesterId: number;
  requesterRole: Role;
  isRead?: boolean;
}) {
  const notification = await prisma.notification.findUnique({
    where: { id: params.id },
  });
  if (!notification) {
    throw notFound("Notification not found");
  }

  if (
    params.requesterRole === "USER" &&
    notification.userId !== params.requesterId
  ) {
    throw forbidden("Cannot update another user's notification");
  }

  return prisma.notification.update({
    where: { id: params.id },
    data: { isRead: params.isRead ?? true },
  });
}
