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
    <NavLink 
      to={to} 
      end 
      className={({isActive}) => `
        flex items-center gap-3 px-3 py-2.5 rounded-lg 
        transition-all duration-200 group
        hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50
        dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30
        hover:shadow-sm hover:scale-[1.02]
        ${isActive
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/50' 
          : 'text-slate-700 dark:text-slate-300'
        }
      `}
    >
      <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110`} />
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  )
}

export default function Sidebar() {
  const { isRunning, formatTime, timeLeft, mode } = usePomodoro();

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200/50 dark:border-slate-700/50 min-h-screen flex flex-col justify-between transition-all duration-300 shadow-lg dark:shadow-slate-900/50">
      <div>
        <div className="px-4 py-6 flex items-center gap-3 slide-left">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 hover:scale-110 transition-transform duration-300 cursor-pointer">
            T
          </div>
          <div>
            <div className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Timely
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Calendar & Productivity</div>
          </div>
        </div>

        {/* Pomodoro Timer Indicator */}
        {isRunning && (
          <div className="mx-3 mb-3 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm card-enter">
            <div className="flex items-center gap-2 mb-1">
              <div className="relative">
                <ClockIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <div className="absolute inset-0 animate-ping">
                  <ClockIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400 opacity-75" />
                </div>
              </div>
              <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">
                {mode === 'work' ? '🎯 Focus Time' : mode === 'shortBreak' ? '☕ Short Break' : '🌟 Long Break'}
              </span>
            </div>
            <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {formatTime(timeLeft)}
            </div>
          </div>
        )}

        <nav className="px-3 space-y-1.5">
          {items.map((i, index)=> (
            <div key={i.to} style={{ animationDelay: `${index * 0.05}s` }} className="slide-left">
              <NavItem to={i.to} label={i.label} Icon={i.icon} />
            </div>
          ))}
        </nav>
      </div>

      <div className="px-4 py-6 border-t border-gray-200/50 dark:border-slate-700/50">
        <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2">
          <span>© 2025 Timely</span>
          <span className="animate-pulse">❤️</span>
        </div>
      </div>
    </aside>
  )
}
