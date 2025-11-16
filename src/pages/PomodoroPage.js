import React, { useState } from 'react'
import { PlayIcon, PauseIcon, ArrowPathIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { usePomodoro } from '../context/PomodoroContext'

export default function PomodoroPage() {
  const {
    timeLeft,
    isRunning,
    mode,
    sessionsCompleted,
    toggleTimer,
    resetTimer,
    switchMode,
    requestNotificationPermission,
    formatTime,
    progress,
  } = usePomodoro()

  const [showAbout, setShowAbout] = useState(false)

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between slide-left">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Pomodoro Timer
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              🎯 Stay focused with the Pomodoro Technique
            </p>
          </div>
          <button
            onClick={() => setShowAbout(!showAbout)}
            className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 hover:shadow-lg transition-all duration-300 hover:scale-110 border border-indigo-200/50 dark:border-indigo-800/50"
            title="About Pomodoro Technique"
          >
            <QuestionMarkCircleIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </button>
        </div>

        {/* About Section (Collapsible) */}
        {showAbout && (
          <div className="mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl shadow-lg p-6 border border-indigo-200/50 dark:border-indigo-800/50 card-enter">
            <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
              <span className="text-2xl">🍅</span>
              About Pomodoro Technique
            </h2>
            <div className="space-y-3 text-sm text-indigo-800 dark:text-indigo-200">
              <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                <span className="text-xl">�</span>
                <div>
                  <strong>Work Session:</strong> 25 minutes of focused work
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                <span className="text-xl">☕</span>
                <div>
                  <strong>Short Break:</strong> 5 minutes to recharge
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                <span className="text-xl">🌴</span>
                <div>
                  <strong>Long Break:</strong> 15 minutes after 4 work sessions
                </div>
              </div>
              <p className="mt-4 text-xs text-center italic">
                The Pomodoro Technique helps you stay focused and productive by breaking work into intervals.
              </p>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-white to-indigo-50/30 dark:from-slate-800 dark:to-indigo-900/10 rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-indigo-100 dark:border-slate-700/50 card-enter">
          {/* Mode Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => switchMode('work')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base shadow-md hover:shadow-lg hover:scale-105 ${
              mode === 'work'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-200 dark:shadow-indigo-900/50'
                : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-600'
            }`}
          >
            🎯 Work
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base shadow-md hover:shadow-lg hover:scale-105 ${
              mode === 'shortBreak'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-green-200 dark:shadow-green-900/50'
                : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-600'
            }`}
          >
            ☕ Short Break
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base shadow-md hover:shadow-lg hover:scale-105 ${
              mode === 'longBreak'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-blue-200 dark:shadow-blue-900/50'
                : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-600'
            }`}
          >
            🌴 Long Break
          </button>
        </div>

        {/* Timer Display */}
        <div className="relative mb-10 flex justify-center">
          {/* Circular Progress */}
          <div className="relative w-56 h-56 sm:w-72 sm:h-72">
            {/* Outer glow ring */}
            <div className={`absolute inset-0 rounded-full blur-2xl opacity-30 ${
              mode === 'work' ? 'bg-indigo-400' : mode === 'shortBreak' ? 'bg-green-400' : 'bg-blue-400'
            }`}></div>
            
            <svg className="transform -rotate-90 w-full h-full relative z-10">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-gray-100 dark:text-slate-700/50"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke="url(#gradient)"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress() / 100)}`}
                className="transition-all duration-1000"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={mode === 'work' ? '#667eea' : mode === 'shortBreak' ? '#10b981' : '#3b82f6'} />
                  <stop offset="100%" stopColor={mode === 'work' ? '#764ba2' : mode === 'shortBreak' ? '#059669' : '#1d4ed8'} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-5xl sm:text-7xl font-bold mb-3 ${
                  isRunning ? 'animate-pulse' : ''
                }`}>
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <div className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-semibold capitalize">
                  {mode === 'work' ? '🎯 Focus Time' : mode === 'shortBreak' ? '☕ Short Break' : '🌴 Long Break'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={toggleTimer}
            className={`p-5 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
              mode === 'work'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-300 dark:shadow-indigo-900/50'
                : mode === 'shortBreak'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-green-300 dark:shadow-green-900/50'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-blue-300 dark:shadow-blue-900/50'
            } text-white`}
          >
            {isRunning ? (
              <PauseIcon className="h-9 w-9" />
            ) : (
              <PlayIcon className="h-9 w-9" />
            )}
          </button>
          <button
            onClick={resetTimer}
            className="p-5 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-600 shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-gray-200 dark:border-slate-600"
          >
            <ArrowPathIcon className="h-9 w-9" />
          </button>
        </div>

        {/* Sessions Completed */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl border border-indigo-200 dark:border-indigo-800 shadow-md">
            <span className="text-2xl">🏆</span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Sessions Completed:</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {sessionsCompleted}
            </span>
          </div>
        </div>

        {/* Notification Permission */}
        {('Notification' in window && Notification.permission === 'default') && (
          <div className="mt-8 p-5 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 shadow-md card-enter">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔔</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                  Enable notifications to get alerts when your session ends
                </p>
                <button
                  onClick={requestNotificationPermission}
                  className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 px-4 py-2 bg-yellow-200 dark:bg-yellow-800 rounded-lg hover:bg-yellow-300 dark:hover:bg-yellow-700 transition-all duration-200 hover:scale-105"
                >
                  Enable Notifications
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      </div>
    </div>
  )
}
