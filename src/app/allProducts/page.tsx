import { prisma } from '@/app/lib/db/prisma';
import ProductCard from '@/app/components/ProductCard';
import Link from 'next/link';
import Pagination from '@/app/components/Pagination';

const PAGE_SIZE = 5;

export default async function AllProducts({ searchParams }: { searchParams: any }) {
  const currentPage = parseInt(searchParams.page) || 1;
  const skip = (currentPage - 1) * PAGE_SIZE;

  const [products, totalItemCount] = await Promise.all([
    prisma.product.findMany({
      orderBy: { id: 'desc' },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.product.count(),
  ]);

  const totalPages = Math.ceil(totalItemCount / PAGE_SIZE);

  return (
    <div className="container mx-auto  ">
    <h1 className="text-4xl font-bold my-8">All Products</h1>
    <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <ProductCard product={product} />
        </Link>
      ))}
    </div>
    <div className="flex justify-center mt-8">
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  </div>
  
  );
}
