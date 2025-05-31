
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/contexts/CartContext';

interface DatabaseProduct {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image: string;
  image_id?: string;
  category: string;
  brand: string;
  sizes: string[];
  colors: string[];
  description: string;
  created_at: string;
  updated_at: string;
}

const transformDatabaseProduct = (dbProduct: DatabaseProduct): Product => ({
  id: dbProduct.id,
  name: dbProduct.name,
  price: dbProduct.price,
  originalPrice: dbProduct.original_price,
  image: dbProduct.image,
  category: dbProduct.category,
  brand: dbProduct.brand,
  sizes: dbProduct.sizes,
  colors: dbProduct.colors,
  description: dbProduct.description
});

export const useProducts = () => {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching products from Supabase database');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      console.log('Successfully fetched', data?.length, 'products from database');
      return data.map(transformDatabaseProduct);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    products,
    isLoading,
    error,
    isUsingDatabase: true
  };
};
