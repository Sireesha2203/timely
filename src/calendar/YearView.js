import React, { useMemo, useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useEvents } from '../context/EventContext'

export default function YearView({ viewSelector, initialDate, onMonthClick, onDateChange }){
  const today = dayjs();
  const startWeekMonday = localStorage.getItem('timely.startWeekMonday') === 'true';
  const [year, setYear] = useState(initialDate ? initialDate.year() : today.year());
  const { events } = useEvents();

  useEffect(() => {
    if (initialDate) {
      setYear(initialDate.year());
    }
  }, [initialDate]);

  const dayHeaders = useMemo(() => {
    return startWeekMonday 
      ? ['M','T','W','T','F','S','S']
      : ['S','M','T','W','T','F','S'];
  }, [startWeekMonday]);

  useEffect(() => {
    if (initialDate) {
      setYear(initialDate.year());
    }
  }, [initialDate]);

  const eventsByMonth = useMemo(()=>{
    const map = {};
    events.forEach(ev=>{
      const month = dayjs(ev.date).format('YYYY-MM');
      map[month] = (map[month] || 0) + 1;
    });
    return map;
  }, [events]);

  const months = useMemo(()=>{
    const arr = [];
    for(let m=0; m<12; m++){
      const start = dayjs().year(year).month(m).startOf('month');
      arr.push(start);
    }
    return arr;
  }, [year]);

  const prev = ()=> {
    const newYear = year - 1;
    setYear(newYear);
    if (onDateChange) onDateChange(dayjs().year(newYear));
  }
  const next = ()=> {
    const newYear = year + 1;
    setYear(newYear);
    if (onDateChange) onDateChange(dayjs().year(newYear));
  }
  const goToday = ()=> {
    const newYear = today.year();
    setYear(newYear);
    if (onDateChange) onDateChange(today);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={prev} className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100">
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 min-w-[100px] text-center">{year}</div>
          <button onClick={next} className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100">
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {viewSelector}
          <button onClick={goToday} className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">Today</button>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {months.map(month=>{
          const key = month.format('YYYY-MM');
          const eventCount = eventsByMonth[key] || 0;
          const daysInMonth = month.daysInMonth();
          
          // Calculate first day offset based on week start setting
          let firstDay = month.day(); // 0=Sunday, 1=Monday, etc.
          if (startWeekMonday) {
            // Adjust so Monday is 0, Sunday is 6
            firstDay = firstDay === 0 ? 6 : firstDay - 1;
          }
          
          const days = [];
          for(let i=0; i<firstDay; i++) days.push(null);
          for(let d=1; d<=daysInMonth; d++) days.push(d);

          return (
            <button 
              key={key} 
              onClick={() => onMonthClick && onMonthClick(month)}
              className="p-3 rounded-md bg-white dark:bg-slate-800 shadow-sm hover:shadow-md hover:ring-2 hover:ring-indigo-200 dark:hover:ring-indigo-500 transition-all cursor-pointer text-left"
            >
              <div className="text-center mb-2">
                <div className="font-semibold text-slate-900 dark:text-slate-100">{month.format('MMMM')}</div>
                {eventCount > 0 && <div className="text-xs text-indigo-600 dark:text-indigo-400">{eventCount} events</div>}
              </div>
              <div className="grid grid-cols-7 gap-1 text-xs">
                {dayHeaders.map((d,i)=> <div key={i} className="text-center text-slate-500 dark:text-slate-400">{d}</div>)}
                {days.map((d,i)=> (
                  <div key={i} className={`text-center p-1 ${d? 'text-slate-700 dark:text-slate-300':'text-transparent'} ${d && dayjs().year(year).month(month.month()).date(d).isSame(today,'day')? 'bg-indigo-100 dark:bg-indigo-900 rounded':''}`}>
                    {d || '-'}
                  </div>
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
