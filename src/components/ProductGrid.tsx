
import React from 'react';
import { Product } from '@/contexts/CartContext';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
}

const ProductGrid = ({ products, onViewDetails }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
