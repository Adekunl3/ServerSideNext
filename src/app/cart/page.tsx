import { getCart } from "../lib/db/carts";
import { formatPrice } from "../lib/format";
import CartEntry from "./CartEntry";
import { setProductQuantity } from "./actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

export const metadata = {
  title: "Your Shopping Cart - FIDU",
};

export default async function CartPage() {
  const cart = await getCart();

  // Create a message with the items details
  const itemsDetails = cart?.items
    .map(
      (item) =>
        `Product: ${item.product.name}\nPrice: ${formatPrice(item.product.price)}\nQuantity: ${item.quantity}`
    )
    .join("\n\n");

  const whatsappMessage = `https://wa.me/message/V3VJBM2HMRKVA1?text=
  ${encodeURIComponent(
    `Checkout items:\n\n${itemsDetails}\n\nTotal:
   ${formatPrice(cart?.subtotal || 0)}`
  )}`;

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
      {!cart?.items.length && <p>Your cart is empty.</p>}
      <div className="flex flex-col items-end sm:items-center">
        <p className="mb-3 font-bold mr-16">
          Total: {formatPrice(cart?.subtotal || 0)}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center mr-16">
  <a
    href={whatsappMessage}
    target="_blank"
    rel="noopener noreferrer"
    className="btn btn-primary mb-3 sm:mr-3 sm:mb-0" // Adjust margin for spacing
  >
    <FontAwesomeIcon icon={faWhatsapp} className="mr-2 w-5" />
    Chat with the seller
  </a>

  <Link className="btn btn-primary" href="/payment">
 
    Checkout to payment

</Link>
</div>



      </div>
    </div>
  );
}
