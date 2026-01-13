
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { User, Topic, HolidayInfo } from './types';
import { DEFAULT_TOPICS, ADMIN_USERS } from './constants';
import TopicSelector from './components/TopicSelector';
import LandingScreen from './components/LandingScreen';
import LoginScreen from './components/LoginScreen';
import AdminLoginScreen from './components/AdminLoginScreen';
import AdminDashboard from './components/AdminDashboard';
import AccessDeniedScreen from './components/AccessDeniedScreen';
import QuizScreen from './components/QuizScreen';
import GameZone from './components/GameZone';
import ImageEditor from './components/ImageEditor';
import FeedbackWidget from './components/FeedbackWidget';
import ThemeToggle from './components/ThemeToggle';
import { getHolidayInfo } from './utils/holidays';
import { BellAlertIcon, MegaphoneIcon, StopIcon, HomeIcon, XMarkIcon } from '@heroicons/react/24/solid';

// Inactivity Time in milliseconds (15 minutes)
const INACTIVITY_LIMIT = 15 * 60 * 1000; 

const VampireIdleScreen: React.FC<{ onWakeUp: () => void }> = ({ onWakeUp }) => {
    const [wakingUp, setWakingUp] = useState(false);

    const handleWake = () => {
        if (wakingUp) return;
        setWakingUp(true);
        // Animation duration matches the CSS transition
        setTimeout(() => {
            onWakeUp();
        }, 1500);
    };

    return (
        <div 
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center cursor-pointer overflow-hidden"
            onClick={handleWake}
            onMouseMove={handleWake}
            onKeyDown={handleWake}
        >
            {!wakingUp ? (
                <div className="text-center animate-pulse">
                    {/* Sleeping Vampire */}
                    <div className="relative">
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/1993/1993286.png" 
                            alt="Vampiro durmiendo" 
                            className="w-64 h-64 object-contain drop-shadow-[0_0_35px_rgba(168,85,247,0.5)]"
                        />
                        <div className="absolute -top-10 right-0 text-4xl text-purple-300 font-bold animate-bounce">
                            Zzz...
                        </div>
                    </div>
                    <h2 className="mt-8 text-3xl font-bold text-purple-300">El vampiro está descansando...</h2>
                    <p className="text-gray-400 mt-2">Toca la pantalla para despertarlo</p>
                </div>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Flying Bat Animation */}
                    <div className="transition-all duration-1000 ease-in-out transform -translate-y-[800px] translate-x-[800px] scale-0 opacity-0">
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/3063/3063183.png" 
                            alt="Murciélago volando" 
                            className="w-48 h-48 object-contain"
                        />
                    </div>
                    <h2 className="absolute bottom-20 text-2xl text-white animate-ping">¡A volar!</h2>
                </div>
            )}
        </div>
    );
};

const EmergencyOverlay: React.FC = () => {
    const [state, setState] = useState<'none' | 'alarm' | 'attention'>('none');
    const [message, setMessage] = useState('');
    const audioCtxRef = useRef<AudioContext | null>(null);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        const checkState = () => {
            const emergencyState = localStorage.getItem('admin_emergency_state') as 'none' | 'alarm' | 'attention' || 'none';
            const broadcastMsg = localStorage.getItem('admin_broadcast_message') || '';
            
            if (emergencyState !== state) {
                setState(emergencyState);
                setMessage(broadcastMsg);

                if (emergencyState === 'alarm') {
                    playAlarmSequence();
                } else if (emergencyState === 'attention') {
                    stopAudio();
                    playTTS(broadcastMsg || "Tu profe real te quiere decir algo.");
                } else {
                    stopAudio();
                    window.speechSynthesis.cancel();
                }
            }
        };

        checkState(); // Initial check
        const interval = setInterval(checkState, 1000); // Poll every second
        return () => {
            clearInterval(interval);
            stopAudio();
            window.speechSynthesis.cancel();
        };
    }, [state]);

    const stopAudio = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (audioCtxRef.current) {
            audioCtxRef.current.close();
            audioCtxRef.current = null;
        }
    };

    const playBeep = (ctx: AudioContext, time: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, time); // High A5
        gain.gain.setValueAtTime(0.5, time);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.2); // 200ms beep
    };

    const playAlarmSequence = () => {
        stopAudio();
        window.speechSynthesis.cancel();
        
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = ctx;

        const scheduleBeeps = () => {
            const now = ctx.currentTime;
            // 3 short beeps
            playBeep(ctx, now);
            playBeep(ctx, now + 0.4);
            playBeep(ctx, now + 0.8);
            
            // Silence
            
            // 3 short beeps
            playBeep(ctx, now + 2.0);
            playBeep(ctx, now + 2.4);
            playBeep(ctx, now + 2.8);
            
            // Silence
            
            // 3 short beeps
            playBeep(ctx, now + 4.0);
            playBeep(ctx, now + 4.4);
            playBeep(ctx, now + 4.8);

            // Voice message after beeps
            setTimeout(() => {
                const utterance = new SpeechSynthesisUtterance("Alarma. Dirígete a la puerta.");
                utterance.rate = 1.1;
                utterance.pitch = 1.2;
                utterance.lang = 'es-ES';
                window.speechSynthesis.speak(utterance);
            }, 5500);
        };

        scheduleBeeps();
        intervalRef.current = window.setInterval(scheduleBeeps, 8000);
    };

    const playTTS = (text: string) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
    };

    const handleClose = () => {
        localStorage.setItem('admin_emergency_state', 'none');
        setState('none');
    };

    if (state === 'none') return null;

    return (
        <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center text-center p-8 animate-fade-in ${state === 'alarm' ? 'bg-red-600 animate-pulse-fast' : 'bg-yellow-500'}`}>
            {state === 'alarm' ? (
                <>
                    <BellAlertIcon className="w-48 h-48 text-white mb-8 animate-shake" />
                    <h1 className="text-6xl md:text-8xl font-black text-white uppercase mb-4 drop-shadow-lg border-4 border-white p-4 rounded">
                        ALARMA
                    </h1>
                    <p className="text-3xl md:text-5xl text-white font-bold uppercase animate-bounce">
                        VE HACIA LA PUERTA INMEDIATAMENTE
                    </p>
                </>
            ) : (
                <>
                    <div className="relative bg-white/90 p-8 rounded-3xl shadow-2xl max-w-4xl w-full border-8 border-yellow-600 flex flex-col items-center">
                        <button 
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 hover:text-red-600 transition-colors z-50"
                            title="Cerrar aviso"
                        >
                            <XMarkIcon className="w-8 h-8" />
                        </button>

                        <div className="flex justify-center mb-6 space-x-4">
                             {/* Avatars */}
                             <div className="relative">
                                <div className="text-6xl bg-blue-200 rounded-full w-24 h-24 flex items-center justify-center border-4 border-blue-400">👨‍🏫</div>
                                <MegaphoneIcon className="w-10 h-10 text-blue-600 absolute -bottom-2 -right-2 transform -rotate-12"/>
                             </div>
                             <div className="text-8xl text-red-600 animate-pulse">🛑</div>
                             <div className="relative">
                                <div className="text-6xl bg-pink-200 rounded-full w-24 h-24 flex items-center justify-center border-4 border-pink-400">👩‍🏫</div>
                                <MegaphoneIcon className="w-10 h-10 text-pink-600 absolute -bottom-2 -left-2 transform rotate-12"/>
                             </div>
                        </div>
                        
                        <h2 className="text-4xl font-black text-gray-800 uppercase mb-4">¡ATENCIÓN!</h2>
                        <p className="text-2xl text-gray-600 font-bold mb-6">Tu profe real te quiere decir algo:</p>
                        
                        <div className="bg-yellow-100 p-6 rounded-xl border-l-8 border-yellow-500 w-full">
                            <p className="text-3xl font-bold text-gray-800 italic">"{message}"</p>
                        </div>
                    </div>
                </>
            )}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                    20%, 40%, 60%, 80% { transform: translateX(10px); }
                }
                .animate-shake { animation: shake 0.5s infinite; }
                .animate-pulse-fast { animation: pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            `}</style>
        </div>
    );
};

const App = () => {
    const [view, setView] = useState<'landing' | 'student_login' | 'admin_login' | 'admin_dashboard' | 'topics' | 'quiz' | 'game_zone' | 'denied' | 'image_editor'>('landing');
    const [user, setUser] = useState<User | null>(null);
    const [topics, setTopics] = useState<Topic[]>(() => {
        const saved = localStorage.getItem('topics');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse topics from localStorage", e);
                localStorage.removeItem('topics'); // Clear corrupted data
                return DEFAULT_TOPICS;
            }
        }
        return DEFAULT_TOPICS;
    });
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [status, setStatus] = useState<'open' | 'closed'>('open');
    const [holiday, setHoliday] = useState<HolidayInfo | null>(null);
    
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme === 'light' || storedTheme === 'dark') {
                return storedTheme;
            }
        }
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    const [isIdle, setIsIdle] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const resetInactivityTimer = () => {
        if (isIdle) return; 
        
        if (timerRef.current) clearTimeout(timerRef.current);
        
        timerRef.current = setTimeout(() => {
            setIsIdle(true);
        }, INACTIVITY_LIMIT);
    };

    useEffect(() => {
        const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'];
        
        const handleActivity = () => resetInactivityTimer();

        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        resetInactivityTimer(); 

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [isIdle]); 

    useEffect(() => {
        setHoliday(getHolidayInfo(new Date()));

        const checkStatus = () => {
            const override = localStorage.getItem('admin_override');
            if (override === 'force_open') {
                setStatus('open');
                return;
            }
            if (override === 'force_closed') {
                setStatus('closed');
                return;
            }

            const now = new Date();
            const hour = now.getHours();
            const day = now.getDay();
            
            const isOpenTime = hour >= 8 && hour < 14;
            const isWeekDay = day >= 1 && day <= 5;
            
            setStatus(isOpenTime && isWeekDay ? 'open' : 'closed');
        };

        checkStatus();
        const interval = setInterval(checkStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleUpdateTopics = (newTopics: Topic[]) => {
        setTopics(newTopics);
        localStorage.setItem('topics', JSON.stringify(newTopics));
    };

    const handleWakeUp = () => {
        setIsIdle(false);
        resetInactivityTimer();
    };

    const handleHomeClick = () => {
        if (user?.isAdmin) {
            setView('admin_dashboard');
        } else {
            setSelectedTopic(null);
            setView('topics');
        }
    };

    const isHomeView = (v: string, isAdmin: boolean) => {
        if (isAdmin) return v === 'admin_dashboard';
        return v === 'topics';
    };

    return (
        <>
            <EmergencyOverlay />
            
            {isIdle && <VampireIdleScreen onWakeUp={handleWakeUp} />}
            
            {view === 'denied' && <AccessDeniedScreen onBack={() => setView('landing')} />}

            {view === 'admin_dashboard' && (
                <AdminDashboard 
                    onBack={() => setView('landing')} 
                    onCloseSession={() => {
                        localStorage.removeItem('admin_current_user');
                        setView('landing');
                    }}
                    currentTopics={topics}
                    onUpdateTopics={handleUpdateTopics}
                    theme={theme}
                    toggleTheme={toggleTheme}
                />
            )}

            {view === 'student_login' && (
                <LoginScreen 
                    onLogin={(name, email, avatar) => {
                        const adminEmails = Object.keys(ADMIN_USERS);
                        const isAdmin = adminEmails.includes(email);
                        
                        setUser({ name, email, avatar, isAdmin });
                        
                        if (status === 'closed' && !isAdmin) {
                            setView('denied');
                        } else {
                            setView('topics');
                        }
                    }} 
                    onBack={() => setView('landing')} 
                />
            )}
            
            {view === 'admin_login' && (
                <AdminLoginScreen onLogin={() => setView('admin_dashboard')} onBack={() => setView('landing')} />
            )}

            {view === 'topics' && user && (
                <TopicSelector 
                    topics={topics} 
                    onSelect={(t) => {
                        setSelectedTopic(t);
                        if (t.id === 'special_game_zone') {
                            setView('game_zone');
                        } else if (t.id === 'special_image_editor') {
                            setView('image_editor');
                        }
                         else {
                            setView('quiz');
                        }
                    }} 
                    holidayContext={holiday} 
                    user={user} 
                    onLogout={() => { setUser(null); setView('landing'); }}
                    theme={theme}
                    toggleTheme={toggleTheme}
                />
            )}

            {view === 'quiz' && selectedTopic && user && (
                <QuizScreen 
                    topic={selectedTopic}
                    user={user}
                    onBack={() => {
                        setSelectedTopic(null);
                        setView('topics');
                    }}
                />
            )}

            {view === 'game_zone' && user && (
                <GameZone 
                    user={user}
                    onBack={() => {
                        setSelectedTopic(null);
                        setView('topics');
                    }}
                />
            )}

            {view === 'image_editor' && user && (
                <ImageEditor
                    onBack={() => {
                        setSelectedTopic(null);
                        setView('topics');
                    }}
                />
            )}
            
            {user && view !== 'admin_dashboard' && view !== 'denied' && <FeedbackWidget />}

            {user && view !== 'landing' && view !== 'denied' && !isHomeView(view, user.isAdmin || false) && (
                <button
                    onClick={handleHomeClick}
                    className="fixed bottom-4 left-4 z-50 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-all hover:scale-110 border-2 border-white dark:border-gray-800 animate-bounce-in"
                    title="Volver a Inicio"
                >
                    <HomeIcon className="w-6 h-6" />
                </button>
            )}

            {view === 'landing' && (
                <LandingScreen onSelectMode={(mode) => setView(mode === 'admin' ? 'admin_login' : 'student_login')} status={status} />
            )}
        </>
    );
};

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
