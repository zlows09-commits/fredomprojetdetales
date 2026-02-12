export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  sizes: string[];
  image_url?: string;
  created_at: string;
}

export type Category = 'zapatillas' | 'ropa_hombre' | 'ropa_mujer' | 'gorras' | 'all';
