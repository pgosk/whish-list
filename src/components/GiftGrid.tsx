import type { User } from '@supabase/supabase-js';
import type { Gift } from '../types/gift';
import { GiftCard } from './GiftCard';

interface GiftGridProps {
    gifts: Gift[];
    currentUser: User | null;
    isLoading: boolean;
    onReserve: (gift: Gift) => Promise<void>;
    onCancel: (gift: Gift) => Promise<void>;
}

function SkeletonCard() {
    return (
        <div className="rounded-3xl overflow-hidden border-2 border-sky-100 bg-white shadow-md animate-pulse">
            <div className="aspect-square bg-sky-100" />
            <div className="p-4 flex flex-col gap-3">
                <div className="h-4 bg-sky-100 rounded-full w-3/4" />
                <div className="h-4 bg-sky-50 rounded-full w-1/2" />
                <div className="h-10 bg-sky-100 rounded-2xl mt-auto" />
            </div>
        </div>
    );
}

export function GiftGrid({ gifts, currentUser, isLoading, onReserve, onCancel }: GiftGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    if (gifts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-6xl mb-4">🎈</span>
                <h2 className="text-2xl font-black text-rose-400">Brak prezentów</h2>
                <p className="text-gray-400 mt-2">Lista jest pusta. Dodaj prezenty w bazie danych.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {gifts.map((gift) => (
                <GiftCard
                    key={gift.id}
                    gift={gift}
                    currentUser={currentUser}
                    onReserve={onReserve}
                    onCancel={onCancel}
                />
            ))}
        </div>
    );
}
