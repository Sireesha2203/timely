import React, { useState, useEffect } from 'react'
import { useEvents } from '../context/EventContext'
import dayjs from 'dayjs'
import { hasConflict } from '../utils/conflicts'
import { getTimeFormat } from '../utils/formatters'

export default function AddEventModal({ date, onClose, readOnlyDate = false }){
  const { events, addEvent } = useEvents();
  const [title, setTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs(date).format('YYYY-MM-DD'));
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState(30);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState('daily');
  const [recurringEndDate, setRecurringEndDate] = useState(dayjs(date).add(1, 'month').format('YYYY-MM-DD'));
  const [warning, setWarning] = useState(null);
  const [timeFormat, setTimeFormat] = useState(getTimeFormat());

  // For 12-hour format
  const [hour12, setHour12] = useState('09');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM');

  // Initialize 12-hour components from time on mount
  useEffect(() => {
    const format = getTimeFormat();
    setTimeFormat(format);
    
    if (format === '12h') {
      const [h, m] = time.split(':');
      const hour = parseInt(h);
      setMinute(m);
      if (hour === 0) {
        setHour12('12');
        setPeriod('AM');
      } else if (hour < 12) {
        setHour12(hour.toString().padStart(2, '0'));
        setPeriod('AM');
      } else if (hour === 12) {
        setHour12('12');
        setPeriod('PM');
      } else {
        setHour12((hour - 12).toString().padStart(2, '0'));
        setPeriod('PM');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handle12HourChange = (newHour, newMinute, newPeriod) => {
    setHour12(newHour);
    setMinute(newMinute);
    setPeriod(newPeriod);
    
    // Convert to 24-hour format for storage
    let hour24 = parseInt(newHour);
    if (newPeriod === 'AM' && hour24 === 12) hour24 = 0;
    else if (newPeriod === 'PM' && hour24 !== 12) hour24 += 12;
    
    setTime(`${hour24.toString().padStart(2, '0')}:${newMinute}`);
  }

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setTime(newTime);
  }

  function generateRecurringEvents(baseEvent) {
    const recurringEvents = [];
    let currentDate = dayjs(baseEvent.date);
    const endDate = dayjs(recurringEndDate);
    const recurringId = `recurring-${Date.now()}`;

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
      recurringEvents.push({
        ...baseEvent,
        date: currentDate.format('YYYY-MM-DD'),
        recurringId,
        recurringType
      });

      switch (recurringType) {
        case 'daily':
          currentDate = currentDate.add(1, 'day');
          break;
        case 'weekly':
          currentDate = currentDate.add(1, 'week');
          break;
        case 'monthly':
          currentDate = currentDate.add(1, 'month');
          break;
        default:
          currentDate = endDate.add(1, 'day'); // Exit loop
      }
    }

    return recurringEvents;
  }

  function handleSave(){
    const baseEvent = { title, date: selectedDate, time, duration: Number(duration) };
    
    if (isRecurring) {
      const recurringEvents = generateRecurringEvents(baseEvent);
      recurringEvents.forEach(ev => addEvent(ev));
      onClose();
    } else {
      const conflict = hasConflict(baseEvent, events);
      addEvent(baseEvent);
      if (conflict) setWarning('This event overlaps another event on the same day');
      else onClose();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-md p-4 w-full max-w-md" onClick={(e)=> e.stopPropagation()}>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Add Event</h3>
        <div className="mt-3 space-y-2">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded" />
          <input value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} type="date" readOnly={readOnlyDate} className={`w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded ${readOnlyDate ? 'bg-gray-100 dark:bg-slate-600 cursor-not-allowed' : ''}`} />
          <div className="flex gap-2">
            <div className="flex-1">
              {timeFormat === '24h' ? (
                <input 
                  value={time} 
                  onChange={handleTimeChange} 
                  type="time" 
                  className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded" 
                />
              ) : (
                <div className="flex gap-1">
                  <select 
                    value={hour12} 
                    onChange={(e) => handle12HourChange(e.target.value, minute, period)}
                    className="px-2 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded"
                  >
                    {Array.from({length: 12}, (_, i) => i + 1).map(h => (
                      <option key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                  <span className="flex items-center px-1 dark:text-slate-100">:</span>
                  <select 
                    value={minute} 
                    onChange={(e) => handle12HourChange(hour12, e.target.value, period)}
                    className="px-2 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded"
                  >
                    {Array.from({length: 60}, (_, i) => i).map(m => (
                      <option key={m} value={m.toString().padStart(2, '0')}>{m.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                  <select 
                    value={period} 
                    onChange={(e) => handle12HourChange(hour12, minute, e.target.value)}
                    className="px-2 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              )}
            </div>
            <input value={duration} onChange={e=>setDuration(e.target.value)} type="number" placeholder="Duration (min)" className="w-32 px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded" />
          </div>
          
          <div className="border-t dark:border-slate-700 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isRecurring} 
                onChange={e=>setIsRecurring(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="text-sm text-slate-900 dark:text-slate-100">Recurring Event</span>
            </label>
          </div>

          {isRecurring && (
            <div className="space-y-2 bg-gray-50 dark:bg-slate-700/50 p-3 rounded">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400">Repeat</label>
                <select 
                  value={recurringType} 
                  onChange={e=>setRecurringType(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400">End Date</label>
                <input 
                  value={recurringEndDate} 
                  onChange={e=>setRecurringEndDate(e.target.value)} 
                  type="date"
                  min={selectedDate}
                  className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded" 
                />
              </div>
            </div>
          )}

          {warning && <div className="text-sm text-red-600 dark:text-red-400">{warning}</div>}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 text-slate-900 dark:text-slate-100">Cancel</button>
          <button onClick={handleSave} className="px-3 py-1 bg-indigo-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  )
}
