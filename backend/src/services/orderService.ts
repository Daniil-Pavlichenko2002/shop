import { OrderStatus, Prisma, type Role } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { badRequest, forbidden, notFound } from "../lib/errors";

export type OrderItemInput = {
  productId: number;
  quantity: number;
};

export type OrderItemSnapshot = {
  productId: number;
  title: string;
  price: number;
  quantity: number;
};

const USER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  NEW: [OrderStatus.PAID, OrderStatus.CANCELLED],
  PAID: [OrderStatus.CANCELLED],
  PROCESSING: [],
  SHIPPED: [],
  COMPLETED: [],
  CANCELLED: [],
};

const MANAGER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  NEW: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  PAID: [OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  PROCESSING: [OrderStatus.SHIPPED, OrderStatus.COMPLETED, OrderStatus.CANCELLED],
  SHIPPED: [OrderStatus.COMPLETED],
  COMPLETED: [],
  CANCELLED: [],
};

async function createNotification(userId: number, text: string, tx: Prisma.TransactionClient) {
  await tx.notification.create({
    data: { userId, text },
  });
}

function parseItems(items: unknown): OrderItemSnapshot[] {
  if (!Array.isArray(items)) {
    return [];
  }
  return items as OrderItemSnapshot[];
}

async function restoreStock(
  items: OrderItemSnapshot[],
  tx: Prisma.TransactionClient,
) {
  for (const item of items) {
    await tx.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } },
    });
  }
}

export async function createOrder(userId: number, items: OrderItemInput[]) {
  if (items.length === 0) {
    throw badRequest("Order must contain at least one item");
  }

  return prisma.$transaction(async (tx) => {
    const snapshots: OrderItemSnapshot[] = [];

    for (const item of items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || !product.isPublished) {
        throw badRequest(`Product ${item.productId} is unavailable`);
      }
      if (item.quantity <= 0) {
        throw badRequest("Quantity must be positive");
      }
      if (product.stock < item.quantity) {
        throw badRequest(
          `Not enough stock for "${product.title}"`,
          "INSUFFICIENT_STOCK",
        );
      }

      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: item.quantity } },
      });

      snapshots.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const totalAmount = snapshots.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = await tx.order.create({
      data: {
        userId,
        status: OrderStatus.NEW,
        items: snapshots,
        totalAmount,
      },
    });

    await createNotification(
      userId,
      `Заказ #${order.id} создан`,
      tx,
    );

    return order;
  });
}

export async function listOrders(params: {
  requesterId: number;
  requesterRole: Role;
  userId?: number;
}) {
  if (params.requesterRole === "USER") {
    return prisma.order.findMany({
      where: { userId: params.requesterId },
      orderBy: { createdAt: "desc" },
    });
  }

  return prisma.order.findMany({
    where: params.userId ? { userId: params.userId } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(
  id: number,
  requesterId: number,
  requesterRole: Role,
) {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    throw notFound("Order not found");
  }
  if (requesterRole === "USER" && order.userId !== requesterId) {
    throw forbidden("Cannot access another user's order");
  }
  return order;
}

export async function updateOrderStatus(params: {
  orderId: number;
  nextStatus: OrderStatus;
  requesterId: number;
  requesterRole: Role;
}) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: params.orderId } });
    if (!order) {
      throw notFound("Order not found");
    }

    if (params.requesterRole === "USER" && order.userId !== params.requesterId) {
      throw forbidden("Cannot update another user's order");
    }

    const allowed =
      params.requesterRole === "MANAGER"
        ? MANAGER_TRANSITIONS[order.status]
        : USER_TRANSITIONS[order.status];

    if (!allowed.includes(params.nextStatus)) {
      throw badRequest(
        `Transition ${order.status} -> ${params.nextStatus} is not allowed`,
        "INVALID_STATUS_TRANSITION",
      );
    }

    if (params.nextStatus === OrderStatus.CANCELLED) {
      await restoreStock(parseItems(order.items), tx);
    }

    const updated = await tx.order.update({
      where: { id: order.id },
      data: { status: params.nextStatus },
    });

    await createNotification(
      order.userId,
      `Статус заказа #${order.id} изменён на ${params.nextStatus}`,
      tx,
    );

    return updated;
  });
}
