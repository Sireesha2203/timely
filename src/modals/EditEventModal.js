import React, { useState, useEffect } from 'react'
import { useEvents } from '../context/EventContext'
import dayjs from 'dayjs'
import { hasConflict } from '../utils/conflicts'
import { getTimeFormat } from '../utils/formatters'

export default function EditEventModal({ event, onClose }){
  const { events, updateEvent, deleteEvent } = useEvents();
  const [title, setTitle] = useState(event.title||'');
  const [date, setDate] = useState(event.date||dayjs().format('YYYY-MM-DD'));
  const [time, setTime] = useState(event.time||'09:00');
  const [duration, setDuration] = useState(event.duration||30);
  const [warning, setWarning] = useState(null);
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [timeFormat, setTimeFormat] = useState(getTimeFormat());

  const isRecurring = !!event.recurringId;

  // For 12-hour format
  const [hour12, setHour12] = useState('09');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM');

  // Initialize 12-hour components from time
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
  }, [time, timeFormat]);

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

  function handleSave(){
    const updates = { title, date, time, duration: Number(duration) };
    const conflict = hasConflict({ id: event.id, ...updates }, events, event.id);
    updateEvent(event.id, updates);
    if (conflict) setWarning('This update creates a conflict with another event');
    else onClose();
  }

  function handleDeleteClick(){
    if (isRecurring) {
      setShowDeleteOptions(true);
    } else {
      if (!window.confirm('Delete this event?')) return;
      deleteEvent(event.id);
      onClose();
    }
  }

  function handleDeleteThis(){
    if (!window.confirm('Delete only this occurrence?')) return;
    deleteEvent(event.id);
    onClose();
  }

  function handleDeleteAll(){
    if (!window.confirm('Delete all occurrences of this recurring event?')) return;
    // Delete all events with the same recurringId
    const recurringEvents = events.filter(e => e.recurringId === event.recurringId);
    recurringEvents.forEach(e => deleteEvent(e.id));
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-md p-4 w-full max-w-md" onClick={(e)=> e.stopPropagation()}>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          Edit Event {isRecurring && <span className="text-xs text-indigo-600 dark:text-indigo-400 ml-2">(Recurring)</span>}
        </h3>
        <div className="mt-3 space-y-2">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded" />
          <input value={date} onChange={e=>setDate(e.target.value)} type="date" className="w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded" />
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
          {warning && <div className="text-sm text-red-600 dark:text-red-400">{warning}</div>}
        </div>

        {showDeleteOptions ? (
          <div className="mt-4 border-t dark:border-slate-700 pt-4">
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">Delete recurring event:</p>
            <div className="space-y-2">
              <button onClick={handleDeleteThis} className="w-full px-3 py-2 text-left border dark:border-slate-600 rounded hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100">
                Delete only this occurrence
              </button>
              <button onClick={handleDeleteAll} className="w-full px-3 py-2 text-left border border-red-300 dark:border-red-700 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400">
                Delete all occurrences
              </button>
              <button onClick={()=>setShowDeleteOptions(false)} className="w-full px-3 py-2 text-center text-slate-600 dark:text-slate-400">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex justify-between items-center">
            <button onClick={handleDeleteClick} className="px-3 py-1 text-red-600 dark:text-red-400">Delete</button>
            <div className="flex gap-2">
              <button onClick={onClose} className="px-3 py-1 text-slate-900 dark:text-slate-100">Cancel</button>
              <button onClick={handleSave} className="px-3 py-1 bg-indigo-600 text-white rounded">Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
