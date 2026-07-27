import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeSelector: React.FC = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center space-x-1.5 shadow-md ${
        mode === 'dark'
          ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400'
          : 'bg-white hover:bg-slate-100 border-slate-300 text-indigo-600 shadow-sm'
      }`}
      title={mode === 'dark' ? 'Switch to Light Mode (White)' : 'Switch to Dark Mode'}
      aria-label="Toggle Dark and Light Theme"
    >
      {mode === 'dark' ? (
        <>
          <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span className="hidden sm:inline text-xs font-bold text-slate-200">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-indigo-600" />
          <span className="hidden sm:inline text-xs font-bold text-slate-800">Dark</span>
        </>
      )}
    </button>
  );
};
