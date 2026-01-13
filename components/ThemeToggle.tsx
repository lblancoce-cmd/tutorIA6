import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

interface Props {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const ThemeToggle: React.FC<Props> = ({ theme, toggleTheme }) => {
    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-gray-800 transition-colors"
            title={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
        >
            {theme === 'light' ? (
                <MoonIcon className="w-6 h-6" />
            ) : (
                <SunIcon className="w-6 h-6 text-yellow-400" />
            )}
        </button>
    );
};

export default ThemeToggle;
