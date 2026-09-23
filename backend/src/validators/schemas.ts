import { z } from "zod";
import { OrderStatus } from "@prisma/client";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().nullable().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
});

export const createProductSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.number().int().positive(),
  price: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  isPublished: z.boolean().optional(),
  imageUrl: z.string().url(),
});

export const updateProductSchema = createProductSchema.partial();

export const addCartItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export const updateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export const createNotificationSchema = z.object({
  userId: z.number().int().positive(),
  text: z.string().min(1),
});

export const updateNotificationSchema = z.object({
  isRead: z.boolean(),
});
