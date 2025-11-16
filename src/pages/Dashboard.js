import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import { useEvents } from '../context/EventContext'
import dayjs from 'dayjs'

function StatCard({title, value}){
  return (
    <Card>
      <div className="text-sm text-slate-500 dark:text-slate-400">{title}</div>
      <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</div>
    </Card>
  )
}

export default function Dashboard(){
  const navigate = useNavigate();
  const { events } = useEvents();
  const upcoming = events
    .slice()
    .filter(e=> dayjs(e.date).isAfter(dayjs().subtract(1,'day')))
    .sort((a,b)=> (a.date+b.time) > (b.date+a.time)?1:-1)
    .slice(0,5)

  const past = events
    .slice()
    .filter(e=> dayjs(e.date).isBefore(dayjs().startOf('day')))
    .sort((a,b)=> (a.date+b.time) > (b.date+a.time)?-1:1)
    .slice(0,5)

  return (
    <div>
      <PageHeader title="Dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Upcoming Events" value={upcoming.length} />
        <StatCard title="Past Events" value={past.length} />
        <Card title="Quick Actions">
          <div className="space-y-2">
            <button onClick={()=> navigate('/events', { state: { openAddModal: true } })} className="px-3 py-2 bg-indigo-600 text-white rounded w-full">Add Event</button>
            <button onClick={()=> navigate('/calendar')} className="px-3 py-2 border dark:border-slate-600 rounded w-full text-slate-900 dark:text-slate-100">View Calendar</button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Upcoming Events">
          <div className="space-y-3">
            {upcoming.map(ev=> (
              <div key={ev.id} className="p-2 border dark:border-slate-700 rounded flex justify-between items-center">
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">{ev.title}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{dayjs(ev.date).format('MMM D')} • {ev.time}</div>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{ev.duration}m</div>
              </div>
            ))}
            {!upcoming.length && <div className="text-sm text-slate-500 dark:text-slate-400">No upcoming events</div>}
          </div>
        </Card>

        <Card title="Past Events">
          <div className="space-y-3">
            {past.map(ev=> (
              <div key={ev.id} className="p-2 border dark:border-slate-700 rounded flex justify-between items-center">
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">{ev.title}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{dayjs(ev.date).format('MMM D')} • {ev.time}</div>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{ev.duration}m</div>
              </div>
            ))}
            {!past.length && <div className="text-sm text-slate-500 dark:text-slate-400">No past events</div>}
          </div>
        </Card>
      </div>
    </div>
  )
}
