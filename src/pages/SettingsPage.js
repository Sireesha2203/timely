import React, { useEffect, useState } from 'react'
import { SunIcon, MoonIcon, BellIcon, TrashIcon } from '@heroicons/react/24/outline'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'

export default function SettingsPage(){
  const [startWeekMonday, setStartWeekMonday] = useState(localStorage.getItem('timely.startWeekMonday')==='true')
  const [timezone, setTimezone] = useState(localStorage.getItem('timely.timezone')||'UTC')
  const [timeFormat, setTimeFormat] = useState(localStorage.getItem('timely.timeFormat')||'12h')
  const [dateFormat, setDateFormat] = useState(localStorage.getItem('timely.dateFormat')||'MM/DD/YYYY')
  const [theme, setTheme] = useState(() => localStorage.getItem('timely.theme') || 'light')
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  )
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(()=>{
    localStorage.setItem('timely.startWeekMonday', startWeekMonday)
    showSuccessMessage()
  },[startWeekMonday])

  useEffect(()=>{
    localStorage.setItem('timely.timezone', timezone)
    showSuccessMessage()
  },[timezone])

  useEffect(()=>{
    localStorage.setItem('timely.timeFormat', timeFormat)
    showSuccessMessage()
  },[timeFormat])

  useEffect(()=>{
    localStorage.setItem('timely.dateFormat', dateFormat)
    showSuccessMessage()
  },[dateFormat])

  useEffect(()=>{
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('timely.theme', theme)
    showSuccessMessage()
  },[theme])

  const showSuccessMessage = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationsEnabled(permission === 'granted')
      showSuccessMessage()
    }
  }

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This will delete all events, settings, and preferences. This action cannot be undone.')) {
      localStorage.clear()
      alert('All data has been cleared. The page will now reload.')
      window.location.reload()
    }
  }

  const exportData = () => {
    const data = {
      events: JSON.parse(localStorage.getItem('timely.events') || '[]'),
      settings: {
        startWeekMonday,
        timezone,
        timeFormat,
        dateFormat,
        theme
      },
      worldClocks: JSON.parse(localStorage.getItem('worldClocks') || '[]'),
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `timely-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showSuccessMessage()
  }

  const importData = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        
        if (data.events) localStorage.setItem('timely.events', JSON.stringify(data.events))
        if (data.worldClocks) localStorage.setItem('worldClocks', JSON.stringify(data.worldClocks))
        if (data.settings) {
          if (data.settings.startWeekMonday !== undefined) {
            localStorage.setItem('timely.startWeekMonday', data.settings.startWeekMonday)
            setStartWeekMonday(data.settings.startWeekMonday)
          }
          if (data.settings.timezone) {
            localStorage.setItem('timely.timezone', data.settings.timezone)
            setTimezone(data.settings.timezone)
          }
          if (data.settings.timeFormat) {
            localStorage.setItem('timely.timeFormat', data.settings.timeFormat)
            setTimeFormat(data.settings.timeFormat)
          }
          if (data.settings.dateFormat) {
            localStorage.setItem('timely.dateFormat', data.settings.dateFormat)
            setDateFormat(data.settings.dateFormat)
          }
          if (data.settings.theme) {
            localStorage.setItem('timely.theme', data.settings.theme)
            setTheme(data.settings.theme)
          }
        }
        
        alert('Data imported successfully! The page will now reload.')
        window.location.reload()
      } catch (error) {
        alert('Failed to import data. Please make sure the file is a valid Timely backup.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div>
      <PageHeader title="Settings" />

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 text-sm">
          ✓ Settings saved successfully
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Appearance Settings */}
        <Card title="Appearance">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900 dark:text-slate-100">Theme</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Choose light or dark mode</div>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                {theme === 'dark' ? (
                  <>
                    <SunIcon className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm text-slate-900 dark:text-slate-100">Light</span>
                  </>
                ) : (
                  <>
                    <MoonIcon className="h-5 w-5 text-indigo-600" />
                    <span className="text-sm text-slate-900 dark:text-slate-100">Dark</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Card>

        <Card title="Calendar Preferences">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900 dark:text-slate-100">Start week on Monday</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Choose first day of week</div>
              </div>
              <div>
                <input type="checkbox" checked={startWeekMonday} onChange={e=> setStartWeekMonday(e.target.checked)} className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900 dark:text-slate-100">Time Format</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">12-hour or 24-hour</div>
              </div>
              <select value={timeFormat} onChange={e=> setTimeFormat(e.target.value)} className="px-2 py-1 border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded">
                <option value="12h">12-hour</option>
                <option value="24h">24-hour</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900 dark:text-slate-100">Date Format</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Display format</div>
              </div>
              <select value={dateFormat} onChange={e=> setDateFormat(e.target.value)} className="px-2 py-1 border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded">
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card title="Notifications">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900 dark:text-slate-100">Browser Notifications</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Get notified about events and timers</div>
              </div>
              <div>
                {notificationsEnabled ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">
                    <BellIcon className="h-4 w-4" />
                    Enabled
                  </span>
                ) : (
                  <button
                    onClick={requestNotificationPermission}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Enable
                  </button>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Regional Settings">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900 dark:text-slate-100">Timezone</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Select your timezone</div>
              </div>
              <select value={timezone} onChange={e=> setTimezone(e.target.value)} className="px-2 py-1 border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded">
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Asia/Kolkata">Mumbai (IST)</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card title="Data Management">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900 dark:text-slate-100">Export Data</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Download all your data</div>
              </div>
              <button
                onClick={exportData}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors"
              >
                Export
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900 dark:text-slate-100">Import Data</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Restore from backup</div>
              </div>
              <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors cursor-pointer">
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-red-600 dark:text-red-400">Clear All Data</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Delete all events and settings</div>
                </div>
                <button
                  onClick={clearAllData}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                  Clear
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
