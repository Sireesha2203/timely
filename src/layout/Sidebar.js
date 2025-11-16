import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, CalendarIcon, DocumentTextIcon, ClockIcon, GlobeAltIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { usePomodoro } from '../context/PomodoroContext';

const items = [
  { to: '/', label: 'Dashboard', icon: HomeIcon },
  { to: '/calendar', label: 'Calendar', icon: CalendarIcon },
  { to: '/events', label: 'Events', icon: DocumentTextIcon },
  { to: '/pomodoro', label: 'Pomodoro', icon: ClockIcon },
  { to: '/world-clock', label: 'World Clock', icon: GlobeAltIcon },
  { to: '/settings', label: 'Settings', icon: Cog6ToothIcon },
]

function NavItem({ to, label, Icon }){
  return (
    <NavLink to={to} end className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 ${isActive? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400':'text-slate-700 dark:text-slate-300'}`}>
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  )
}

export default function Sidebar() {
  const { isRunning, formatTime, timeLeft, mode } = usePomodoro();

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700 min-h-screen flex flex-col justify-between transition-colors duration-300">
      <div>
        <div className="px-4 py-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold">T</div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">Timely</div>
            <div className="text-xs text-slate-400 dark:text-slate-500">Calendar App</div>
          </div>
        </div>

        {/* Pomodoro Timer Indicator */}
        {isRunning && (
          <div className="mx-3 mb-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-2 mb-1">
              <ClockIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              <span className="text-xs font-medium text-indigo-900 dark:text-indigo-300">
                {mode === 'work' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </span>
            </div>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {formatTime(timeLeft)}
            </div>
          </div>
        )}

        <nav className="px-3 space-y-1">
          {items.map(i=> <NavItem key={i.to} to={i.to} label={i.label} Icon={i.icon} />)}
        </nav>
      </div>

      <div className="px-4 py-6 border-t border-gray-100 dark:border-slate-700">
        <div className="text-xs text-slate-400 dark:text-slate-500">© 2025 Timely</div>
      </div>
    </aside>
  )
}
