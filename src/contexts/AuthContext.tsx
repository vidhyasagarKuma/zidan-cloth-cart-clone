
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
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

  const signIn = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      phone: '+1234567890'
    };
    
    setUser(mockUser);
    setIsSignInOpen(false);
  };

  const signUp = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      email,
      name,
    };
    
    setUser(mockUser);
    setIsSignUpOpen(false);
  };

  const signOut = () => {
    setUser(null);
    setAddresses([]);
  };

  const addAddress = (addressData: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...addressData,
      id: Date.now().toString(),
      isDefault: addresses.length === 0 ? true : addressData.isDefault
    };
    
    if (newAddress.isDefault) {
      setAddresses(prev => 
        [...prev.map(addr => ({ ...addr, isDefault: false })), newAddress]
      );
    } else {
      setAddresses(prev => [...prev, newAddress]);
    }
  };

  const updateAddress = (id: string, addressData: Partial<Address>) => {
    setAddresses(prev =>
      prev.map(addr => 
        addr.id === id ? { ...addr, ...addressData } : addr
      )
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev =>
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }))
    );
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
