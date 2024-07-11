"use client";

import Image from "next/image";
import { CartItemwithProduct } from "../lib/db/carts";
import Link from "next/link";
import { formatPrice } from "../lib/format";
import { useTransition } from "react";

interface CartEntryProps {
  cartItem: CartItemwithProduct;
  setProductQty: (productId: string, quantity: number) => Promise<void>;
}

export default function CartEntry({
  cartItem: { product, quantity },
  setProductQty,
}: CartEntryProps) {
  const [isPending, startTransition] = useTransition();

  const quantityOptions: JSX.Element[] = [];
  for (let i = 1; i <= 99; i++) {
    quantityOptions.push(
      <option value={i} key={i}>
        {i}
      </option>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Image
          src={product.imageUrl} // Fix variable name
          alt={product.name}
          width={200}
          height={200}
          className="rounded-lg"
        />
        <div>
          <Link href={"/products/" + product.id} className="font-bold">
            {product.name}
          </Link>
          <div> price: {formatPrice(product.price)}</div>
          <div className="my-1 flex item-center gap-3">
            Quantity:
            <select
              className="select select-bordered w-full max-w-[80px"
              defaultValue={quantity}
              onChange={(e) => {
                const newQuantity = parseInt(e.currentTarget.value);
                startTransition(async () => {
                  await setProductQty(product.id, newQuantity);
                });
              }}
            >
              <option value={0}> 0 (Remove)</option>
              {quantityOptions}
            </select>
          </div>

          <div className="flex items-center gap-3">
            Total: {formatPrice(product.price * quantity)}
            {isPending && (
              <span className="loading loading-spinner loading-sm" />
            )}
          </div>
        </div>
      </div>
      <div className="divider" />
    </div>
  );
}