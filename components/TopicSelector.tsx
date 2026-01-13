import React, { useState, useEffect } from 'react';
import { User, Topic, HolidayInfo } from '../types.ts';
import { ArrowRightOnRectangleIcon, LockClosedIcon, ClockIcon, PaperAirplaneIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import ThemeToggle from './ThemeToggle.tsx';
import { requestAccess, checkUserAccess } from '../utils/classGameLogic.ts';


interface Props {
    topics: Topic[];
    onSelect: (topic: Topic) => void;
    holidayContext: HolidayInfo | null;
    user: User;
    onLogout: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

type GameZoneStatus = 'locked' | 'requested' | 'approved';

const TopicSelector: React.FC<Props> = ({ topics, onSelect, holidayContext, user, onLogout, theme, toggleTheme }) => {
    const [gameZoneStatus, setGameZoneStatus] = useState<GameZoneStatus>('locked');

    useEffect(() => {
        if (user.isAdmin) {
            setGameZoneStatus('approved');
            return;
        }

        const checkStatus = () => {
            const status = checkUserAccess(user.email);
            setGameZoneStatus(status);
        };

        checkStatus(); // Initial check
        const interval = setInterval(checkStatus, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [user.email, user.isAdmin]);

    const handleRequestAccess = () => {
        requestAccess(user.email);
        setGameZoneStatus('requested');
    };

    const handleGameZoneClick = () => {
        if (gameZoneStatus === 'approved') {
            const gameZoneTopic = topics.find(t => t.id === 'special_game_zone');
            if (gameZoneTopic) {
                onSelect(gameZoneTopic);
            }
        } else if (gameZoneStatus === 'locked') {
            handleRequestAccess();
        }
        // If 'requested', button is disabled and does nothing.
    };

    const getGameZoneContent = () => {
        switch (gameZoneStatus) {
            case 'locked':
                return (
                    <>
                        <h3 className="text-xl font-bold mb-2 text-purple-800 dark:text-purple-300">Game Zone</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">{topics.find(t => t.id === 'special_game_zone')?.description}</p>
                        <span className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-full font-bold text-sm shadow-lg">
                            <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                            Solicitar Acceso
                        </span>
                    </>
                );
            case 'requested':
                 return (
                    <>
                        <h3 className="text-xl font-bold mb-2 text-purple-800 dark:text-purple-300">Game Zone</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">Tu solicitud ha sido enviada.</p>
                        <span className="flex items-center justify-center px-4 py-2 bg-gray-400 text-white rounded-full font-bold text-sm cursor-wait">
                            <ClockIcon className="w-4 h-4 mr-2 animate-spin" />
                            Esperando Aprobación...
                        </span>
                    </>
                );
            case 'approved':
                return (
                    <>
                        <h3 className="text-xl font-bold mb-2 text-purple-800 dark:text-purple-300">Game Zone</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">¡El profe te ha dado acceso!</p>
                        <span className="flex items-center justify-center px-6 py-2 bg-green-500 text-white rounded-full font-bold text-sm shadow-lg animate-bounce">
                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                            ¡Jugar!
                        </span>
                    </>
                );
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-4">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                    <div>
                        <h1 className="font-bold text-gray-800 dark:text-white">{user.name}</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.isAdmin ? 'Administrador' : 'Alumno'}</p>
                    </div>
                </div>

                {holidayContext?.isHoliday && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                        🎉 {holidayContext.name}
                    </span>
                )}

                <div className="flex items-center gap-4">
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                    <button onClick={onLogout} className="text-gray-600 dark:text-gray-300 hover:text-red-500" title="Cerrar Sesión">
                        <ArrowRightOnRectangleIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>
            
            <main className="max-w-4xl mx-auto p-6">
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">¿Qué quieres repasar hoy?</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {topics.map((topic) => {
                        const isGameZone = topic.id === 'special_game_zone';

                        return (
                            <button
                                key={topic.id}
                                onClick={isGameZone ? handleGameZoneClick : () => onSelect(topic)}
                                disabled={isGameZone && gameZoneStatus === 'requested'}
                                className={`
                                    flex flex-col items-center p-6 rounded-xl shadow-sm border text-left transition-all
                                    hover:shadow-md hover:scale-105 opacity-90 hover:opacity-100
                                    ${isGameZone 
                                        ? `bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-purple-200 dark:border-purple-800 ${gameZoneStatus === 'requested' ? 'cursor-wait' : 'cursor-pointer'}`
                                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-pointer'
                                    }
                                `}
                            >
                                {isGameZone ? (
                                    getGameZoneContent()
                                ) : (
                                    <>
                                        <div className="relative text-4xl mb-4">
                                            {topic.icon}
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                                            {topic.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{topic.description}</p>
                                    </>
                                )}
                            </button>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default TopicSelector;