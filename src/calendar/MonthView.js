import React, { useMemo, useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useEvents } from '../context/EventContext'
import { hasConflict } from '../utils/conflicts'
import EditEventModal from '../modals/EditEventModal'
import AddEventModal from '../modals/AddEventModal'

function monthMatrix(current, startWeekMonday = false) {
  const startOfMonth = current.startOf('month');
  let startDay;
  
  if (startWeekMonday) {
    // If Monday is the start, calculate accordingly
    const dayOfWeek = startOfMonth.day(); // 0=Sunday, 1=Monday, etc.
    if (dayOfWeek === 0) {
      // If first day of month is Sunday, go back 6 days to get Monday
      startDay = startOfMonth.subtract(6, 'day');
    } else {
      // Go back to Monday (dayOfWeek - 1 days)
      startDay = startOfMonth.subtract(dayOfWeek - 1, 'day');
    }
  } else {
    // Default: Sunday is the start
    startDay = startOfMonth.startOf('week');
  }
  
  const matrix = [];
  let cur = startDay;
  for (let week = 0; week < 6; week++) {
    const weekArr = [];
    for (let d = 0; d < 7; d++) {
      weekArr.push(cur);
      cur = cur.add(1, 'day');
    }
    matrix.push(weekArr);
  }
  return matrix;
}

export default function MonthView({ viewSelector, initialDate, onDateClick, onDateChange }){
  const today = dayjs();
  const startWeekMonday = localStorage.getItem('timely.startWeekMonday') === 'true';
  const [current, setCurrent] = useState(initialDate ? initialDate.startOf('month') : today.startOf('month'));
  const { events } = useEvents();

  useEffect(() => {
    if (initialDate) {
      setCurrent(initialDate.startOf('month'));
    }
  }, [initialDate]);

  const matrix = useMemo(()=> monthMatrix(current, startWeekMonday), [current, startWeekMonday]);

  const dayHeaders = useMemo(() => {
    return startWeekMonday 
      ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
      : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  }, [startWeekMonday]);

  const eventsByDay = useMemo(()=>{
    const map = {};
    events.forEach(ev=>{
      const d = dayjs(ev.date).format('YYYY-MM-DD');
      map[d] = map[d] || [];
      map[d].push(ev);
    });
    return map;
  }, [events]);

  const [openDay, setOpenDay] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [addingForDay, setAddingForDay] = useState(null);

  const prev = ()=> {
    const newDate = current.subtract(1,'month');
    setCurrent(newDate);
    if (onDateChange) onDateChange(newDate);
  }
  const next = ()=> {
    const newDate = current.add(1,'month');
    setCurrent(newDate);
    if (onDateChange) onDateChange(newDate);
  }
  const goToday = ()=> {
    const newDate = today.startOf('month');
    setCurrent(newDate);
    if (onDateChange) onDateChange(newDate);
  }

  const handleDayClick = (day, key) => {
    const isCurrentMonth = day.month() === current.month();
    if (!isCurrentMonth) {
      // Only navigate to the month, don't go to week view
      const newDate = day.startOf('month');
      setCurrent(newDate);
      if (onDateChange) onDateChange(newDate);
    } else {
      // Navigate to week view only for current month dates
      if (onDateClick) {
        onDateClick(day);
      } else {
        setOpenDay(key);
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 slide-left">
        <div className="flex items-center gap-3">
          <button onClick={prev} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 text-slate-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700">
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent min-w-[200px] text-center">
            {current.format('MMMM YYYY')}
          </div>
          <button onClick={next} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 text-slate-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700">
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          {viewSelector}
          <button onClick={goToday} className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 hover:scale-105 transition-all duration-200">
            Today
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-3">
        {dayHeaders.map((d, index)=> (
          <div 
            key={d} 
            style={{ animationDelay: `${index * 0.05}s` }}
            className="text-sm font-semibold text-center text-slate-600 dark:text-slate-400 py-2 slide-left"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-rows-6 gap-2.5 mt-2">
        {matrix.map((week, wi)=> (
          <div key={wi} className="grid grid-cols-7 gap-2.5">
            {week.map(day=>{
              const key = day.format('YYYY-MM-DD');
              const isCurrentMonth = day.month()===current.month();
              const isToday = day.isSame(today,'day');
              const dayEvents = eventsByDay[key]||[];
              return (
                <div key={key} className={`group p-3 rounded-2xl bg-white dark:bg-slate-800 min-h-[120px] relative flex flex-col transition-all duration-300 cursor-pointer ${
                  !isCurrentMonth 
                    ? 'opacity-40 border-2 border-gray-100 dark:border-slate-700/30' 
                    : 'border-2 border-gray-200 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-600'
                } ${
                  isToday 
                    ? 'border-2 !border-indigo-500 dark:!border-indigo-400 shadow-lg shadow-indigo-200/50 dark:shadow-indigo-500/30 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10' 
                    : ''
                } hover:shadow-xl hover:-translate-y-0.5`}>
                  
                  {/* Date Header */}
                  <div className="flex items-center justify-between mb-2 relative z-10">
                    <div className={`flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      isToday 
                        ? 'bg-indigo-500 dark:bg-indigo-500 text-white min-w-[32px] h-8 rounded-lg shadow-md' 
                        : 'text-slate-700 dark:text-slate-300 min-w-[32px]'
                    }`}>
                      {day.date()}
                    </div>
                    {isToday && (
                      <span className="px-2 py-0.5 bg-indigo-500 text-white text-[9px] font-extrabold uppercase tracking-wide rounded-md shadow-sm">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Events Container */}
                  <div className="flex-1 flex flex-col gap-1.5 overflow-hidden relative z-10">
                    {dayEvents.slice(0, 2).map(ev=>{
                      const conflict = hasConflict(ev, events, ev.id);
                      return (
                        <button 
                          key={ev.id} 
                          onClick={(e)=> {
                            e.stopPropagation();
                            setEditingEvent(ev);
                          }} 
                          title={`${ev.title} • ${ev.time} • ${ev.duration}m`} 
                          className={`w-full text-left px-2 py-1.5 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
                            conflict 
                              ? 'border-l-3 border-red-500 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/40' 
                              : 'border-l-3 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
                          }`}
                        > 
                          <div className="text-xs text-slate-800 dark:text-slate-100 font-semibold truncate leading-tight">{ev.title}</div>
                          <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">{ev.time}</div>
                        </button>
                      )
                    })}
                    
                    {/* More Events Indicator */}
                    {dayEvents.length > 2 && (
                      <button
                        onClick={(e)=> {
                          e.stopPropagation();
                          setOpenDay(key);
                        }}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 px-2 py-1 rounded-md transition-all duration-300 hover:scale-105"
                      >
                        +{dayEvents.length - 2} more event{dayEvents.length - 2 > 1 ? 's' : ''}
                      </button>
                    )}
                  </div>

                  {/* Click area for day navigation */}
                  <div 
                    className="absolute inset-0 rounded-2xl" 
                    onClick={()=> handleDayClick(day, key)} 
                    aria-hidden 
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {openDay && (
        <div className="fixed inset-0 bg-black/30 flex items-end md:items-center justify-center p-4 z-40" onClick={()=> setOpenDay(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-md w-full max-w-2xl p-4" onClick={(e)=> e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Events for {dayjs(openDay).format('MMMM D, YYYY')}</h3>
              <div className="flex items-center gap-2">
                <button onClick={()=> setAddingForDay(openDay)} className="px-3 py-1 bg-indigo-600 text-white rounded">Add Event</button>
                <button onClick={()=> setOpenDay(null)} className="px-2 py-1 text-slate-900 dark:text-slate-100">Close</button>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {(eventsByDay[openDay]||[]).map(ev=> (
                <div key={ev.id} className="p-3 border dark:border-slate-700 rounded hover:shadow-sm flex justify-between items-center">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{ev.title}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{ev.time} • {ev.duration}m</div>
                  </div>
                  <div>
                    <button onClick={()=> setEditingEvent(ev)} className="px-2 py-1 text-sm text-indigo-600 dark:text-indigo-400">Edit</button>
                  </div>
                </div>
              ))}
              {!(eventsByDay[openDay]||[]).length && <div className="text-sm text-slate-500 dark:text-slate-400">No events</div>}
            </div>
          </div>
        </div>
      )}

      {addingForDay && (
        <AddEventModal date={addingForDay} onClose={()=> setAddingForDay(null)} readOnlyDate={true} />
      )}

      {editingEvent && (
        <EditEventModal event={editingEvent} onClose={()=> setEditingEvent(null)} />
      )}

      {/* Floating Add Button */}
      <button 
        onClick={() => setAddingForDay(dayjs().format('YYYY-MM-DD'))}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-30"
        title="Add Event"
      >
        <PlusIcon className="h-6 w-6" />
      </button>
    </div>
  )
}
