-- ============================================================
-- Michalinka Wish List — Supabase SQL Migration
-- Wklej ten skrypt do Supabase > SQL Editor i uruchom.
-- ============================================================

-- 1. Create the gifts table
CREATE TABLE IF NOT EXISTS public.gifts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL,
  image_url        text NOT NULL DEFAULT '',
  shop_url         text NOT NULL DEFAULT '',
  reserved_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reserved_by_name text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Everyone can read gifts
CREATE POLICY "Anyone can read gifts"
  ON public.gifts
  FOR SELECT
  USING (true);

-- 4. Policy: Authenticated user can reserve a gift (only if not already reserved)
CREATE POLICY "Authenticated user can reserve available gift"
  ON public.gifts
  FOR UPDATE
  TO authenticated
  USING (reserved_by_user_id IS NULL)
  WITH CHECK (reserved_by_user_id = auth.uid());

-- 5. Policy: Authenticated user can cancel their OWN reservation
CREATE POLICY "Authenticated user can cancel own reservation"
  ON public.gifts
  FOR UPDATE
  TO authenticated
  USING (reserved_by_user_id = auth.uid())
  WITH CHECK (reserved_by_user_id IS NULL);

-- 6. Enable Realtime for the gifts table
-- (Run in Supabase Dashboard → Database → Replication → enable gifts table,
--  OR run the statement below)
ALTER PUBLICATION supabase_realtime ADD TABLE public.gifts;

-- ============================================================
-- SAMPLE DATA — usuń lub dostosuj przed wdrożeniem
-- ============================================================
INSERT INTO public.gifts (name, image_url, shop_url) VALUES
  (
    'Lalka Barbie z akcesoriami',
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop',
    'https://allegro.pl/listing?string=barbie+lalka'
  ),
  (
    'Zestaw LEGO Friends',
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop',
    'https://allegro.pl/listing?string=lego+friends'
  ),
  (
    'Hulajnoga elektryczna dla dzieci',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    'https://allegro.pl/listing?string=hulajnoga+elektryczna+dziecko'
  ),
  (
    'Zestaw do malowania i rysowania',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
    'https://allegro.pl/listing?string=zestaw+do+rysowania+dzieci'
  ),
  (
    'Gra planszowa Dobble',
    'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&h=400&fit=crop',
    'https://allegro.pl/listing?string=dobble+gra+planszowa'
  ),
  (
    'Rowerek biegowy',
    'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop',
    'https://allegro.pl/listing?string=rowerek+biegowy'
  );
