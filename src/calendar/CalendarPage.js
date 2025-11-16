import React, { useState, useEffect } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
import MonthView from './MonthView'
import WeekView from './WeekView'
import WorkWeekView from './WorkWeekView'
import YearView from './YearView'

export default function CalendarPage(){
  // Load saved view and date from localStorage
  const savedView = localStorage.getItem('timely.calendarView') || 'month';
  const savedDate = localStorage.getItem('timely.calendarDate');
  
  const [view, setView] = useState(savedView);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    savedDate ? dayjs(savedDate) : dayjs()
  );

  // Save view and date to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('timely.calendarView', view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem('timely.calendarDate', selectedDate.format('YYYY-MM-DD'));
  }, [selectedDate]);

  const views = [
    { id: 'month', label: 'Month' },
    { id: 'week', label: 'Week' },
    { id: 'workweek', label: 'Work Week' },
    { id: 'year', label: 'Year' },
  ]

  const currentView = views.find(v => v.id === view) || views[0]

  // Navigate from year view to month view
  const handleYearMonthClick = (date) => {
    setSelectedDate(date)
    setView('month')
  }

  // Navigate from month view to week view
  const handleMonthDateClick = (date) => {
    setSelectedDate(date)
    setView('week')
  }

  const viewSelector = (
    <div className="relative">
      <button 
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-slate-100"
      >
        {currentView.label}
        <ChevronDownIcon className="h-4 w-4" />
      </button>
      
      {dropdownOpen && (
        <div className="absolute left-0 mt-1 w-40 bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-md shadow-lg z-10">
          {views.map(v => (
            <button
              key={v.id}
              onClick={() => { setView(v.id); setDropdownOpen(false) }}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 ${v.id === view ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-slate-100'}`}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  // Keep selectedDate in sync when navigating within views
  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  return (
    <div>
      {view === 'month' && (
        <MonthView 
          viewSelector={viewSelector}
          initialDate={selectedDate}
          onDateClick={handleMonthDateClick}
          onDateChange={handleDateChange}
        />
      )}
      {view === 'week' && (
        <WeekView 
          viewSelector={viewSelector}
          initialDate={selectedDate}
          onDateChange={handleDateChange}
        />
      )}
      {view === 'workweek' && (
        <WorkWeekView 
          viewSelector={viewSelector}
          initialDate={selectedDate}
          onDateChange={handleDateChange}
        />
      )}
      {view === 'year' && (
        <YearView 
          viewSelector={viewSelector}
          initialDate={selectedDate}
          onMonthClick={handleYearMonthClick}
          onDateChange={handleDateChange}
        />
      )}
    </div>
  )
}
