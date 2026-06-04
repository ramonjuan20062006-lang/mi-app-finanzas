/*
  # Add plans table and premium_features config

  1. New Tables
    - `plans`
      - `id` (uuid, primary key)
      - `name` (text) — plan display name
      - `price` (numeric) — monthly price in USD
      - `discount` (numeric) — percentage discount 0-100
      - `description` (text)
      - `features` (text[]) — list of feature strings
      - `is_active` (boolean)
      - `created_at` (timestamptz)
    - `premium_features`
      - `id` (text, primary key) — feature slug e.g. 'estadisticas'
      - `label` (text)
      - `requires_premium` (boolean)
      - `updated_at` (timestamptz)

  2. Seed default plans and features
  3. Security: plans and premium_features are public read, admin-only write (via service role edge function)
*/

CREATE TABLE IF NOT EXISTS plans (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  price       numeric NOT NULL DEFAULT 0,
  discount    numeric NOT NULL DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
  description text DEFAULT '',
  features    text[] DEFAULT '{}',
  is_active   boolean DEFAULT true,
  sort_order  integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read plans"
  ON plans FOR SELECT TO authenticated USING (true);

-- Insert default plans
INSERT INTO plans (name, price, discount, description, features, sort_order) VALUES
  ('Básico', 0, 0, 'Ideal para empezar tu negocio', ARRAY['Registrar ventas', 'Registrar gastos', 'Control de deudas', 'Inventario básico'], 1),
  ('Pro', 9.99, 0, 'Para negocios en crecimiento', ARRAY['Todo lo del plan Básico', 'Estadísticas avanzadas', 'Clientes y proveedores', 'Empleados', 'Catálogo virtual', 'Cotizaciones', 'Reportes descargables'], 2),
  ('Empresarial', 19.99, 20, 'Solución completa para tu empresa', ARRAY['Todo lo del plan Pro', 'Multi-sucursal', 'API access', 'Soporte prioritario 24/7', 'Tickets de venta personalizados'], 3)
ON CONFLICT DO NOTHING;

-- Premium features config
CREATE TABLE IF NOT EXISTS premium_features (
  id               text PRIMARY KEY,
  label            text NOT NULL,
  requires_premium boolean DEFAULT true,
  updated_at       timestamptz DEFAULT now()
);

ALTER TABLE premium_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read premium_features"
  ON premium_features FOR SELECT TO authenticated USING (true);

INSERT INTO premium_features (id, label, requires_premium) VALUES
  ('catalogo',     'Catálogo Virtual',  false),
  ('cotizaciones', 'Cotizaciones',      false),
  ('deudas',       'Deudas',            false),
  ('estadisticas', 'Estadísticas',      true),
  ('clientes',     'Clientes',          true),
  ('proveedores',  'Proveedores',       true),
  ('empleados',    'Empleados',         true)
ON CONFLICT DO NOTHING;
