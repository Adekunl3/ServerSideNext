export const metadata = {
  title: "Add Product - FIDU",
};

import React from "react";
import {prisma} from "../lib/db/prisma";
import { redirect } from "next/navigation";
import SubmitFormButton from "../components/SubmitFormButton";
import { authOptions } from "../../../@/utils/authOptions";
import { getServerSession } from "next-auth";


async function addProduct(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/api/auth/signin?callbackurl=/add-product")
  }
if (session.user.role !== 'admin'){
  redirect("/not-authorized") //redirect to a not authorized page or similar 
}

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("ImageUrl")?.toString();
  const price = Number(formData.get("price") || 0);
  

  if (!name || !description || !imageUrl || !price) {
    throw Error("Missing required fields");

  }
  
  await prisma.product.create({
    data: { name, description, imageUrl, price },
  });

  redirect("/");
}

export default async function AddProduct() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product")
  }
  if (session.user.role !== 'admin'){
    redirect("/not-authorized")
  }
  return (
    <>
      <div>
        <h1 className="mb-3 text-lg  font-bold">Add Product</h1>
      </div>
      <form action={addProduct}>
        <input
          required
          name="name"
          placeholder="Name"
          className="mb-3 w-full  input input-bordered"
        />
        <textarea
          required
          name="description"
          placeholder="Description"
          className="mb-3 textarea-bordered textarea  w-full"
        />
        <input
          required
          name="ImageUrl"
          placeholder="Image URL"
          type="url"
          className="mb-3 textarea-bordered textarea  w-full"
        />
        <input
          required
          name="price"
          placeholder="Price"
          type="number"
          className="textarea-bordered textarea mb-3 w-full"
        />
        <SubmitFormButton className=" btn-block">
          Add Product{" "}
        </SubmitFormButton>
      </form>
    </>
  );
}
