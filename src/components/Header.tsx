import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { LoginButton } from './LoginButton';

interface HeaderProps {
    user: User | null;
    isLoading: boolean;
}

export function Header({ user, isLoading }: HeaderProps) {
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 border-b border-sky-200 shadow-sm">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-2xl md:text-3xl select-none">👑</span>
                    <div className="min-w-0">
                        <h1 className="text-lg md:text-2xl font-black text-sky-600 leading-tight truncate">
                            Lista prezentów Michalinki
                        </h1>
                        <p className="text-xs md:text-sm text-blue-400 font-semibold hidden sm:block">
                            ✨ 6. Urodziny Księżniczki ✨
                        </p>
                    </div>
                </div>

                <div className="shrink-0">
                    {isLoading ? (
                        <div className="h-9 w-36 bg-sky-100 rounded-full animate-pulse" />
                    ) : user ? (
                        <div className="flex items-center gap-2">
                            <div className="hidden sm:flex items-center gap-2 bg-sky-50 rounded-full px-3 py-1 border border-sky-200">
                                {user.user_metadata?.avatar_url && (
                                    <img
                                        src={user.user_metadata.avatar_url}
                                        alt="avatar"
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                )}
                                <span className="text-sm font-bold text-sky-600 max-w-[120px] truncate">
                                    {user.user_metadata?.full_name ?? user.email}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-bold text-gray-500 hover:text-sky-500 px-3 py-1.5 rounded-full border border-gray-200 hover:border-sky-300 transition-all duration-200"
                            >
                                Wyloguj
                            </button>
                        </div>
                    ) : (
                        <LoginButton isLoading={isLoading} />
                    )}
                </div>
            </div>
        </header>
    );
}
