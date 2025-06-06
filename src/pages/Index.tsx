import React, { useState, useMemo } from 'react';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import Header from '@/components/Header';
import ProductGrid from '@/components/ProductGrid';
import ProductModal from '@/components/ProductModal';
import { Toaster } from '@/components/ui/toaster';
import { Product } from '@/contexts/CartContext';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, ArrowRight, Star, Shield, Truck, HeartHandshake } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');

  const { products, isLoading, error, isUsingDatabase } = useProducts();

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' || 
                           product.name.toLowerCase().includes(searchLower) ||
                           product.brand.toLowerCase().includes(searchLower) ||
                           product.category.toLowerCase().includes(searchLower) ||
                           product.description.toLowerCase().includes(searchLower);
      
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSearchChange = (search: string) => {
    console.log('Search query changed to:', search);
    setSearchQuery(search);
  };

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreClick = () => {
    setSelectedCategory('All');
    scrollToProducts();
  };

  // Hero carousel images
  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2070&q=80",
      title: "Premium Fashion",
      subtitle: "Curated for Excellence"
    },
    {
      url: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=2071&q=80",
      title: "Modern Style",
      subtitle: "Timeless Elegance"
    },
    {
      url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2070&q=80",
      title: "Urban Collection",
      subtitle: "Contemporary Design"
    }
  ];

  if (isLoading) {
    return (
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-200 border-t-black mx-auto"></div>
                  <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-black animate-pulse" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">Loading your premium collection</p>
                  <p className="text-sm text-gray-500">Curating the finest fashion pieces for you</p>
                </div>
              </div>
            </div>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    );
  }

  if (error) {
    return (
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
              <div className="text-center space-y-6 max-w-md mx-auto px-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">Something went wrong</h2>
                  <p className="text-gray-600">We couldn't load the collection. Please try again.</p>
                  <p className="text-sm text-red-600">{error.message}</p>
                </div>
                <Button 
                  onClick={() => window.location.reload()}
                  className="bg-black text-white hover:bg-gray-800 px-6 py-2"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <div className="min-h-screen bg-white">
            <Header 
              onCategoryChange={setSelectedCategory}
              onSearchChange={handleSearchChange}
            />
            
            {/* Hero Section with Carousel */}
            <section className="relative overflow-hidden">
              <Carousel className="w-full">
                <CarouselContent>
                  {heroImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
                        <div 
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
                          style={{ backgroundImage: `url(${image.url})` }}
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        
                        <div className="relative z-10 flex items-center justify-center h-full">
                          <div className="text-center text-white space-y-8 max-w-4xl mx-auto px-4">
                            <div className="space-y-4">
                              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                <Sparkles className="h-4 w-4 text-yellow-400" />
                                <span className="text-sm font-medium">Premium Fashion Collection</span>
                              </div>
                              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight">
                                <span className="block">Welcome to</span>
                                <span className="block bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                                  ZIDAN
                                </span>
                              </h1>
                              <div className="space-y-2">
                                <p className="text-2xl sm:text-3xl font-semibold text-yellow-400">
                                  {image.title}
                                </p>
                                <p className="text-lg sm:text-xl text-gray-300">
                                  {image.subtitle}
                                </p>
                              </div>
                              <p className="max-w-2xl mx-auto text-xl sm:text-2xl text-gray-300 leading-relaxed">
                                Discover premium fashion that defines your style. 
                                <span className="block mt-2 text-lg opacity-90">Curated collections for the modern individual.</span>
                              </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                              <Button 
                                onClick={handleExploreClick}
                                size="lg"
                                className="bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-full font-medium text-lg group"
                              >
                                Explore Collection
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                              </Button>
                              <Button 
                                variant="outline"
                                size="lg"
                                className="border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full font-medium text-lg"
                              >
                                View Lookbook
                              </Button>
                            </div>

                            <div className="inline-flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-green-500/30">
                              <Star className="h-4 w-4 text-green-400" />
                              <span className="text-sm font-medium text-green-200">Static Collection - No Database Required</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Decorative Elements */}
                        <div className="absolute top-20 left-10 w-20 h-20 border border-white/20 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-20 right-10 w-32 h-32 border border-white/10 rounded-full animate-pulse delay-1000"></div>
                        <div className="absolute top-1/2 left-20 w-2 h-2 bg-white/40 rounded-full animate-ping delay-500"></div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-8 bg-white/20 border-white/30 text-white hover:bg-white/30" />
                <CarouselNext className="right-8 bg-white/20 border-white/30 text-white hover:bg-white/30" />
              </Carousel>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gradient-to-r from-gray-50 to-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center space-y-4 group">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Truck className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Free Shipping</h3>
                    <p className="text-gray-600">Complimentary shipping on all orders over ₹2,000</p>
                  </div>
                  <div className="text-center space-y-4 group">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Quality Guarantee</h3>
                    <p className="text-gray-600">Premium materials and craftsmanship in every piece</p>
                  </div>
                  <div className="text-center space-y-4 group">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <HeartHandshake className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Easy Returns</h3>
                    <p className="text-gray-600">30-day hassle-free returns and exchanges</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Products Section */}
            <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 space-y-6 lg:space-y-0">
                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    {searchQuery ? (
                      <>Search results for <span className="text-black">"{searchQuery}"</span></>
                    ) : selectedCategory === 'All' ? (
                      'Our Premium Collection'
                    ) : (
                      selectedCategory
                    )}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'} available
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-700">4.8 Average Rating</span>
                  </div>
                </div>
              </div>

              <ProductGrid 
                products={filteredProducts}
                onViewDetails={handleViewDetails}
              />
            </section>

            {/* Newsletter Section */}
            <section className="bg-gradient-to-r from-gray-900 to-black text-white py-24">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl sm:text-5xl font-bold">Stay in Style</h2>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    Be the first to know about our latest collections, exclusive offers, 
                    and fashion insights from our curators.
                  </p>
                </div>
                
                <div className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-full px-6 py-4"
                    />
                    <Button 
                      className="bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-full font-medium whitespace-nowrap"
                    >
                      Subscribe
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400 mt-3">
                    Join 50,000+ fashion enthusiasts. Unsubscribe anytime.
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">ZIDAN</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Premium fashion brand delivering quality and style since inception. 
                      Crafting timeless pieces for the modern wardrobe.
                    </p>
                    <div className="flex space-x-4">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                        <span className="text-sm font-bold">f</span>
                      </div>
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                        <span className="text-sm font-bold">ig</span>
                      </div>
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                        <span className="text-sm font-bold">tw</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Shop</h4>
                    <ul className="space-y-3">
                      {['Men', 'Women', 'Accessories', 'New Arrivals', 'Sale'].map((item) => (
                        <li key={item}>
                          <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Support</h4>
                    <ul className="space-y-3">
                      {['Contact Us', 'Size Guide', 'Returns & Exchanges', 'Shipping Info', 'FAQ'].map((item) => (
                        <li key={item}>
                          <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Company</h4>
                    <ul className="space-y-3">
                      {['About Us', 'Careers', 'Press', 'Sustainability', 'Privacy Policy'].map((item) => (
                        <li key={item}>
                          <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                  <p className="text-gray-400 text-sm">
                    &copy; 2024 Zidan. All rights reserved. Made with ♥ for fashion lovers.
                  </p>
                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Cookies</a>
                  </div>
                </div>
              </div>
            </footer>

            <ProductModal
              product={selectedProduct}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
            />
            
            <Toaster />
          </div>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
};

export default Index;
