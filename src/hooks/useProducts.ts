
import { useMemo } from 'react';
import { Product } from '@/contexts/CartContext';
import { products as staticProducts } from '@/data/products';

const transformStaticProduct = (product: Product): Product => ({
  id: product.id,
  name: product.name,
  price: product.price,
  originalPrice: product.originalPrice,
  image: product.image,
  category: product.category,
  brand: product.brand,
  sizes: product.sizes,
  colors: product.colors,
  description: product.description
});

export const useProducts = () => {
  const products = useMemo(() => {
    console.log('Using static products data');
    return staticProducts.map(transformStaticProduct);
  }, []);

  return {
    products,
    isLoading: false,
    error: null,
    isUsingDatabase: false
  };
};
