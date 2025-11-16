import React, { useMemo, useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useEvents } from '../context/EventContext'
import { hasConflict } from '../utils/conflicts'
import EditEventModal from '../modals/EditEventModal'
import AddEventModal from '../modals/AddEventModal'

function monthMatrix(current) {
  const startOfMonth = current.startOf('month');
  const startDay = startOfMonth.startOf('week');
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
  const [current, setCurrent] = useState(initialDate ? initialDate.startOf('month') : today.startOf('month'));
  const { events } = useEvents();

  useEffect(() => {
    if (initialDate) {
      setCurrent(initialDate.startOf('month'));
    }
  }, [initialDate]);

  const matrix = useMemo(()=> monthMatrix(current), [current]);

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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={prev} className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100">
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 min-w-[200px] text-center">{current.format('MMMM YYYY')}</div>
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
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=> (
          <div key={d} className="text-sm font-medium text-center text-slate-600 dark:text-slate-400">{d}</div>
        ))}
      </div>

      <div className="grid grid-rows-6 gap-2 mt-2">
        {matrix.map((week, wi)=> (
          <div key={wi} className="grid grid-cols-7 gap-2">
            {week.map(day=>{
              const key = day.format('YYYY-MM-DD');
              const isCurrentMonth = day.month()===current.month();
              const isToday = day.isSame(today,'day');
              const dayEvents = eventsByDay[key]||[];
              return (
                <div key={key} className={`p-2 rounded-md bg-white dark:bg-slate-800 h-28 relative flex flex-col ${!isCurrentMonth? 'opacity-60':''} ${isToday? 'ring-2 ring-indigo-200 dark:ring-indigo-500':''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{day.date()}</div>
                  </div>

                  <div className="flex-1 space-y-1">
                    {dayEvents.slice(0, 1).map(ev=>{
                      const conflict = hasConflict(ev, events, ev.id);
                      return (
                        <button key={ev.id} onClick={()=> setEditingEvent(ev)} title={`${ev.title} • ${ev.time} • ${ev.duration}m`} className={`w-full text-left p-1 rounded border-l-4 ${conflict? 'border-red-400':'border-indigo-500'} bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600`}> 
                          <div className="text-xs text-slate-700 dark:text-slate-200 font-medium truncate">{ev.title}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{ev.time}</div>
                        </button>
                      )
                    })}
                    {dayEvents.length > 1 && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 pl-1">+{dayEvents.length - 1} more</div>
                    )}
                  </div>

                  <div className="absolute inset-0" onClick={()=> handleDayClick(day, key)} aria-hidden />
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
