"use client";
import { TiShoppingCart } from "react-icons/ti";

interface AddCartButtonProps {
    productId: string;
}

export default function AddCartButton({ productId }: AddCartButtonProps) {
    return (
        <div className="flex items-center gap-2">
            <button
                className="btn btn-primary"
                onClick={() => {
                    // Implement the Add to Cart functionality here

                    // console.log(`Product ${productId} added to cart`);
                }}
            >
                Add to Cart
                <TiShoppingCart />
            </button>
        </div>
    );
}
