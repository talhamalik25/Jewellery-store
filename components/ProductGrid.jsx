import ProductCard from "@/components/ProductCard";

export default function ProductGrid({ products }) {
  return <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
    {products.map((product) => <ProductCard key={product.id} product={product} />)}
  </div>;
}
