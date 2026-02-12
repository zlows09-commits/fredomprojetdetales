/*
  # Create Products Table for Freedom Projet PM Store

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text) - Product name
      - `price` (integer) - Price in dollars
      - `category` (text) - Category: zapatillas, ropa_hombre, ropa_mujer, gorras
      - `stock` (integer) - Available stock quantity
      - `sizes` (text array) - Available sizes for the product
      - `image_url` (text) - Product image URL
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access (store is public)
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price integer NOT NULL,
  category text NOT NULL,
  stock integer DEFAULT 10,
  sizes text[] DEFAULT ARRAY[]::text[],
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert initial products
INSERT INTO products (name, price, category, stock, sizes) VALUES
  ('Jordan 4', 150, 'zapatillas', 15, ARRAY['38', '39', '40', '41', '42', '43', '44']),
  ('Jordan 1', 120, 'zapatillas', 20, ARRAY['38', '39', '40', '41', '42', '43', '44']),
  ('Nike Dunk Low', 100, 'zapatillas', 18, ARRAY['38', '39', '40', '41', '42', '43', '44']),
  ('Nike Dunk Low Travis', 150, 'zapatillas', 12, ARRAY['38', '39', '40', '41', '42', '43', '44']),
  ('Adidas Bad Bunny', 150, 'zapatillas', 10, ARRAY['38', '39', '40', '41', '42', '43', '44']),
  ('Remera StreetWear', 100, 'ropa_hombre', 25, ARRAY['S', 'M', 'L', 'XL', 'XXL']),
  ('Pantalones Essentials', 150, 'ropa_hombre', 20, ARRAY['S', 'M', 'L', 'XL', 'XXL']),
  ('Buzo NBA', 150, 'ropa_hombre', 15, ARRAY['S', 'M', 'L', 'XL', 'XXL']),
  ('Buzo Balenciaga', 130, 'ropa_hombre', 18, ARRAY['S', 'M', 'L', 'XL', 'XXL']),
  ('Pantalon NBA', 120, 'ropa_hombre', 22, ARRAY['S', 'M', 'L', 'XL', 'XXL']),
  ('Pantalones Baggys', 120, 'ropa_mujer', 20, ARRAY['XS', 'S', 'M', 'L', 'XL']),
  ('Pantalones Wide Leg Clasicos', 190, 'ropa_mujer', 15, ARRAY['XS', 'S', 'M', 'L', 'XL']),
  ('Blazers', 140, 'ropa_mujer', 12, ARRAY['XS', 'S', 'M', 'L', 'XL']),
  ('Chalecos Sastreros', 100, 'ropa_mujer', 18, ARRAY['XS', 'S', 'M', 'L', 'XL']),
  ('Corsset', 160, 'ropa_mujer', 14, ARRAY['XS', 'S', 'M', 'L', 'XL']),
  ('Gorra Cerrada L.A', 200, 'gorras', 30, ARRAY['Unica']),
  ('Gorra Cerrada N.Y', 190, 'gorras', 25, ARRAY['Unica']),
  ('Gorra Cerrada Red Bull', 250, 'gorras', 20, ARRAY['Unica']),
  ('Gorra Cerrada Golden State Warriors', 195, 'gorras', 22, ARRAY['Unica']);