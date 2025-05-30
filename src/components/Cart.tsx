
import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart = ({ isOpen, onClose }: CartProps) => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Checkout Successful!",
      description: `Your order of ₹${getTotalPrice()} has been placed successfully.`,
    });
    
    clearCart();
    onClose();
  };

  const handleIncreaseQuantity = (cartItemId: string, currentQuantity: number) => {
    updateQuantity(cartItemId, currentQuantity + 1);
  };

  const handleDecreaseQuantity = (cartItemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(cartItemId, currentQuantity - 1);
    } else {
      removeFromCart(cartItemId);
    }
  };

  const handleRemoveItem = (cartItemId: string) => {
    removeFromCart(cartItemId);
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              {/* Header */}
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                  <div className="ml-3 h-7 flex items-center">
                    <button
                      onClick={onClose}
                      className="bg-white rounded-md text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="mt-8">
                  <div className="flow-root">
                    {cartItems.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingBag className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                        <p className="mt-1 text-sm text-gray-500">Start shopping to add items to your cart.</p>
                      </div>
                    ) : (
                      <ul className="-my-6 divide-y divide-gray-200">
                        {cartItems.map((item) => (
                          <li key={item.cartItemId} className="py-6 flex">
                            <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3 className="text-sm">{item.name}</h3>
                                  <p className="ml-4">₹{item.price}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">{item.brand}</p>
                                <p className="mt-1 text-xs text-gray-500">
                                  Size: {item.selectedSize} | Color: {item.selectedColor}
                                </p>
                              </div>
                              <div className="flex-1 flex items-end justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleDecreaseQuantity(item.cartItemId, item.quantity)}
                                    className="p-1 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="text-gray-500 min-w-[60px] text-center">Qty {item.quantity}</span>
                                  <button
                                    onClick={() => handleIncreaseQuantity(item.cartItemId, item.quantity)}
                                    className="p-1 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                <div className="flex">
                                  <button
                                    onClick={() => handleRemoveItem(item.cartItemId)}
                                    className="font-medium text-red-600 hover:text-red-500 transition-colors"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>₹{getTotalPrice()}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-6">
                    <button 
                      onClick={handleCheckout}
                      className="w-full bg-black border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-800 transition-colors"
                    >
                      Checkout
                    </button>
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={() => {
                        clearCart();
                        toast({
                          title: "Cart cleared",
                          description: "All items have been removed from your cart.",
                        });
                      }}
                      className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-8 flex items-center justify-center text-sm font-medium text-gray-900 hover:bg-gray-200 transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                    <p>
                      or{' '}
                      <button
                        onClick={onClose}
                        className="text-black font-medium hover:text-gray-800 transition-colors"
                      >
                        Continue Shopping<span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
