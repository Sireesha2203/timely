import React, { useState, useEffect } from 'react'
import { PlusIcon, XMarkIcon, MagnifyingGlassIcon, ClockIcon } from '@heroicons/react/24/outline'
import { worldCities, getTimeInTimezone, getDateInTimezone, searchCities } from '../utils/timezones'

function WorldClock({ city, onRemove }) {
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(getTimeInTimezone(city.timezone))
      setCurrentDate(getDateInTimezone(city.timezone))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [city.timezone])

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 relative group">
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 dark:hover:bg-red-900/50"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
          <ClockIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{city.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{city.country}</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{currentTime}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{currentDate}</p>
        </div>
      </div>
    </div>
  )
}

export default function WorldClockPage() {
  const [selectedCities, setSelectedCities] = useState(() => {
    const saved = localStorage.getItem('worldClocks')
    return saved ? JSON.parse(saved) : [
      worldCities.find(c => c.name === 'New York'),
      worldCities.find(c => c.name === 'London'),
      worldCities.find(c => c.name === 'Tokyo'),
    ]
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    localStorage.setItem('worldClocks', JSON.stringify(selectedCities))
  }, [selectedCities])

  const handleRemoveCity = (cityToRemove) => {
    setSelectedCities(selectedCities.filter(c => c.name !== cityToRemove.name))
  }

  const handleAddCity = (city) => {
    if (!selectedCities.some(c => c.name === city.name)) {
      setSelectedCities([...selectedCities, city])
    }
    setShowAddModal(false)
    setSearchQuery('')
  }

  const searchResults = searchQuery ? searchCities(searchQuery) : worldCities

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">World Clock</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            View times across different time zones
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Add Clock
        </button>
      </div>

      {/* Clocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedCities.map(city => (
          <WorldClock
            key={city.name}
            city={city}
            onRemove={() => handleRemoveCity(city)}
          />
        ))}
        
        {selectedCities.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
            <ClockIcon className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400">No clocks added yet</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
              Click "Add Clock" to get started
            </p>
          </div>
        )}
      </div>

      {/* Add Clock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Add Clock</h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setSearchQuery('')
                }}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            <div className="p-6">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {searchResults.map(city => {
                  const isAdded = selectedCities.some(c => c.name === city.name)
                  return (
                    <button
                      key={city.name}
                      onClick={() => !isAdded && handleAddCity(city)}
                      disabled={isAdded}
                      className={`text-left p-3 rounded-lg border transition-colors ${
                        isAdded
                          ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 opacity-50 cursor-not-allowed'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-700'
                      }`}
                    >
                      <div className="font-medium text-slate-900 dark:text-slate-100">{city.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{city.country}</div>
                      {isAdded && (
                        <div className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Added</div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
