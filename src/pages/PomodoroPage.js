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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Pomodoro Timer</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Stay focused with the Pomodoro Technique
            </p>
          </div>
          <button
            onClick={() => setShowAbout(!showAbout)}
            className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
            title="About Pomodoro Technique"
          >
            <QuestionMarkCircleIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </button>
        </div>

        {/* About Section (Collapsible) */}
        {showAbout && (
          <div className="mb-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg shadow-sm p-4 sm:p-6 border border-indigo-200 dark:border-indigo-800">
            <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-3">
              About Pomodoro Technique
            </h2>
            <div className="space-y-2 text-sm text-indigo-800 dark:text-indigo-200">
              <p>🍅 <strong>Work Session:</strong> 25 minutes of focused work</p>
              <p>☕ <strong>Short Break:</strong> 5 minutes to recharge</p>
              <p>🌴 <strong>Long Break:</strong> 15 minutes after 4 work sessions</p>
              <p className="mt-4 text-xs">
                The Pomodoro Technique helps you stay focused and productive by breaking work into intervals.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
          {/* Mode Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => switchMode('work')}
            className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              mode === 'work'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            Work
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              mode === 'shortBreak'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            Short Break
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              mode === 'longBreak'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            Long Break
          </button>
        </div>

        {/* Timer Display */}
        <div className="relative mb-8 flex justify-center">
          {/* Circular Progress */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64">
            <svg className="transform -rotate-90 w-full h-full">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200 dark:text-slate-700"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress() / 100)}`}
                className={`transition-all duration-1000 ${
                  mode === 'work'
                    ? 'text-indigo-600'
                    : mode === 'shortBreak'
                    ? 'text-green-600'
                    : 'text-blue-600'
                }`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 capitalize">
                  {mode === 'work' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={toggleTimer}
            className={`p-4 rounded-full shadow-lg transition-all hover:scale-105 ${
              mode === 'work'
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : mode === 'shortBreak'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isRunning ? (
              <PauseIcon className="h-8 w-8" />
            ) : (
              <PlayIcon className="h-8 w-8" />
            )}
          </button>
          <button
            onClick={resetTimer}
            className="p-4 rounded-full bg-gray-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-gray-300 dark:hover:bg-slate-600 shadow-lg transition-all hover:scale-105"
          >
            <ArrowPathIcon className="h-8 w-8" />
          </button>
        </div>

        {/* Sessions Completed */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg">
            <span className="text-sm text-slate-600 dark:text-slate-400">Sessions Completed:</span>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{sessionsCompleted}</span>
          </div>
        </div>

        {/* Notification Permission */}
        {('Notification' in window && Notification.permission === 'default') && (
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
              Enable notifications to get alerts when your session ends
            </p>
            <button
              onClick={requestNotificationPermission}
              className="text-sm font-medium text-yellow-900 dark:text-yellow-100 underline hover:no-underline"
            >
              Enable Notifications
            </button>
          </div>
        )}
      </div>

      </div>
    </div>
  )
}
