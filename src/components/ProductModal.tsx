
import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Product, useCart } from '@/contexts/CartContext';
import { handleImageError } from '@/lib/supabase';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, selectedColor);
    }
    
    alert('Added to cart successfully!');
    onClose();
  };

  // Function to get image based on selected color
  const getColorBasedImage = () => {
    if (!selectedColor || !product.image.startsWith('/images/')) {
      return product.image;
    }
    
    // Extract base image name from the path
    const imagePath = product.image.replace('/images/', '');
    const baseImageName = imagePath.split('.')[0];
    const extension = imagePath.split('.').pop() || 'jpg';
    const colorSuffix = selectedColor.toLowerCase().replace(/\s+/g, '-');
    
    // Try to load color-specific image, fallback to original if not available
    return `/images/${baseImageName}-${colorSuffix}.${extension}`;
  };

  // Function to get color display style
  const getColorStyle = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'White': '#FFFFFF',
      'Black': '#000000',
      'Navy': '#000080',
      'Gray': '#808080',
      'Grey': '#808080',
      'Blue': '#0000FF',
      'Red': '#FF0000',
      'Green': '#008000',
      'Pink': '#FFC0CB',
      'Light Blue': '#ADD8E6',
      'Brown': '#A52A2A',
      'Tan': '#D2B48C',
      'Khaki': '#F0E68C',
      'Olive': '#808000',
      'Maroon': '#800000',
      'Burgundy': '#800020',
      'Silver': '#C0C0C0',
      'Gold': '#FFD700',
      'Yellow': '#FFFF00',
      'Orange': '#FFA500',
      'Purple': '#800080',
      'Violet': '#8A2BE2',
      'Nude': '#F5E6D3',
      'Champagne': '#F7E7CE',
      'Lavender': '#E6E6FA',
      'Charcoal': '#36454F'
    };
    
    return colorMap[color] || color.toLowerCase();
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex">
            {/* Product Image */}
            <div className="flex-1 aspect-square">
              <img
                src={getColorBasedImage()}
                alt={`${product.name} in ${selectedColor || 'default color'}`}
                className="w-full h-full object-cover transition-all duration-300"
                onError={(e) => {
                  // Fallback to original image if color-specific image fails to load
                  const target = e.target as HTMLImageElement;
                  if (target.src !== product.image) {
                    target.src = product.image;
                  } else {
                    handleImageError(e);
                  }
                }}
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                  <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`p-2 text-sm border rounded transition-colors ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        console.log('Color selected:', color);
                        setSelectedColor(color);
                      }}
                      className={`w-10 h-10 rounded-full border-2 transition-all relative ${
                        selectedColor === color
                          ? 'border-black scale-110 ring-2 ring-offset-2 ring-black'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ 
                        backgroundColor: getColorStyle(color),
                        border: color.toLowerCase() === 'white' ? '2px solid #e5e7eb' : undefined
                      }}
                      title={color}
                    >
                      {selectedColor === color && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`w-2 h-2 rounded-full ${
                            color.toLowerCase() === 'white' || color.toLowerCase() === 'yellow' 
                              ? 'bg-black' 
                              : 'bg-white'
                          }`} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-sm text-gray-600 mt-2">Selected: {selectedColor}</p>
                )}
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 rounded-full border border-gray-300 hover:border-gray-400 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 rounded-full border border-gray-300 hover:border-gray-400 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
