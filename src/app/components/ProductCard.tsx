import { Product } from "@prisma/client";
import Link from "next/link";
import PriceTag from "./PriceTag";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isNew =
    Date.now() - new Date(product.createdAt).getTime() <
    1000 * 60 * 60 * 24 * 7;

  return (
    <Link
      href={"/products/" + product.id}
      className="card w-full bg-base-100 hover:shadow-xl"
    >
      <figure className="h-48 w-full flex justify-center items-center">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={800}
          height={400}
          className="h-full w-full object-cover"
        />
      </figure>
      <div className="card-body flex flex-col justify-between flex-grow">
        <div>
          <h2 className="card-title">{product.name}</h2>
          {isNew && <div className="badge badge-secondary">NEW</div>}
          <p className="line-clamp-3">{product.description}</p>
        </div>
        <PriceTag price={product.price} />
      </div>
    </Link>
  );
}
