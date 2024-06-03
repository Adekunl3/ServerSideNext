import Image from "next/image";
import { prisma } from "@/app/lib/db/prisma";
import ProductCard from "./components/ProductCard";
import Link from "next/link";
import Pagination from "./components/Pagination";



interface HomeProps {
  searchParams: { page: string };
}

export default async function Home({
  searchParams: { page = "1" },
}: HomeProps) {
  const currentPage = parseInt(page);

  const pageSize = 6;
  const heroItemCount = 1;

  const totalItemCount = await prisma.product.count();

  const totalPages = Math.ceil((totalItemCount - heroItemCount) / pageSize);

  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "desc" },
      skip:
        (currentPage - 1) * pageSize + (currentPage === 1 ? 0 : heroItemCount),
      take: pageSize + (currentPage === 1 ? heroItemCount : 0),
    });

    return (
      <div className="flex flex-col items-center">
        {currentPage === 1 && (
          <div className="hero rounded-xl bg-base-200">
            <div className="hero-content flex-col lg:flex-row">
              <Image
                src={products[0].imageUrl}
                alt={products[0].name}
                width={400}
                height={800}
                className="w-full max-w-sm rounded-lg shadow-2xl"
                priority
              />
              <div>
                <h1 className="text-4xl font-bold">{products[0].name}</h1>
                <p className="py-6">{products[0].description} </p>
                <Link
                  href={"/products/" + products[0].id}
                  className="btn-primary btn"
                >
                  check it out
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(currentPage === 1 ? products.slice(1) : products).map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return (
      <div>
        Error fetching products, ensure you have good internet connection
      </div>
    );
  }
}
