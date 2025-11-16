import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

const WORK_TIME = 25 * 60 // 25 minutes in seconds
const SHORT_BREAK = 5 * 60 // 5 minutes
const LONG_BREAK = 15 * 60 // 15 minutes

const PomodoroContext = createContext()

export function usePomodoro() {
  const context = useContext(PomodoroContext)
  if (!context) {
    throw new Error('usePomodoro must be used within a PomodoroProvider')
  }
  return context
}

export function PomodoroProvider({ children }) {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('work') // 'work', 'shortBreak', 'longBreak'
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const intervalRef = useRef(null)
  const audioRef = useRef(null)

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false)
    
    // Play notification sound
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e))
    }

    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: mode === 'work' ? 'Work session completed! Time for a break.' : 'Break completed! Ready to work?',
        icon: '/logo192.png'
      })
    }

    // Auto-switch to next mode
    if (mode === 'work') {
      const newSessionCount = sessionsCompleted + 1
      setSessionsCompleted(newSessionCount)
      
      if (newSessionCount % 4 === 0) {
        setMode('longBreak')
        setTimeLeft(LONG_BREAK)
      } else {
        setMode('shortBreak')
        setTimeLeft(SHORT_BREAK)
      }
    } else {
      setMode('work')
      setTimeLeft(WORK_TIME)
    }
  }, [mode, sessionsCompleted])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, timeLeft])

  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      handleTimerComplete()
    }
  }, [timeLeft, isRunning, handleTimerComplete])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(mode === 'work' ? WORK_TIME : mode === 'shortBreak' ? SHORT_BREAK : LONG_BREAK)
  }

  const switchMode = (newMode) => {
    setIsRunning(false)
    setMode(newMode)
    switch (newMode) {
      case 'work':
        setTimeLeft(WORK_TIME)
        break
      case 'shortBreak':
        setTimeLeft(SHORT_BREAK)
        break
      case 'longBreak':
        setTimeLeft(LONG_BREAK)
        break
      default:
        setTimeLeft(WORK_TIME)
    }
  }

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = () => {
    const total = mode === 'work' ? WORK_TIME : mode === 'shortBreak' ? SHORT_BREAK : LONG_BREAK
    return ((total - timeLeft) / total) * 100
  }

  const value = {
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
    audioRef,
    WORK_TIME,
    SHORT_BREAK,
    LONG_BREAK,
  }

  return (
    <PomodoroContext.Provider value={value}>
      {/* Hidden audio element for notification sound */}
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSBAKV6vo8KteDwoVY7ru76hhGwo+lemVsTEEQp/h8sdrLAYqfcry242DQA8RXKvn8KlgHAQ6ldvyyHk3BBxu" />
      {children}
    </PomodoroContext.Provider>
  )
}
