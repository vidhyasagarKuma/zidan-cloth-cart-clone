
import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Log the environment variables for debugging
console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
  console.log('Available env vars:', Object.keys(import.meta.env));
}

// Create a dummy client if env vars are missing to prevent app crash
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types
export interface DatabaseProduct {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image: string;
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
