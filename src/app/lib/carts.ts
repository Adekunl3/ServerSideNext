
import prisma from "./db"
import { cookies } from "next/headers"

export type ShoppingCart = Cart

export async function getCart() {
    const localCartId = cookies().get("localCartId")?.value
const cart = localCartId ?
await prisma.cart.findUnique({
    where: {id: localCartId},
    include: {items: {include: {product: true}}}
})
: null

if(!cart) {
    return null
}
return{
    ...cart,
    size: cart.items.reduce((accumulate, item) => accumulate + item.quantity, 0),
    subtotal: cart.items.reduce(
        (accumulate, item) => accumulate + item.quantity * item.product.price, 0
    ),
}
}

export async function createCart() {
    const newCart = await prisma.cart.create({
data: {}
    })

    //store anonymous cart that store users without login
//cookies itself need additional security settings for production mode
//Note: needs encryption + secure settings in real prod. app    
cookies().set("localCartId", newCart.id)
// console.log(cookies())

    //encrypt the cartId, cos the user can modify the cookies and this way, they could 
    //get id of another cart, which can make them change the cart of another user.
}