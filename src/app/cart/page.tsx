import { getCart } from "../lib/db/carts";
import CartEntry from "./CartEntry";

export const metadata = {
    title: "Your Shopping Cart - FIDU",
};

export default async function CartPage() {
    const cart = await getCart();
    return (
        <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            {cart?.items.map(cartItem => (
                <CartEntry cartItem={cartItem} key={cartItem.id} />
            ))}
        </div>
    );
}
