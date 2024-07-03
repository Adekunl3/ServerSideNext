import { Cart, CartItem, Prisma, Product } from "@prisma/client";
import { prisma } from "./prisma";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../@/utils/authOptions";

export type CartWithProducts = Prisma.CartGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export type CartItemwithProduct = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;

export type ShoppingCart = CartWithProducts & {
  size: number;
  subtotal: number;
};

export async function getCart(): Promise<ShoppingCart | null> {
  const session = await getServerSession(authOptions);
  console.log("session", session);

  let cart: CartWithProducts | null = null;

  if (session) {
    try {
      cart = await prisma.cart.findFirst({
        where: { userId: session.user.id },
        include: { items: { include: { product: true } } },
      });
      console.log("logged-in user:", cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
      // Handle the case where the user's cart or associated data is missing
      return null;
    }
  } else {
    const localCartId = cookies().get("localCartId")?.value;
    try {
      cart = localCartId
        ? await prisma.cart.findUnique({
            where: { id: localCartId },
            include: { items: { include: { product: true } } },
          })
        : null;
    } catch (error) {
      console.error("Error fetching local cart:", error);
      // Handle the case where the local cart data is missing
      return null;
    }
  }

  if (!cart) {
    return null;
  }

  // Filter out the cart items with missing products
  const filteredItems = cart.items.filter((item) => item.product !== null);

  // Handle the case where the cart or items are missing
  if (filteredItems.length !== cart.items.length) {
    console.warn("Some cart items or products are missing");
  }

  return {
    ...cart,
    items: filteredItems,
    size: filteredItems.reduce((accumulate, item) => accumulate + item.quantity, 0),
    subtotal: filteredItems.reduce(
      (accumulate, item) => accumulate + item.quantity * (item.product?.price || 0),
      0
    ),
  };
}

export async function createCart(): Promise<ShoppingCart> {
  const session = await getServerSession(authOptions);

  let newCart: Cart;

  if (session) {
    newCart = await prisma.cart.create({
      data: { userId: session.user.id ?? null },
    });
  } else {
    newCart = await prisma.cart.create({
      data: {},
    });

    cookies().set("localCartId", newCart.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
  }

  return {
    ...newCart,
    items: [],
    size: 0,
    subtotal: 0,
  };
}

export async function mergeAnonymousCart(userId: string) {
  const localCartId = cookies().get("localCartId")?.value;

  const localCart = localCartId
    ? await prisma.cart.findUnique({
        where: { id: localCartId },
        include: { items: true },
      })
    : null;

  if (!localCart) return;

  const userCart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: true },
  });

  await prisma.$transaction(async (tx) => {
    if (userCart) {
      const mergedCartItems = mergeCartItems(localCart.items, userCart.items);

      await tx.cartItem.deleteMany({
        where: { cartId: userCart.id },
      });

      await tx.cart.update({
        where: { id: userCart.id },
        data: {
          items: {
            createMany: {
              data: mergedCartItems.map((item) => ({
                cartId: userCart.id,
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    } else {
      await tx.cart.create({
        data: {
          userId,
          items: {
            createMany: {
              data: localCart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    }

    await tx.cart.delete({
      where: { id: localCart.id },
    });

    cookies().set("localCartId", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
  });
}

export async function addToCart(productId: string, quantity: number) {
  const session = await getServerSession(authOptions);

  if (session) {
    // Add the product to the user's cart
    const cart = await prisma.cart.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        items: {
          create: [
            {
              productId,
              quantity,
            },
          ],
        },
      },
      update: {
        items: {
          upsert: [
            {
              where: {
                cartId_productId: {
                  cartId: "$exists",
                  productId,
                },
              },
              create: {
                productId,
                quantity,
              },
              update: {
                quantity: {
                  increment: quantity,
                },
              },
            },
          ],
        },
      },
      include: {
        items: true,
      },
    });

    return cart;
  } else {
    // Add the product to the anonymous user's cart
    const localCartId = cookies().get("localCartId")?.value;
    const cart = await prisma.cart.upsert({
      where: { id: localCartId || undefined },
      create: {
        items: {
          create: [
            {
              productId,
              quantity,
            },
          ],
        },
      },
      update: {
        items: {
          upsert: [
            {
              where: {
                cartId_productId: {
                  cartId: localCartId,
                  productId,
                },
              },
              create: {
                productId,
                quantity,
              },
              update: {
                quantity: {
                  increment: quantity,
                },
              },
            },
          ],
        },
      },
      include: {
        items: true,
      },
    });

    cookies().set("localCartId", cart.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return cart;
  }
}

function mergeCartItems(...cartItems: CartItem[][]) {
  return cartItems.reduce((acc, items) => {
    items.forEach((item) => {
      const existingItem = acc.find((i) => i.productId === item.productId);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push(item);
      }
    });
    return acc;
  }, [] as CartItem[]);
}