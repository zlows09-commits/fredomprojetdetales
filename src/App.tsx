import { useEffect, useState } from 'react';
import { Menu, X, Instagram, Facebook, Twitter, Phone } from 'lucide-react';
import { supabase } from './lib/supabase';
import { Product, Category } from './types';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
      setFilteredProducts(data || []);
    }
    setIsLoading(false);
  };

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleSizeConfirm = (size: string) => {
    if (selectedProduct) {
      const message = `Hola! Me interesa comprar:\n\n*${selectedProduct.name}*\nTalla: ${size}\nPrecio: $${selectedProduct.price}\n\n¿Está disponible?`;
      const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      setSelectedProduct(null);
    }
  };

  const categories = [
    { id: 'all', name: 'Todo', emoji: '🔥' },
    { id: 'zapatillas', name: 'Zapatillas', emoji: '👟' },
    { id: 'ropa_hombre', name: 'Hombre', emoji: '👔' },
    { id: 'ropa_mujer', name: 'Mujer', emoji: '👗' },
    { id: 'gorras', name: 'Gorras', emoji: '🧢' },
  ];

  const getCategoryTitle = () => {
    const category = categories.find(c => c.id === selectedCategory);
    return category ? category.name : 'Todos los productos';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white sticky top-0 z-40 shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-3">
              <div className="bg-white text-black w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl transform hover:rotate-6 transition-transform">
                F
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Freedom Projet PM</h1>
                <p className="text-xs text-gray-400 tracking-wider">SNEAKER & STREETWEAR STORE</p>
              </div>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <nav className="hidden lg:flex items-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as Category)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-white text-black scale-105'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <span className="mr-2">{category.emoji}</span>
                  {category.name}
                </button>
              ))}
            </nav>
          </div>

          {isMenuOpen && (
            <nav className="lg:hidden pb-6 space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id as Category);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-white text-black'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-2">{category.emoji}</span>
                  {category.name}
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            {getCategoryTitle()}
          </h2>
          <p className="text-xl text-gray-600">
            Descubre las últimas tendencias en Freedom Projet PM
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-black"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuyClick={handleBuyClick}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">No hay productos disponibles en esta categoría</p>
          </div>
        )}
      </main>

      <section className="bg-black text-white py-20 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Conecta con nosotros</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Síguenos en nuestras redes sociales para estar al día con las últimas novedades y ofertas exclusivas
          </p>

          <div className="flex justify-center gap-6 mb-12">
            <a
              href="https://www.instagram.com/freedom_project_pm/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-2xl hover:scale-110 transition-transform duration-300"
            >
              <Instagram className="w-10 h-10" />
            </a>
            <a
              href="https://www.facebook.com/Fredoomproject2025/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 p-6 rounded-2xl hover:scale-110 transition-transform duration-300"
            >
              <Facebook className="w-10 h-10" />
            </a>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 p-6 rounded-2xl hover:scale-110 transition-transform duration-300"
            >
              <Phone className="w-10 h-10" />
            </a>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400">
              2024 Freedom Projet PM - Todos Derechos de Autor
            </p>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onConfirm={handleSizeConfirm}
        />
      )}
    </div>
  );
}

export default App;
