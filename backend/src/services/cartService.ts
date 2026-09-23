import type { Prisma, Product } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { badRequest, notFound } from "../lib/errors";

type CartProductPreview = {
  id: number;
  title: string;
  price: number;
  stock: number;
  imageUrl: string;
  isPublished: boolean;
};

type CartLine = {
  productId: number;
  quantity: number;
  product: CartProductPreview;
};

function toCartProductPreview(product: Product): CartProductPreview {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    stock: product.stock,
    imageUrl: product.imageUrl,
    isPublished: product.isPublished,
  };
}

function sumQuantities(items: { quantity: number }[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function sumAmount(items: CartLine[]) {
  return items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
}

async function findPublishedProduct(productId: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || !product.isPublished) {
    throw badRequest(`Product ${productId} is unavailable`);
  }

  return product;
}

function assertQuantityWithinStock(quantity: number, stock: number, title: string) {
  if (quantity > stock) {
    throw badRequest(
      `Not enough stock for "${title}"`,
      "INSUFFICIENT_STOCK",
    );
  }
}

async function loadCartLines(userId: number): Promise<CartLine[]> {
  const rows = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });

  return rows.map((row) => ({
    productId: row.productId,
    quantity: row.quantity,
    product: toCartProductPreview(row.product),
  }));
}

export async function getCart(userId: number) {
  const items = await loadCartLines(userId);

  return {
    items,
    totalCount: sumQuantities(items),
    totalAmount: sumAmount(items),
  };
}

export async function getCartInfo(userId: number) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    select: { quantity: true },
  });

  return {
    totalCount: sumQuantities(items),
    uniqueItems: items.length,
  };
}

export async function addCartItem(
  userId: number,
  input: { productId: number; quantity: number },
) {
  const product = await findPublishedProduct(input.productId);
  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_productId: { userId, productId: input.productId },
    },
  });

  const nextQuantity = (existing?.quantity ?? 0) + input.quantity;
  assertQuantityWithinStock(nextQuantity, product.stock, product.title);

  await prisma.cartItem.upsert({
    where: {
      userId_productId: { userId, productId: input.productId },
    },
    create: {
      userId,
      productId: input.productId,
      quantity: input.quantity,
    },
    update: { quantity: nextQuantity },
  });

  return getCart(userId);
}

export async function setCartItemQuantity(
  userId: number,
  productId: number,
  quantity: number,
) {
  const product = await findPublishedProduct(productId);
  assertQuantityWithinStock(quantity, product.stock, product.title);

  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });

  if (!existing) {
    throw notFound("Cart item not found");
  }

  await prisma.cartItem.update({
    where: { id: existing.id },
    data: { quantity },
  });

  return getCart(userId);
}

export async function removeCartItem(userId: number, productId: number) {
  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });

  if (!existing) {
    throw notFound("Cart item not found");
  }

  await prisma.cartItem.delete({ where: { id: existing.id } });
  return getCart(userId);
}

export async function clearCart(
  userId: number,
  tx: Prisma.TransactionClient = prisma,
) {
  await tx.cartItem.deleteMany({ where: { userId } });
}
