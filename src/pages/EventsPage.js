import React, { useMemo, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import { useEvents } from '../context/EventContext'
import AddEventModal from '../modals/AddEventModal'
import EditEventModal from '../modals/EditEventModal'
import dayjs from 'dayjs'
import { formatTime, formatDate } from '../utils/formatters'

export default function EventsPage(){
  const location = useLocation();
  const { events, deleteEvent } = useEvents();
  const [q, setQ] = useState('')
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)

  // Auto-open add modal if coming from dashboard
  useEffect(() => {
    if (location.state?.openAddModal) {
      setAdding(true);
    }
  }, [location.state]);

  const filtered = useMemo(()=> events.filter(ev=> (ev.title||'').toLowerCase().includes(q.toLowerCase())), [events,q])

  function renderRow(ev){
    return (
      <tr key={ev.id} className="border-t dark:border-slate-700/50 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300 group">
        <td className="px-5 py-4 font-medium text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{ev.title}</td>
        <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{formatDate(ev.date)}</td>
        <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{formatTime(ev.time)}</td>
        <td className="px-5 py-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
            {ev.duration}m
          </span>
        </td>
        <td className="px-5 py-4">
          <div className="flex gap-3">
            <button 
              onClick={()=> setEditing(ev)} 
              className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-all duration-200 hover:scale-110"
            >
              ✏️ Edit
            </button>
            <button 
              onClick={()=> { if(window.confirm('Delete this event?')) deleteEvent(ev.id)}} 
              className="text-red-600 dark:text-red-400 text-sm font-medium hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 hover:scale-110"
            >
              🗑️ Delete
            </button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div>
      <PageHeader 
        title="Events" 
        actions={
          <div className="flex items-center gap-3">
            <input 
              placeholder="🔍 Search events..." 
              className="px-4 py-2 border-2 border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-xl focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all duration-300 outline-none" 
              value={q} 
              onChange={e=>setQ(e.target.value)} 
            />
            <button 
              onClick={()=> setAdding(true)} 
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              ✨ Add Event
            </button>
          </div>
        } 
      />

      <Table columns={[{key:'title', title:'Title'}, {key:'date', title:'Date'}, {key:'time', title:'Start Time'}, {key:'duration', title:'Duration'}, {key:'actions', title:'Actions'}]} data={filtered} renderRow={renderRow} />

      {adding && <AddEventModal date={dayjs().format('YYYY-MM-DD')} onClose={()=> setAdding(false)} />}
      {editing && <EditEventModal event={editing} onClose={()=> setEditing(null)} />}
    </div>
  )
}
