import { useEffect, useState } from 'react';

interface ThankYouModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ThankYouModal({ isOpen, onClose }: ThankYouModalProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Tiny delay so CSS transition fires after mount
            requestAnimationFrame(() => setVisible(true));
        } else {
            setVisible(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-300 ${visible ? 'bg-black/40 backdrop-blur-sm' : 'bg-black/0'
                }`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center
          border-4 border-sky-300 transition-all duration-500
          ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-8'}`}
            >
                {/* Confetti emoji row */}
                <div className="text-4xl mb-1 animate-bounce select-none">👑</div>
                <div className="flex justify-center gap-2 text-2xl mb-4 select-none">
                    <span style={{ animationDelay: '0ms' }} className="inline-block animate-bounce">🏰</span>
                    <span style={{ animationDelay: '150ms' }} className="inline-block animate-bounce">👸</span>
                    <span style={{ animationDelay: '300ms' }} className="inline-block animate-bounce">✨</span>
                    <span style={{ animationDelay: '450ms' }} className="inline-block animate-bounce">💎</span>
                    <span style={{ animationDelay: '600ms' }} className="inline-block animate-bounce">❄️</span>
                </div>

                <h2 className="text-2xl font-black text-sky-600 mb-2 leading-snug">
                    Dziękujemy! 💖
                </h2>
                <p className="text-lg font-bold text-blue-500 mb-1">
                    Księżniczka będzie przeszczęśliwa!
                </p>
                <p className="text-sm text-gray-400 mb-6">
                    Twoja rezerwacja została zapisana 🎂
                </p>

                <button
                    onClick={onClose}
                    className="w-full bg-linear-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600
            text-white font-black rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
                >
                    Super! 👸
                </button>
            </div>
        </div>
    );
}
