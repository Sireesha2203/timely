import React, { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export default function Navbar({ title = 'Calendar', onToday }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('timely.theme') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('timely.theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }

  return (
    <header className="flex items-center justify-between gap-4 p-4 border-b border-gray-100 bg-white dark:bg-slate-800 dark:border-slate-700 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-gray-100 dark:bg-slate-700 rounded-md px-2 py-1 gap-2">
          <MagnifyingGlassIcon className="h-4 w-4 text-slate-500 dark:text-slate-300" />
          <input className="bg-transparent outline-none text-sm text-slate-900 dark:text-slate-100" placeholder="Search events, people..." />
        </div>

        <button onClick={toggleTheme} title="Toggle theme" className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700">
          {theme === 'dark' ? <SunIcon className="h-5 w-5 text-yellow-400" /> : <MoonIcon className="h-5 w-5 text-slate-600" />}
        </button>
      </div>
    </header>
  )
}
