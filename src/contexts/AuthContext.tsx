
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface AuthContextType {
  user: User | null;
  addresses: Address[];
  isSignInOpen: boolean;
  isSignUpOpen: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  openSignIn: () => void;
  closeSignIn: () => void;
  openSignUp: () => void;
  closeSignUp: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is available
    if (!supabase) {
      console.warn('Supabase not available. Authentication features will be disabled.');
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || session.user.email!.split('@')[0],
          phone: session.user.user_metadata.phone
        });
        fetchAddresses();
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || session.user.email!.split('@')[0],
          phone: session.user.user_metadata.phone
        });
        await fetchAddresses();
      } else {
        setUser(null);
        setAddresses([]);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAddresses = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching addresses:', error);
      return;
    }

    const formattedAddresses: Address[] = data.map(addr => ({
      id: addr.id,
      name: addr.name,
      phone: addr.phone,
      addressLine1: addr.address_line1,
      addressLine2: addr.address_line2,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zip_code,
      isDefault: addr.is_default
    }));

    setAddresses(formattedAddresses);
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase not available');
    }
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setIsSignInOpen(false);
  };

  const signUp = async (name: string, email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase not available');
    }
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    if (error) throw error;
    setIsSignUpOpen(false);
  };

  const signOut = async () => {
    if (!supabase) return;
    
    await supabase.auth.signOut();
    setUser(null);
    setAddresses([]);
  };

  const addAddress = async (addressData: Omit<Address, 'id'>) => {
    if (!user || !supabase) return;

    // If this is the first address or marked as default, set all others to non-default
    if (addressData.isDefault || addresses.length === 0) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
    }

    const { error } = await supabase
      .from('addresses')
      .insert({
        user_id: user.id,
        name: addressData.name,
        phone: addressData.phone,
        address_line1: addressData.addressLine1,
        address_line2: addressData.addressLine2,
        city: addressData.city,
        state: addressData.state,
        zip_code: addressData.zipCode,
        is_default: addressData.isDefault || addresses.length === 0
      });

    if (error) throw error;
    await fetchAddresses();
  };

  const updateAddress = async (id: string, addressData: Partial<Address>) => {
    if (!user || !supabase) return;

    const updateData: any = {};
    if (addressData.name) updateData.name = addressData.name;
    if (addressData.phone) updateData.phone = addressData.phone;
    if (addressData.addressLine1) updateData.address_line1 = addressData.addressLine1;
    if (addressData.addressLine2 !== undefined) updateData.address_line2 = addressData.addressLine2;
    if (addressData.city) updateData.city = addressData.city;
    if (addressData.state) updateData.state = addressData.state;
    if (addressData.zipCode) updateData.zip_code = addressData.zipCode;
    if (addressData.isDefault !== undefined) updateData.is_default = addressData.isDefault;

    // If setting as default, unset all others
    if (addressData.isDefault) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
    }

    const { error } = await supabase
      .from('addresses')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    await fetchAddresses();
  };

  const deleteAddress = async (id: string) => {
    if (!user || !supabase) return;

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    await fetchAddresses();
  };

  const setDefaultAddress = async (id: string) => {
    if (!user || !supabase) return;

    // Unset all addresses as default
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id);

    // Set the selected address as default
    const { error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    await fetchAddresses();
  };

  const openSignIn = () => setIsSignInOpen(true);
  const closeSignIn = () => setIsSignInOpen(false);
  const openSignUp = () => setIsSignUpOpen(true);
  const closeSignUp = () => setIsSignUpOpen(false);

  return (
    <AuthContext.Provider value={{
      user,
      addresses,
      isSignInOpen,
      isSignUpOpen,
      loading,
      signIn,
      signUp,
      signOut,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      openSignIn,
      closeSignIn,
      openSignUp,
      closeSignUp
    }}>
      {children}
    </AuthContext.Provider>
  );
};
