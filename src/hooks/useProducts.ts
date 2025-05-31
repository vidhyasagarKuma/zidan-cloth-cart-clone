
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase, DatabaseProduct, getImageUrl } from '@/lib/supabase';
import { Product } from '@/contexts/CartContext';

const transformDatabaseProduct = (dbProduct: DatabaseProduct): Product => ({
  id: dbProduct.id,
  name: dbProduct.name,
  price: dbProduct.price,
  originalPrice: dbProduct.original_price,
  image: dbProduct.image_id ? getImageUrl(dbProduct.image_id) : dbProduct.image,
  category: dbProduct.category,
  brand: dbProduct.brand,
  sizes: dbProduct.sizes,
  colors: dbProduct.colors,
  description: dbProduct.description
});

export const useProducts = () => {
  const [fallbackProducts, setFallbackProducts] = useState<Product[]>([]);

  // Load fallback products from local data if Supabase is not available
  useEffect(() => {
    if (!supabase) {
      import('@/data/products').then(({ products }) => {
        setFallbackProducts(products);
      });
    }
  }, []);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      if (!supabase) {
        console.log('Using fallback products data');
        return fallbackProducts;
      }

      console.log('Fetching products from database');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      return data.map(transformDatabaseProduct);
    },
    enabled: supabase ? true : fallbackProducts.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    products,
    isLoading,
    error,
    isUsingDatabase: !!supabase
  };
};
