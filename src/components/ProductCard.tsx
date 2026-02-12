import { ShoppingBag, Package } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onBuyClick: (product: Product) => void;
}

export default function ProductCard({ product, onBuyClick }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative h-72 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Package className="w-24 h-24 text-gray-300 group-hover:scale-110 transition-transform duration-300" />
        </div>
        {product.stock < 5 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Solo {product.stock} disponibles
          </div>
        )}
        {product.stock >= 15 && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Stock disponible
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-black transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl font-bold text-black">
            ${product.price}
          </span>
          <span className="text-sm text-gray-500">
            Stock: {product.stock}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Tallas disponibles:</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.slice(0, 5).map((size) => (
              <span
                key={size}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                +{product.sizes.length - 5}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => onBuyClick(product)}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2 group"
        >
          <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Pedir por WhatsApp
        </button>
      </div>
    </div>
  );
}
