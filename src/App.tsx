import { useEffect, useState, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './lib/supabaseClient';
import type { Gift } from './types/gift';
import { Header } from './components/Header';
import { GiftGrid } from './components/GiftGrid';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [giftsLoading, setGiftsLoading] = useState(true);

  // --- Auth ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // --- Fetch gifts ---
  const fetchGifts = useCallback(async () => {
    setGiftsLoading(true);
    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setGifts(data as Gift[]);
    }
    setGiftsLoading(false);
  }, []);

  useEffect(() => {
    fetchGifts();
  }, [fetchGifts]);

  // --- Realtime subscription ---
  useEffect(() => {
    const channel = supabase
      .channel('gifts-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gifts' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setGifts((prev) =>
              prev.map((g) => (g.id === payload.new.id ? (payload.new as Gift) : g))
            );
          } else if (payload.eventType === 'INSERT') {
            setGifts((prev) => [...prev, payload.new as Gift]);
          } else if (payload.eventType === 'DELETE') {
            setGifts((prev) => prev.filter((g) => g.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // --- Reserve ---
  const handleReserve = useCallback(
    async (gift: Gift) => {
      if (!user) return;

      const displayName =
        user.user_metadata?.full_name ?? user.email ?? 'Nieznany';

      const { error } = await supabase
        .from('gifts')
        .update({
          reserved_by_user_id: user.id,
          reserved_by_name: displayName,
        })
        .eq('id', gift.id)
        .is('reserved_by_user_id', null); // Safety check: only if still NULL

      if (error) {
        console.error('Reserve error:', error.message);
        // Refetch to sync state
        await fetchGifts();
      }
    },
    [user, fetchGifts]
  );

  // --- Cancel reservation ---
  const handleCancel = useCallback(
    async (gift: Gift) => {
      if (!user) return;

      const { error } = await supabase
        .from('gifts')
        .update({
          reserved_by_user_id: null,
          reserved_by_name: null,
        })
        .eq('id', gift.id)
        .eq('reserved_by_user_id', user.id); // Only own reservation

      if (error) {
        console.error('Cancel error:', error.message);
        await fetchGifts();
      }
    },
    [user, fetchGifts]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} isLoading={authLoading} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {/* Decorative heading */}
        <div className="text-center mb-8">
          <p className="text-4xl mb-2">🎀🎈🎉</p>
          <h2 className="text-xl md:text-2xl font-black text-fuchsia-500">
            Wybierz prezent dla Michalinki!
          </h2>
          <p className="text-sm text-pink-400 mt-1 font-semibold">
            Kliknij „Rezerwuję" i spraw, żeby jej urodziny były wyjątkowe 💖
          </p>
          {!user && !authLoading && (
            <p className="text-xs text-gray-400 mt-2 bg-rose-50 rounded-full inline-block px-4 py-1 border border-rose-100">
              🔐 Zaloguj się przez Google, aby zarezerwować prezent
            </p>
          )}
        </div>

        <GiftGrid
          gifts={gifts}
          currentUser={user}
          isLoading={giftsLoading}
          onReserve={handleReserve}
          onCancel={handleCancel}
        />
      </main>

      <footer className="text-center py-6 text-xs text-pink-300 font-semibold">
        🎂 Michalinka 6. Urodziny 🎂 • zrobione z ❤️
      </footer>
    </div>
  );
}
