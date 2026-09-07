import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { badRequest, forbidden, notFound } from "../lib/errors";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function listCategories() {
  return prisma.category.findMany({ orderBy: { id: "asc" } });
}

export async function createCategory(input: { name: string; slug?: string }) {
  const slug = input.slug?.trim() || slugify(input.name);
  if (!slug) {
    throw badRequest("Unable to build category slug");
  }

  return prisma.category.create({
    data: { name: input.name.trim(), slug },
  });
}

type ProductListQuery = {
  q?: string;
  categoryId?: number;
  price_gte?: number;
  price_lte?: number;
  isPublished?: boolean;
  _sort?: "price" | "createdAt" | "title" | "id";
  _order?: "asc" | "desc";
  _page?: number;
  _limit?: number;
  forcePublishedOnly?: boolean;
};

export async function listProducts(query: ProductListQuery) {
  const page = query._page && query._page > 0 ? query._page : 1;
  const limit = query._limit && query._limit > 0 ? Math.min(query._limit, 100) : 10;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {};

  if (query.forcePublishedOnly || query.isPublished === true) {
    where.isPublished = true;
  } else if (query.isPublished === false) {
    where.isPublished = false;
  }

  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  if (query.price_gte !== undefined || query.price_lte !== undefined) {
    where.price = {};
    if (query.price_gte !== undefined) where.price.gte = query.price_gte;
    if (query.price_lte !== undefined) where.price.lte = query.price_lte;
  }

  if (query.q?.trim()) {
    const q = query.q.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const sortField = query._sort ?? "id";
  const sortOrder = query._order ?? "asc";

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { [sortField]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, limit };
}

export async function getProductById(id: number, asManager: boolean) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!product) {
    throw notFound("Product not found");
  }
  if (!asManager && !product.isPublished) {
    throw notFound("Product not found");
  }
  return product;
}

export async function createProduct(input: {
  title: string;
  description: string;
  categoryId: number;
  price: number;
  stock: number;
  isPublished?: boolean;
  imageUrl: string;
}) {
  const category = await prisma.category.findUnique({
    where: { id: input.categoryId },
  });
  if (!category) {
    throw badRequest("Category not found");
  }

  return prisma.product.create({
    data: {
      title: input.title,
      description: input.description,
      categoryId: input.categoryId,
      price: input.price,
      stock: input.stock,
      isPublished: input.isPublished ?? false,
      imageUrl: input.imageUrl,
    },
    include: { category: true },
  });
}

export async function updateProduct(
  id: number,
  input: Partial<{
    title: string;
    description: string;
    categoryId: number;
    price: number;
    stock: number;
    isPublished: boolean;
    imageUrl: string;
  }>,
) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw notFound("Product not found");
  }

  if (input.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: input.categoryId },
    });
    if (!category) {
      throw badRequest("Category not found");
    }
  }

  if (input.stock !== undefined && input.stock < 0) {
    throw badRequest("Stock cannot be negative");
  }

  return prisma.product.update({
    where: { id },
    data: input,
    include: { category: true },
  });
}

export async function deleteProduct(id: number) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw notFound("Product not found");
  }
  await prisma.product.delete({ where: { id } });
}

export function assertCanManageCatalog(role: string) {
  if (role !== "MANAGER") {
    throw forbidden("Managers only");
  }
}
