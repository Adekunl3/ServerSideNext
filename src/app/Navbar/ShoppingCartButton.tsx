"use client"

import { TiShoppingCart } from "react-icons/ti"
import { ShoppingCart } from "../lib/db/carts"
import { formatPrice } from "../lib/format"
import Link from "next/link"

interface ShoppingCartButtonProps {
    cart: ShoppingCart | null
}

export default function ShoppingCartButton({cart} : ShoppingCartButtonProps){
function closeDropdown() {
const close = document.activeElement as HTMLElement
if (close) {
    close.blur()
}
}

    return(
<div className="dropdown dropdown-end ">
<label tabIndex={0} className="btn-ghost  btn-circle btn">
<div className="indicator pt-2">
<TiShoppingCart />
<span className="badge badge-sm  indicator-item">
    {cart?.size || 0}
</span>
</div>
</label>
<div
    tabIndex={0}  
    className="bg-base-100 card dropdown-content card-compact mt-3 w-52 shadow z-30 "
    >
        <div className="card-body">
<span className="text-lg fontbold">{cart?.size || 0} Items</span>
<span className="text-info">
Subtotal: {formatPrice(cart?.subtotal || 0)}
</span>
<div className="card-actions">
    <Link
    href="/cart"
    className="btn btn-primary btn-block"
        onClick={closeDropdown}
        >
        view  cart
        </Link>
</div>
        </div>
</div>
</div>

    )
}