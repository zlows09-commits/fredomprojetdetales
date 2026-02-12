import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
  { id: 'all', name: 'Todo', emoji: '🔥' },
  { id: 'zapatillas', name: 'Zapatillas', emoji: '👟' },
  { id: 'ropa_hombre', name: 'Hombre', emoji: '👔' },
  { id: 'ropa_mujer', name: 'Mujer', emoji: '👗' },
  { id: 'gorras', name: 'Gorras', emoji: '🧢' },
];

let allProducts = [];
let selectedCategory = 'all';
let selectedProduct = null;
let selectedSize = '';

const DOM = {
  desktopNav: document.getElementById('desktopNav'),
  mobileNav: document.getElementById('mobileNav'),
  menuBtn: document.getElementById('menuBtn'),
  menuIcon: document.getElementById('menuIcon'),
  closeIcon: document.getElementById('closeIcon'),
  categoryTitle: document.getElementById('categoryTitle'),
  loadingSpinner: document.getElementById('loadingSpinner'),
  productsGrid: document.getElementById('productsGrid'),
  emptyState: document.getElementById('emptyState'),
  productModal: document.getElementById('productModal'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  modalTitle: document.getElementById('modalTitle'),
  modalPrice: document.getElementById('modalPrice'),
  sizeButtons: document.getElementById('sizeButtons'),
  confirmBtn: document.getElementById('confirmBtn'),
};

function renderNavigationButtons() {
  const navHTML = categories.map(category => `
    <button
      data-category="${category.id}"
      class="category-btn px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
        selectedCategory === category.id
          ? 'bg-white text-black scale-105'
          : 'hover:bg-gray-800'
      }"
    >
      <span class="mr-2">${category.emoji}</span>
      ${category.name}
    </button>
  `).join('');

  DOM.desktopNav.innerHTML = navHTML;
  DOM.mobileNav.innerHTML = navHTML;

  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      selectedCategory = e.currentTarget.dataset.category;
      DOM.mobileNav.classList.add('hidden');
      DOM.menuIcon.classList.remove('hidden');
      DOM.closeIcon.classList.add('hidden');
      renderNavigationButtons();
      renderProducts();
    });
  });
}

function updateCategoryTitle() {
  const category = categories.find(c => c.id === selectedCategory);
  DOM.categoryTitle.textContent = category ? category.name : 'Todos los productos';
}

async function fetchProducts() {
  DOM.loadingSpinner.classList.remove('hidden');
  DOM.productsGrid.classList.add('hidden');
  DOM.emptyState.classList.add('hidden');

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
      allProducts = [];
    } else {
      allProducts = data || [];
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    allProducts = [];
  }

  DOM.loadingSpinner.classList.add('hidden');
  renderProducts();
}

function renderProducts() {
  updateCategoryTitle();

  const filteredProducts = selectedCategory === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === selectedCategory);

  if (filteredProducts.length === 0) {
    DOM.productsGrid.classList.add('hidden');
    DOM.emptyState.classList.remove('hidden');
    return;
  }

  const productsHTML = filteredProducts.map(product => `
    <div class="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div class="relative h-72 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <div class="absolute inset-0 flex items-center justify-center">
          <svg class="w-24 h-24 text-gray-300 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
        </div>
        ${product.stock < 5 ? `
          <div class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Solo ${product.stock} disponibles
          </div>
        ` : product.stock >= 15 ? `
          <div class="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Stock disponible
          </div>
        ` : ''}
      </div>

      <div class="p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-2 group-hover:text-black transition-colors">
          ${product.name}
        </h3>

        <div class="flex items-center justify-between mb-4">
          <span class="text-3xl font-bold text-black">
            $${product.price}
          </span>
          <span class="text-sm text-gray-500">
            Stock: ${product.stock}
          </span>
        </div>

        <div class="mb-4">
          <p class="text-xs text-gray-500 mb-2">Tallas disponibles:</p>
          <div class="flex flex-wrap gap-2">
            ${product.sizes.slice(0, 5).map(size => `
              <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                ${size}
              </span>
            `).join('')}
            ${product.sizes.length > 5 ? `
              <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                +${product.sizes.length - 5}
              </span>
            ` : ''}
          </div>
        </div>

        <button
          class="buy-btn w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2 group"
          data-product-id="${product.id}"
        >
          <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          Pedir por WhatsApp
        </button>
      </div>
    </div>
  `).join('');

  DOM.productsGrid.innerHTML = productsHTML;
  DOM.productsGrid.classList.remove('hidden');
  DOM.emptyState.classList.add('hidden');

  document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = e.currentTarget.dataset.productId;
      selectedProduct = allProducts.find(p => p.id === productId);
      selectedSize = '';
      openModal();
    });
  });
}

function openModal() {
  if (!selectedProduct) return;

  DOM.modalTitle.textContent = selectedProduct.name;
  DOM.modalPrice.textContent = `$${selectedProduct.price}`;

  const sizeHTML = selectedProduct.sizes.map(size => `
    <button
      class="size-btn py-3 px-4 rounded-xl font-semibold transition-all duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
      data-size="${size}"
    >
      ${size}
    </button>
  `).join('');

  DOM.sizeButtons.innerHTML = sizeHTML;

  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.size-btn').forEach(b => {
        b.classList.remove('bg-black', 'text-white', 'scale-105');
        b.classList.add('bg-gray-100', 'text-gray-700');
      });
      e.currentTarget.classList.add('bg-black', 'text-white', 'scale-105');
      e.currentTarget.classList.remove('bg-gray-100', 'text-gray-700');
      selectedSize = e.currentTarget.dataset.size;
      updateConfirmButton();
    });
  });

  DOM.productModal.classList.remove('hidden');
}

function closeModal() {
  DOM.productModal.classList.add('hidden');
  selectedProduct = null;
  selectedSize = '';
}

function updateConfirmButton() {
  if (selectedSize) {
    DOM.confirmBtn.disabled = false;
    DOM.confirmBtn.classList.remove('bg-gray-200', 'text-gray-400', 'cursor-not-allowed');
    DOM.confirmBtn.classList.add('bg-black', 'text-white', 'hover:bg-gray-800');
  } else {
    DOM.confirmBtn.disabled = true;
    DOM.confirmBtn.classList.add('bg-gray-200', 'text-gray-400', 'cursor-not-allowed');
    DOM.confirmBtn.classList.remove('bg-black', 'text-white', 'hover:bg-gray-800');
  }
}

function handleConfirm() {
  if (!selectedProduct || !selectedSize) return;

  const message = `Hola! Me interesa comprar:\n\n*${selectedProduct.name}*\nTalla: ${selectedSize}\nPrecio: $${selectedProduct.price}\n\n¿Está disponible?`;
  const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
  closeModal();
}

function setupEventListeners() {
  DOM.menuBtn.addEventListener('click', () => {
    const isHidden = DOM.mobileNav.classList.contains('hidden');
    if (isHidden) {
      DOM.mobileNav.classList.remove('hidden');
      DOM.menuIcon.classList.add('hidden');
      DOM.closeIcon.classList.remove('hidden');
    } else {
      DOM.mobileNav.classList.add('hidden');
      DOM.menuIcon.classList.remove('hidden');
      DOM.closeIcon.classList.add('hidden');
    }
  });

  DOM.closeModalBtn.addEventListener('click', closeModal);
  DOM.confirmBtn.addEventListener('click', handleConfirm);

  DOM.productModal.addEventListener('click', (e) => {
    if (e.target === DOM.productModal) {
      closeModal();
    }
  });
}

function init() {
  renderNavigationButtons();
  setupEventListeners();
  fetchProducts();
}

init();
