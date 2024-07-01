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
  const [success, setSuccess] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        className="btn btn-primary"
        onClick={() => {
          setSuccess(false);
          startTransition(async () => {
            await incrementProductQty(productId);
            setSuccess(true);
          });
        }}
        disabled={isPending} // Optionally disable the button while pending
      >
        Add to Cart
        <TiShoppingCart />
      </button>

      {isPending && <span className="loading loading-spinner loading-md" />}
      {!isPending && success && (
        <span className="text-success">Added to Cart</span>
      )}
    </div>
  );
}
