import { z } from "zod";
import mongoose from "mongoose";

// Helper to validate MongoDB ObjectId
const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
  });

// Product validation schemas
export const productCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name too long"),
  description: z.string().max(5000, "Description too long").optional(),
  price: z.number().positive("Price must be positive"),
  oldPrice: z.number().positive().optional(),
  discount: z.number().min(0).max(100).optional(),
  category: objectIdSchema.optional(),
  categoryName: z.string().max(100).optional(),
  brand: z.string().max(100).optional(),
  rating: z.number().min(0).max(5).optional(),
  hideFromHome: z.boolean().optional(),
  variants: z
    .array(
      z.object({
        _id: z.string().optional(),
        color: z.string().min(1).max(50),
        size: z.string().min(1).max(50),
        quantity: z.number().int().min(0),
        sku: z.string().max(100).optional(),
      })
    )
    .optional(),
  totalStock: z.number().int().min(0).optional(),
});

export const productUpdateSchema = productCreateSchema.partial();

// Order validation schemas
// Flexible schema that accepts cart items with various field names
export const orderItemSchema = z
  .object({
    _id: z.string().optional(),
    productId: z.string().optional(),
    variantId: z.union([objectIdSchema, z.string()]).optional(),
    selectedVariantId: z.union([objectIdSchema, z.string()]).optional(),
    size: z.string().max(50).optional(),
    selectedSize: z.string().max(50).optional(),
    color: z.string().max(50).optional(),
    selectedColor: z.string().max(50).optional(),
    quantity: z
      .union([
        z.number().int().positive(),
        z.string().transform((val) => Number(val)),
      ])
      .optional(),
    quantityInCart: z
      .union([
        z.number().int().positive(),
        z.string().transform((val) => Number(val)),
      ])
      .optional(),
    price: z
      .union([
        z.number().nonnegative(),
        z.string().transform((val) => Number(val)),
      ])
      .optional(),
    variantSku: z.string().max(100).optional(),
    sku: z.string().max(100).optional(),
    // Allow any additional fields that might be in cart items (name, description, etc.)
  })
  .passthrough()
  .refine(
    (data) => {
      // At least one of quantity or quantityInCart must be present and positive
      const qty = data.quantity ?? data.quantityInCart;
      if (qty === undefined) return false;
      const numQty = typeof qty === "string" ? Number(qty) : qty;
      return Number.isInteger(numQty) && numQty > 0;
    },
    {
      message: "Quantity is required and must be a positive integer",
      path: ["quantity"],
    }
  )
  .refine(
    (data) => {
      // At least one product identifier must be present
      return !!(data._id || data.productId);
    },
    {
      message: "Product ID is required (_id or productId)",
      path: ["_id"],
    }
  );

export const orderCreateSchema = z.object({
  userId: objectIdSchema,
  addressId: objectIdSchema,
  products: z.array(orderItemSchema).min(1, "At least one product required"),
  totalPrice: z.number().positive("Total price must be positive"),
  promoCode: z.string().max(50).optional(),
  discountAmount: z.number().min(0).optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  paymentMethod: z.enum(["cash_on_delivery", "stripe"]).optional(),
  stripePaymentIntentId: z.string().max(200).optional(),
  shippingFee: z.number().min(0).optional(),
});

// User validation schemas
export const userUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email("Invalid email format").optional(),
  isAdmin: z.boolean().optional(),
});

// Address validation schemas
export const addressCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  phone: z.string().min(10, "Phone number too short").max(20),
  pinCode: z.string().min(4).max(10).optional(),
  address: z.string().min(5, "Address is required").max(500),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  country: z.string().max(100).optional(),
  isDefault: z.boolean().optional(),
});

export const addressUpdateSchema = addressCreateSchema.partial();

// Payment validation schemas
export const paymentIntentSchema = z.object({
  amount: z
    .number()
    .int()
    .min(50, "Minimum amount is $0.50")
    .max(10000000, "Amount too large"), // $100,000 max
  orderId: objectIdSchema.optional(),
  currency: z.string().length(3).default("usd").optional(),
});

// Category validation schemas
export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(1000).optional(),
  image: z.string().url().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

// Promo code validation schemas
export const promoCodeSchema = z.object({
  code: z.string().min(3).max(50).toUpperCase(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().positive(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  maxUses: z.number().int().positive().optional(),
  minPurchaseAmount: z.number().min(0).optional(),
});

// Cart validation schema
export const cartItemSchema = z.object({
  productId: objectIdSchema,
  variantId: objectIdSchema.optional(),
  quantity: z.number().int().positive(),
  size: z.string().max(50).optional(),
  color: z.string().max(50).optional(),
});

export const cartUpdateSchema = z.array(cartItemSchema);

// Validation helper function
export async function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<
  { success: true; data: T } | { success: false; errors: z.ZodError }
> {
  try {
    const validated = await schema.parseAsync(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

// Safe parse (doesn't throw)
export function safeParseInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}
