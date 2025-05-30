
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Heart, Plus } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface WishlistProps {
  isOpen: boolean;
  onClose: () => void;
}

const Wishlist = ({ isOpen, onClose }: WishlistProps) => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: any) => {
    addToCart(product, product.sizes[0], product.colors[0]);
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    toast({
      title: 'Removed from Wishlist',
      description: 'Item has been removed from your wishlist.',
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            My Wishlist ({wishlistItems.length})
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-4 max-h-96 overflow-y-auto">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Your wishlist is empty</p>
              <p className="text-sm text-gray-400">Add items you love to save them for later</p>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.brand}</p>
                    <p className="font-bold">${item.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add to Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default Wishlist;
