"use client";
import { useState, useTransition } from "react";
import { TiShoppingCart } from "react-icons/ti";

interface AddCartButtonProps {
  productId: string;
  incrementProductQty: (productId: string) => Promise<void>;
}

export default function AddCartButton({
  productId,
  incrementProductQty,
}: AddCartButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSucces] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <button
        className="btn btn-primary"
        onClick={() => {
          // Implement the Add to Cart functionality here
          setSucces(false)
          startTransition(async () => {
            await incrementProductQty(productId)
            setSucces(true)
          })
          
          // console.log(`Product ${productId} added to cart`);
        }}
      >
        Add to Cart
        <TiShoppingCart />
      </button>

     {isPending && <span className="loading loading-spinner loading-md" />}
    {!isPending && success && (
        <span className="text-success"> Added to Cart</span>
    )
     }
    </div>
  );
}
