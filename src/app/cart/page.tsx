import { getCart } from "../lib/db/carts";
import { formatPrice } from "../lib/format";
import CartEntry from "./CartEntry";
import { setProductQuantity } from "./actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

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
        <p className="mb-3 font-bold">
          Total: {formatPrice(cart?.subtotal || 0)}
        </p>
        <a
          href={whatsappMessage}
          target="_blank"
          rel="noopener noreferrer"
          // className="btn btn-primary sm:mr-[200px]"
        >
          <button className="btn btn-primary sm:mr-[200px]">
            <FontAwesomeIcon icon={faWhatsapp} className="mr-2 w-[30px] " />
            Checkout & chat with the seller
          </button>
        </a>
      </div>
    </div>
  );
}
