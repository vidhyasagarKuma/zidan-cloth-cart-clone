
import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, User, Heart, MapPin } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import Cart from './Cart';
import Wishlist from './Wishlist';
import SignInModal from './SignInModal';
import SignUpModal from './SignUpModal';
import AddressModal from './AddressModal';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onCategoryChange: (category: string) => void;
  onSearchChange: (search: string) => void;
}

const Header = ({ onCategoryChange, onSearchChange }: HeaderProps) => {
  const { getTotalItems } = useCart();
  const { user, signOut, openSignIn, addresses } = useAuth();
  const { wishlistItems } = useWishlist();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const categories = ['All', 'Shirts', 'T-Shirts', 'Jeans', 'Jackets', 'Dresses', 'Shoes', 'Accessories'];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearchChange('');
  };

  const defaultAddress = addresses.find(addr => addr.isDefault);

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-black">ZIDAN</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className="text-gray-600 hover:text-black transition-colors font-medium"
                >
                  {category}
                </button>
              ))}
            </nav>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden sm:flex relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent w-64"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Address Indicator */}
              {user && defaultAddress && (
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="hidden md:flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="max-w-20 truncate">{defaultAddress.city}</span>
                </button>
              )}

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                  >
                    <User className="w-6 h-6" />
                    <span className="hidden md:block text-sm">{user.name}</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                      <div className="p-2">
                        <div className="px-3 py-2 text-sm text-gray-500">
                          {user.email}
                        </div>
                        <button
                          onClick={() => {
                            setIsAddressModalOpen(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                        >
                          Manage Addresses
                        </button>
                        <button
                          onClick={() => {
                            signOut();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded text-red-600"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  onClick={openSignIn}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-black"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden md:block ml-1">Sign In</span>
                </Button>
              )}

              {/* Wishlist */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative text-gray-600 hover:text-black transition-colors"
              >
                <Heart className="w-6 h-6" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-600 hover:text-black transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Mobile Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-gray-600 hover:text-black transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      onCategoryChange(category);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Wishlist isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      <SignInModal />
      <SignUpModal />
      <AddressModal 
        isOpen={isAddressModalOpen} 
        onClose={() => setIsAddressModalOpen(false)} 
      />
    </>
  );
};

export default Header;
