
import React from 'react';

const Celebration: React.FC = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden flex justify-center items-center">
            {/* Background Flash */}
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>

            {/* Falling Confetti & Emojis */}
            {Array.from({ length: 80 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute"
                    style={{
                        left: `${Math.random() * 100}vw`,
                        top: `-50px`,
                        animation: `fall ${2 + Math.random() * 3}s linear infinite`,
                        animationDelay: `${Math.random() * 5}s`
                    }}
                >
                    <span style={{ 
                        fontSize: `${15 + Math.random() * 25}px`,
                        display: 'block',
                        transform: `rotate(${Math.random() * 360}deg)`,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}>
                        {['🎉', '🎊', '⭐', '✨', '🎈', '🎇', '🍭', '🏆'][Math.floor(Math.random() * 8)]}
                    </span>
                </div>
            ))}
            
            {/* Intense Firework bursts */}
            {Array.from({ length: 5 }).map((_, i) => (
                <div 
                    key={`fw-${i}`}
                    className="absolute animate-ping opacity-75"
                    style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: '1s'
                    }}
                >
                    <span className="text-8xl filter drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]">💥</span>
                </div>
            ))}

            <style>{`
                @keyframes fall {
                    0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default Celebration;
