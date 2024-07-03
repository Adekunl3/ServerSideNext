import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/apple-touch-icon.png";
import { redirect } from "next/navigation";
import { getCart } from "../lib/db/carts";
import ShoppingCartButton from "./ShoppingCartButton";
import UserMenuButton from "./UserMenuButton";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../@/utils/authOptions";

async function searchProducts(formData: FormData) {
  "use server";

  const searchQuery = formData.get("searchQuery")?.toString();

  if (searchQuery) {
    redirect("/search?query=" + searchQuery);
  }
}

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const cart = await getCart();

  return (
    <div className="bg-base-100">
      <div className="navbar max-w-7xl m-auto flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Link
            href="/"
            className="btn btn-ghost before:ease relative text-xl  
            h-12 w-40 
          overflow-hidden text-white 
          shadow-2xl before:absolute before:left-0 
          before:-ml-2 before:h-48 before:w-48 
          before:origin-top-right before:-translate-x-full 
          before:translate-y-12 before:-rotate-90
           before:bg-red-400 before:transition-all 
           before:duration-1000 hover:text-black
            hover:shadow-black hover:before:-rotate-180"
          >
            <Image
              src={logo}
              height={40}
              width={40}
              alt="fidu logo"
              className=""
            />
            <span className="relative z-10"> FIDU </span>
          </Link>
        </div>
        <div className="flex-none gap-0 flex items-center">
          <Link href="/allProducts" className="btn btn-ghost">Shop</Link>
          <Link href="/contact" className="btn btn-ghost">contact us</Link>
          <form action={searchProducts}>
            <div className="form-control">
              <input
                name="searchQuery"
                placeholder="search"
                className="input input-bordered w-full min-w-[100px]"
              />
            </div>
          </form>
          <ShoppingCartButton session={session} />
          <UserMenuButton session={session} />
        </div>
      </div>
    </div>
  );
}