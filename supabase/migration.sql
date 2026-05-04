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
DROP POLICY IF EXISTS "Anyone can read gifts" ON public.gifts;
CREATE POLICY "Anyone can read gifts"
  ON public.gifts
  FOR SELECT
  USING (true);

-- 4. Policy: Authenticated user can reserve a gift (only if not already reserved)
DROP POLICY IF EXISTS "Authenticated user can reserve available gift" ON public.gifts;
CREATE POLICY "Authenticated user can reserve available gift"
  ON public.gifts
  FOR UPDATE
  TO authenticated
  USING (reserved_by_user_id IS NULL)
  WITH CHECK (reserved_by_user_id = auth.uid());

-- 5. Policy: Authenticated user can cancel their OWN reservation
DROP POLICY IF EXISTS "Authenticated user can cancel own reservation" ON public.gifts;
CREATE POLICY "Authenticated user can cancel own reservation"
  ON public.gifts
  FOR UPDATE
  TO authenticated
  USING (reserved_by_user_id = auth.uid())
  WITH CHECK (reserved_by_user_id IS NULL);

-- 6. Enable Realtime for the gifts table
-- (Zapewnia, że Realtime jest włączony, nie rzuca błędem jeśli już jest)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'gifts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.gifts;
  END IF;
END $$;

-- ============================================================
-- GIFT DATA — Real list provided by the user
-- ============================================================
TRUNCATE public.gifts;
INSERT INTO public.gifts (name, image_url, shop_url) VALUES
('Kicia Kocia ratuje boisko', '/gifts/kicia-kocia-ratuje-boisko.jpeg', 'https://allegro.pl/oferta/kicia-kocia-ratuje-boisko-anita-glowinska-18486955623'),
('Kamienie sensoryczne dla dzieci zestaw 5 szt.', '/gifts/fizjo.jpeg', 'https://4fizjo.pl/projector.php?product=1997'),
('Rainbow High - Modna Lalka z Zestawem Slime i Zwierzątkiem - Amaya (Tęczowa)', '/gifts/rainbow-tecza.jpeg', 'https://www.amazon.pl/dp/B0CLVJ568P'),
('Milly Mally Hobby Koń na Kiju White', '/gifts/kon.jpeg', 'https://allegro.pl/oferta/milly-mally-hobby-kon-na-kiju-white-18337264828'),
('ZESTAW DO MALOWANIA TWARZY UNICORN SNAZAROO', '/gifts/snazaro.jpeg', 'https://allegro.pl/oferta/zestaw-do-malowania-twarzy-unicorn-snazaroo-18119195689'),
('Kicia Kocia gra Zgadnij kto to', '/gifts/zgadnij-kto-to.jpeg', 'https://allegro.pl/oferta/kicia-kocia-gra-zgadnij-kto-to-gra-w-zgadywanie-dla-dzieci-6-lat-18147962478'),
('LEGO Friends 42689 Klub Przyjaciół w Miasteczku Heartlake', '/gifts/lego.jpeg', 'https://allegro.pl/oferta/lego-friends-42689-klub-przyjaciol-w-miasteczku-heartlake-18209900299'),
('Smiki My 1st Super Guitar Gitara', '/gifts/gitara.jpeg', 'https://www.smyk.com/p/smiki-my-1st-super-guitar-gitara-i6010309'),
('Rainbow High - Modna Lalka z Zestawem Slime i Zwierzątkiem - Skyler (Niebieska)', '/gifts/rainbow.jpeg', 'https://www.amazon.pl/dp/B0CLVKBNJM'),
('JUŻ WIEM JAK ALBIK ALBI', '/gifts/albik.jpeg', 'https://allegro.pl/oferta/czytaj-z-albikiem-ksiazka-interaktywna-mowiaca-juz-wiem-jak-albik-albi-18459653658'),
('Tablet graficzny do rysowania z szablonami Kidydraw Mini Kidywolf - Kawai', '/gifts/tablet.jpeg', 'https://www.tublu.pl/zabawki-edukacyjne/zabawki-plastyczne/tablet-graficzny-do-rysowania-z-szablonami-kidydraw-mini-kidywolf-kawai.html'),
('Wkłady uzupełniające do tabletu Kidydraw Mini Kidywolf - Gry i edukacja 60 szt.', '/gifts/kidwolf.jpeg', 'https://www.tublu.pl/zabawki-edukacyjne/zabawki-plastyczne/wklady-uzupelniajace-do-tabletu-kidydraw-mini-kidywolf-gry-i-edukacja-60-szt.html'),
('Zestaw disco karaoke MOB na 2 mikrofony z projektorem różowy', '/gifts/mikrofon.jpeg', 'https://www.tublu.pl/zabawki-edukacyjne/instrumenty-muzyczne/zestaw-disco-karaoke-mob-na-2-mikrofony-z-projektorem-rozowy.html');
