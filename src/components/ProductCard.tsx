
import React from 'react';
import { Heart } from 'lucide-react';
import { Product } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { handleImageError } from '@/lib/supabase';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: 'Removed from Wishlist',
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: 'Added to Wishlist',
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  return (
    <div 
      className="group cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      onClick={() => onViewDetails(product)}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            inWishlist 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-600 hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 group-hover:text-gray-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {product.colors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
            {product.colors.length > 3 && (
              <div className="w-4 h-4 rounded-full border border-gray-300 bg-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-600">+{product.colors.length - 3}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Sizes: {product.sizes.join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
