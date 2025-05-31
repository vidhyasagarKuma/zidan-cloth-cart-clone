
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://vwhrruvcjrytkeecrbuw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3aHJydXZjanJ5dGtlZWNyYnV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NzMwNDMsImV4cCI6MjA2NDI0OTA0M30.XjE2dfEngx5C50_zqTvdnGOfPvto6Z996FQvN0cfA8A";

console.log('Supabase connected successfully');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get image URL from local folder
export const getImageUrl = (imageId: string): string => {
  if (!imageId) {
    // Fallback to placeholder image if no imageId
    return `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80`;
  }
  
  // Use images from public/images folder
  return `/images/${imageId}`;
};

// Database types
export interface DatabaseProduct {
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

export interface DatabaseAddress {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseCartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  selected_size: string;
  selected_color: string;
  created_at: string;
  updated_at: string;
  products: DatabaseProduct;
}

export interface DatabaseWishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  products: DatabaseProduct;
}
