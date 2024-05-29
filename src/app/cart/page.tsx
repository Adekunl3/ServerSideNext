import { getCart } from "../lib/db/carts";
import { formatPrice } from "../lib/format";
import CartEntry from "./CartEntry";
import { setProductQuantity } from "./actions";

export const metadata = {
  title: "Your Shopping Cart - FIDU",
};

export default async function CartPage() {
  const cart = await getCart();
  return (
    <div>
      <h1 className="text-3xl font-bold">Shopping Cart</h1>
      {cart?.items.map((cartItem) => (
        <CartEntry
          cartItem={cartItem}
          key={cartItem.id}
          setProductQty={setProductQuantity}
        />
      ))}
      {!cart?.items.length && <p> your cart is empty. </p>}
      <div className="flex flex-col items-end sm:items-center">
        <p className="mb-3 font-bold">
          Total: {formatPrice(cart?.subtotal || 0)}
        </p>
        <button className="btn btn-primary sm:-[200px]"> Checkout</button>
      </div>
    </div>
  );
}
