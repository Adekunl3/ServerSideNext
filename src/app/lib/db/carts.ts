// import { Cart, CartItem, Prisma, Product } from "@prisma/client";
// import { prisma } from "./prisma";
// import { cookies } from "next/headers";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../../../../@/utils/authOptions";

// export type CartWithProducts = Prisma.CartGetPayload<{
//   include: { items: { include: { product: true } } };
// }>;

// export type CartItemwithProduct = Prisma.CartItemGetPayload<{
//   include: { product: true };
// }>;

// export type ShoppingCart = CartWithProducts & {
//   size: number;
//   subtotal: number;
// };
// //fetch cart based on session
// export async function getCart(): Promise<ShoppingCart | null> {
//   const session = await getServerSession(authOptions);
//   console.log("session", session);

//   let cart: CartWithProducts | null = null;

//   if (session) {
//     try {
//       cart = await prisma.cart.findFirst({
//         where: { userId: session.user.id },
//         include: { items: { include: { product: true } } },
//       });
//       console.log("logged-in user:", cart);
//     } catch (error) {
//       console.error("Error fetching cart:", error);
//       // Handle the case where the user's cart or associated data is missing
//       return null;
//     }
//   } else {
//     const localCartId = cookies().get("localCartId")?.value;
//     try {
//       cart = localCartId ? await prisma.cart.findUnique({
//             where: { id: localCartId },
//             include: { items: { include: { product: true } } },
//           })
//         : null;
//     } catch (error) {
//       console.error("Error fetching local cart:", error);
//       // Handle the case where the local cart data is missing
//       return null;
//     }
//   }

//   if (!cart) 
//     return null;
  

//   // Filter out the cart items with missing products
//   const filteredItems = cart.items.filter((item) => item.product !== null);

//   // Handle the case where the cart or items are missing
//   if (filteredItems.length !== cart.items.length) {
//     console.warn("Some cart items or products are missing");
//   }

//   return {
//     ...cart,
//     items: filteredItems,
//     size: filteredItems.reduce((accumulate, item) => accumulate + item.quantity, 0),
//     subtotal: filteredItems.reduce(
//       (accumulate, item) => accumulate + item.quantity * (item.product?.price || 0),
//       0
//     ),
//   };
// }

// export async function createCart(): Promise<ShoppingCart> {
//   const session = await getServerSession(authOptions);

//   let newCart: Cart;

//   if (session) {
//     newCart = await prisma.cart.create({
//       data: { userId: session.user.id ?? null },
//     });
//   } else {
//     newCart = await prisma.cart.create({
//       data: {},
//     });

//     cookies().set("localCartId", newCart.id, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       path: "/",
//     });
//   }

//   return {
//     ...newCart,
//     items: [],
//     size: 0,
//     subtotal: 0,
//   };
// }

// export async function mergeAnonymousCart(userId: string) {
//   const localCartId = cookies().get("localCartId")?.value;

//   if (!localCartId) return;

//   const localCart = 
//      await prisma.cart.findUnique({
//         where: { id: localCartId },
//         include: { items: true },
//       })
//     ;

//   if (!localCart) return;

//   const userCart = await prisma.cart.findFirst({
//     where: { userId },
//     include: { items: true },
//   });

//   await prisma.$transaction(async (tx) => {
//     if (userCart) {
//       const mergedCartItems = mergeCartItems(localCart.items, userCart.items);

//       //clear existing items in the user cart
//       await tx.cartItem.deleteMany({
//         where: { cartId: userCart.id },
//       });

//       await tx.cart.update({
//         where: { id: userCart.id },
//         data: {
//           items: {
//             createMany: {
//               data: mergedCartItems.map((item) => ({
//                 cartId: userCart.id,
//                 productId: item.productId,
//                 quantity: item.quantity,
//               })),
//             },
//           },
//         },
//       });
//     } else {
//       //create a new cart for the user with items from the local cart
//       await tx.cart.create({
//         data: {
//           userId,
//           items: {
//             createMany: {
//               data: localCart.items.map((item) => ({
//                 productId: item.productId,
//                 quantity: item.quantity,
//               })),
//             },
//           },
//         },
//       });
//     }

//     await tx.cart.delete({
//       where: { id: localCart.id },
//     });

//     cookies().set("localCartId", "", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       path: "/",
//     });
//   }).catch((error) => {
//     console.error("error merging carts anonymous with usercart", error)
//   })
// }

// function mergeCartItems(...cartItems: CartItem[][]): CartItem[] {
//   return cartItems.reduce((acc, items) => {
//     items.forEach((item) => {
//       const existingItem = acc.find((i) => i.productId === item.productId);
//       if (existingItem) {
//         existingItem.quantity += item.quantity;
//       } else {
//         acc.push(item);
//       }
//     });
//     return acc;
//   }, [] as CartItem[]);
// }

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

// Fetch cart based on session
export async function getCart(): Promise<ShoppingCart | null> {
  const session = await getServerSession(authOptions);
  let cart: CartWithProducts | null = null;

  try {
    if (session) {
      cart = await prisma.cart.findFirst({
        where: { userId: session.user.id },
        include: { items: { include: { product: true } } },
      });
      console.log("Fetched cart for logged-in user:", cart);
    } else {
      const localCartId = cookies().get("localCartId")?.value;
      if (localCartId) {
        cart = await prisma.cart.findUnique({
          where: { id: localCartId },
          include: { items: { include: { product: true } } },
        });
      }
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }

  if (!cart) return null;

  const filteredItems = cart.items.filter((item) => item.product !== null);

  if (filteredItems.length !== cart.items.length) {
    console.warn("Some cart items or products are missing.");
  }

  return {
    ...cart,
    items: filteredItems,
    size: filteredItems.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: filteredItems.reduce((acc, item) => acc + item.quantity * (item.product?.price || 0), 0),
  };
}

// Create a new cart for either logged-in or anonymous user
export async function createCart(): Promise<ShoppingCart> {
  const session = await getServerSession(authOptions);
  let newCart: Cart;

  try {
    if (session) {
      newCart = await prisma.cart.create({ data: { userId: session.user.id ?? null } });
    } else {
      newCart = await prisma.cart.create({ data: {} });
      cookies().set("localCartId", newCart.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    }
  } catch (error) {
    console.error("Error creating cart:", error);
    throw new Error("Failed to create cart.");
  }

  return { ...newCart, items: [], size: 0, subtotal: 0 };
}

// Merge anonymous cart items into user cart upon login
export async function mergeAnonymousCart(userId: string) {
  const localCartId = cookies().get("localCartId")?.value;
  if (!localCartId) {
    console.warn("No local cart ID found. Skipping merge.");
    return;
  }

  const localCart = await prisma.cart.findUnique({
    where: { id: localCartId },
    include: { items: true },
  });

  if (!localCart || localCart.items.length === 0) {
    console.warn("Local cart is empty or not found.");
    return;
  }

  const userCart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: true },
  });

  try {
    await prisma.$transaction(async (tx) => {
      if (userCart) {
        const mergedCartItems = mergeCartItems(localCart.items, userCart.items);

        await tx.cartItem.deleteMany({ where: { cartId: userCart.id } });
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

      await tx.cart.delete({ where: { id: localCart.id } });
      cookies().set("localCartId", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    });
    console.log("Anonymous cart successfully merged with user cart.");
  } catch (error) {
    console.error("Error merging carts:", error);
  }
}

// Helper to merge cart items by product ID, summing quantities
function mergeCartItems(...cartItems: CartItem[][]): CartItem[] {
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
