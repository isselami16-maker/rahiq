/*
# RAHIQ Parfums — Delivery Prices Table

Dedicated table for per-wilaya delivery pricing.
Wilayas and municipalities are now sourced from src/lib/algeria.ts (static).
Only delivery prices remain in the database.
*/

CREATE TABLE IF NOT EXISTS delivery_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wilaya_code text UNIQUE NOT NULL,
  home_delivery_price integer NOT NULL DEFAULT 600,
  office_delivery_price integer NOT NULL DEFAULT 400,
  free_delivery boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE delivery_prices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_delivery_prices" ON delivery_prices;
CREATE POLICY "anon_select_delivery_prices" ON delivery_prices FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_delivery_prices" ON delivery_prices;
CREATE POLICY "anon_insert_delivery_prices" ON delivery_prices FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_delivery_prices" ON delivery_prices;
CREATE POLICY "anon_update_delivery_prices" ON delivery_prices FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_delivery_prices" ON delivery_prices;
CREATE POLICY "anon_delete_delivery_prices" ON delivery_prices FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS delivery_prices_wilaya_code_idx ON delivery_prices(wilaya_code);

-- Seed all 58 wilayas with existing prices
INSERT INTO delivery_prices (wilaya_code, home_delivery_price, office_delivery_price, free_delivery) VALUES
  ('01', 600, 400, false),
  ('02', 600, 400, false),
  ('03', 600, 400, false),
  ('04', 600, 400, false),
  ('05', 600, 400, false),
  ('06', 600, 400, false),
  ('07', 600, 400, false),
  ('08', 600, 400, false),
  ('09', 600, 400, false),
  ('10', 600, 400, false),
  ('11', 1000, 700, false),
  ('12', 600, 400, false),
  ('13', 600, 400, false),
  ('14', 600, 400, false),
  ('15', 600, 400, false),
  ('16', 400, 250, false),
  ('17', 600, 400, false),
  ('18', 600, 400, false),
  ('19', 600, 400, false),
  ('20', 600, 400, false),
  ('21', 600, 400, false),
  ('22', 600, 400, false),
  ('23', 600, 400, false),
  ('24', 600, 400, false),
  ('25', 600, 400, false),
  ('26', 600, 400, false),
  ('27', 600, 400, false),
  ('28', 600, 400, false),
  ('29', 600, 400, false),
  ('30', 600, 400, false),
  ('31', 600, 400, false),
  ('32', 600, 400, false),
  ('33', 1200, 800, false),
  ('34', 600, 400, false),
  ('35', 600, 400, false),
  ('36', 600, 400, false),
  ('37', 1200, 800, false),
  ('38', 600, 400, false),
  ('39', 600, 400, false),
  ('40', 600, 400, false),
  ('41', 600, 400, false),
  ('42', 600, 400, false),
  ('43', 600, 400, false),
  ('44', 600, 400, false),
  ('45', 600, 400, false),
  ('46', 600, 400, false),
  ('47', 600, 400, false),
  ('48', 600, 400, false),
  ('49', 800, 550, false),
  ('50', 1200, 800, false),
  ('51', 600, 400, false),
  ('52', 800, 550, false),
  ('53', 1200, 800, false),
  ('54', 1200, 800, false),
  ('55', 600, 400, false),
  ('56', 1200, 800, false),
  ('57', 600, 400, false),
  ('58', 800, 550, false)
ON CONFLICT (wilaya_code) DO NOTHING;

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_delivery_prices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS delivery_prices_updated_at ON delivery_prices;
CREATE TRIGGER delivery_prices_updated_at
  BEFORE UPDATE ON delivery_prices
  FOR EACH ROW EXECUTE FUNCTION update_delivery_prices_updated_at();
