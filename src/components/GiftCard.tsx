import type { User } from '@supabase/supabase-js';
import type { Gift } from '../types/gift';

interface GiftCardProps {
    gift: Gift;
    currentUser: User | null;
    onReserve: (gift: Gift) => Promise<void>;
    onCancel: (gift: Gift) => Promise<void>;
}

export function GiftCard({ gift, currentUser, onReserve, onCancel }: GiftCardProps) {
    const isReservedByMe = gift.reserved_by_user_id === currentUser?.id;
    const isReservedByOther = gift.reserved_by_user_id !== null && !isReservedByMe;
    const isAvailable = gift.reserved_by_user_id === null;

    return (
        <div
            className={`
        relative flex flex-col rounded-3xl overflow-hidden shadow-md hover:shadow-xl
        transition-all duration-300 border-2
        ${isReservedByMe ? 'bg-rose-50 border-fuchsia-400 ring-2 ring-fuchsia-300 ring-offset-2' : 'bg-white'}
        ${isReservedByOther ? 'border-gray-200 opacity-80' : ''}
        ${isAvailable ? 'border-pink-200 hover:-translate-y-1' : ''}
      `}
        >
            {/* Badge */}
            {isReservedByMe && (
                <div className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                    ✨ Twój wybór!
                </div>
            )}
            {isReservedByOther && (
                <div className="absolute top-3 left-3 z-10 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    🔒 Zarezerwowane
                </div>
            )}

            {/* Image */}
            <div className="relative w-full aspect-square overflow-hidden bg-rose-50">
                <img
                    src={gift.image_url}
                    alt={gift.name}
                    className={`w-full h-full object-cover transition-transform duration-300 ${isAvailable ? 'group-hover:scale-105' : ''}`}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            'https://placehold.co/400x400/fce7f3/f43f5e?text=🎁';
                    }}
                />
                {isReservedByOther && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4 gap-3">
                <h2 className="text-base font-black text-gray-800 leading-snug line-clamp-2">
                    {gift.name}
                </h2>

                {/* Reservation status */}
                {isReservedByOther && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 rounded-xl px-3 py-2">
                        <span>👤</span>
                        <span className="font-semibold truncate">
                            Wybrane przez <span className="text-gray-700">{gift.reserved_by_name ?? 'kogoś'}</span>
                        </span>
                    </div>
                )}

                {isReservedByMe && (
                    <div className="flex items-center gap-1.5 text-sm text-rose-600 bg-rose-50 rounded-xl px-3 py-2">
                        <span>🎁</span>
                        <span className="font-bold">To Twój prezent!</span>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-col gap-2 mt-auto">
                    {/* Shop link */}
                    {gift.shop_url && (
                        <a
                            href={gift.shop_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 text-sm font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 border border-pink-200 hover:border-pink-300 rounded-2xl px-3 py-2 transition-all duration-200"
                        >
                            <span>🛒</span>
                            <span>Zobacz na Allegro</span>
                            <svg
                                className="w-3 h-3 opacity-60"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            >
                                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                    )}

                    {/* Reserve / Cancel / Disabled buttons */}
                    {isAvailable && currentUser && (
                        <button
                            onClick={() => onReserve(gift)}
                            className="flex items-center justify-center gap-2 w-full bg-linear-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-black rounded-2xl px-4 py-2.5 shadow-md hover:shadow-lg active:scale-95 transition-all duration-200"
                        >
                            🎁 Rezerwuję!
                        </button>
                    )}

                    {isAvailable && !currentUser && (
                        <button
                            disabled
                            title="Zaloguj się, aby zarezerwować"
                            className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-400 font-bold rounded-2xl px-4 py-2.5 cursor-not-allowed border border-dashed border-gray-300"
                        >
                            🔐 Zaloguj się, aby zarezerwować
                        </button>
                    )}

                    {isReservedByMe && (
                        <button
                            onClick={() => onCancel(gift)}
                            className="flex items-center justify-center gap-2 w-full bg-white text-rose-400 hover:text-rose-600 font-bold rounded-2xl px-4 py-2.5 border-2 border-rose-200 hover:border-rose-400 active:scale-95 transition-all duration-200"
                        >
                            ✕ Anuluj rezerwację
                        </button>
                    )}


                </div>
            </div>
        </div>
    );
}
