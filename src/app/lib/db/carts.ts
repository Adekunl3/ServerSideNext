import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { cookies } from "next/headers";

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
  const localCartId = cookies().get("localCartId")?.value;
  const cart = localCartId
    ? await prisma.cart.findUnique({
        where: { id: localCartId },
        include: { items: { include: { product: true } } },
      })
    : null;

  if (!cart) {
    return null;
  }
  return {
    ...cart,
    size: cart.items.reduce(
      (accumulate, item) => accumulate + item.quantity,
      0
    ),
    subtotal: cart.items.reduce(
      (accumulate, item) => accumulate + item.quantity * item.product.price,
      0
    ),
  };
}

export async function createCart(): Promise<ShoppingCart> {
  const newCart = await prisma.cart.create({
    data: {},
  });

  //store anonymous cart that store users without login
  //cookies itself need additional security settings for production mode
  //Note: needs encryption + secure settings in real prod. app
  cookies().set("localCartId", newCart.id);
  // console.log(cookies())

  //encrypt the cartId, cos the user can modify the cookies and this way, they could
  //get id of another cart, which can make them change the cart of another user.

  return {
    ...newCart,
    items: [],
    size: 0,
    subtotal: 0,
  };
}
