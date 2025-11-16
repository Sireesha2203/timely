import React, { useMemo, useState, useEffect, useCallback } from 'react'
import dayjs from 'dayjs'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useEvents } from '../context/EventContext'
import EditEventModal from '../modals/EditEventModal'
import AddEventModal from '../modals/AddEventModal'

export default function WeekView({ viewSelector, initialDate, onDateChange }){
  const today = dayjs();
  const startWeekMonday = localStorage.getItem('timely.startWeekMonday') === 'true';
  
  // Calculate week start based on setting
  const getWeekStart = useCallback((date) => {
    if (startWeekMonday) {
      // If Monday is the start, adjust the week
      const dayOfWeek = date.day(); // 0=Sunday, 1=Monday, etc.
      if (dayOfWeek === 0) {
        // If it's Sunday, go back 6 days to get Monday
        return date.subtract(6, 'day');
      } else {
        // Go back to Monday (dayOfWeek - 1 days)
        return date.subtract(dayOfWeek - 1, 'day');
      }
    } else {
      // Default: Sunday is the start
      return date.startOf('week');
    }
  }, [startWeekMonday]);

  const [current, setCurrent] = useState(initialDate ? getWeekStart(initialDate) : getWeekStart(today));
  const { events } = useEvents();

  useEffect(() => {
    if (initialDate) {
      setCurrent(getWeekStart(initialDate));
    }
  }, [initialDate, getWeekStart]);

  const weekDays = useMemo(()=>{
    const days = [];
    for(let i=0; i<7; i++){
      days.push(current.add(i, 'day'));
    }
    return days;
  }, [current]);

  const eventsByDay = useMemo(()=>{
    const map = {};
    events.forEach(ev=>{
      const d = dayjs(ev.date).format('YYYY-MM-DD');
      map[d] = map[d] || [];
      map[d].push(ev);
    });
    return map;
  }, [events]);

  const [editingEvent, setEditingEvent] = useState(null);
  const [addingForDay, setAddingForDay] = useState(null);

  const prev = ()=> {
    const newDate = current.subtract(1,'week');
    setCurrent(newDate);
    if (onDateChange) onDateChange(newDate);
  }
  const next = ()=> {
    const newDate = current.add(1,'week');
    setCurrent(newDate);
    if (onDateChange) onDateChange(newDate);
  }
  const goToday = ()=> {
    const newDate = getWeekStart(today);
    setCurrent(newDate);
    if (onDateChange) onDateChange(newDate);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={prev} className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100">
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 min-w-[250px] text-center">
            {weekDays[0].format('MMM D')} - {weekDays[6].format('MMM D, YYYY')}
          </div>
          <button onClick={next} className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100">
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {viewSelector}
          <button onClick={goToday} className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">Today</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map(day=>{
          const key = day.format('YYYY-MM-DD');
          const isToday = day.isSame(today,'day');
          const dayEvents = eventsByDay[key]||[];
          return (
            <div key={key} className={`p-2 rounded-md bg-white dark:bg-slate-800 h-[calc(100vh-200px)] flex flex-col ${isToday? 'ring-2 ring-indigo-200 dark:ring-indigo-500':''}`}>
              <div className="text-center mb-2">
                <div className="text-xs text-slate-500 dark:text-slate-400">{day.format('ddd')}</div>
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{day.date()}</div>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-600 space-y-2 mb-2">
                {dayEvents.map(ev=> (
                  <button key={ev.id} onClick={()=> setEditingEvent(ev)} className="w-full text-left p-2 rounded border-l-4 border-indigo-500 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600">
                    <div className="text-xs text-slate-700 dark:text-slate-200 font-medium">{ev.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{ev.time}</div>
                  </button>
                ))}
              </div>
              <button onClick={()=> setAddingForDay(key)} className="w-full text-sm text-indigo-600 dark:text-indigo-400 py-2 border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 rounded">+ Add Event</button>
            </div>
          )
        })}
      </div>

      {addingForDay && (
        <AddEventModal date={addingForDay} onClose={()=> setAddingForDay(null)} readOnlyDate={true} />
      )}

      {editingEvent && (
        <EditEventModal event={editingEvent} onClose={()=> setEditingEvent(null)} />
      )}
    </div>
  )
}
