import { X } from 'lucide-react';
import { Product } from '../types';
import { useState } from 'react';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onConfirm: (size: string) => void;
}

export default function ProductModal({ product, onClose, onConfirm }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');

  const handleConfirm = () => {
    if (selectedSize) {
      onConfirm(selectedSize);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
        <p className="text-3xl font-bold text-black mb-6">${product.price}</p>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Selecciona tu talla:
          </label>
          <div className="grid grid-cols-4 gap-3">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                  selectedSize === size
                    ? 'bg-black text-white scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selectedSize}
          className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
            selectedSize
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Confirmar y enviar WhatsApp
        </button>
      </div>
    </div>
  );
}
