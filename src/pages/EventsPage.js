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
      <tr key={ev.id} className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
        <td className="px-4 py-3">{ev.title}</td>
        <td className="px-4 py-3">{formatDate(ev.date)}</td>
        <td className="px-4 py-3">{formatTime(ev.time)}</td>
        <td className="px-4 py-3">{ev.duration}m</td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <button onClick={()=> setEditing(ev)} className="text-indigo-600 dark:text-indigo-400 text-sm">Edit</button>
            <button onClick={()=> { if(window.confirm('Delete?')) deleteEvent(ev.id)}} className="text-red-600 dark:text-red-400 text-sm">Delete</button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div>
      <PageHeader title="Events" actions={<div className="flex items-center gap-2"><input placeholder="Search" className="px-2 py-1 border dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded" value={q} onChange={e=>setQ(e.target.value)} /><button onClick={()=> setAdding(true)} className="px-3 py-1 bg-indigo-600 text-white rounded">Add Event</button></div>} />

      <Table columns={[{key:'title', title:'Title'}, {key:'date', title:'Date'}, {key:'time', title:'Start Time'}, {key:'duration', title:'Duration'}, {key:'actions', title:'Actions'}]} data={filtered} renderRow={renderRow} />

      {adding && <AddEventModal date={dayjs().format('YYYY-MM-DD')} onClose={()=> setAdding(false)} />}
      {editing && <EditEventModal event={editing} onClose={()=> setEditing(null)} />}
    </div>
  )
}
