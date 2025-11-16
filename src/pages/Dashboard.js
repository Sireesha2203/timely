import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import { useEvents } from '../context/EventContext'
import dayjs from 'dayjs'

function StatCard({title, value, delay = 0}){
  return (
    <div style={{ animationDelay: `${delay}s` }} className="card-enter">
      <Card>
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{title}</div>
        <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {value}
        </div>
      </Card>
    </div>
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
        <StatCard title="Upcoming Events" value={upcoming.length} delay={0} />
        <StatCard title="Past Events" value={past.length} delay={0.1} />
        <div style={{ animationDelay: '0.2s' }} className="card-enter">
          <Card title="Quick Actions">
            <div className="space-y-2">
              <button 
                onClick={()=> navigate('/events', { state: { openAddModal: true } })} 
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg w-full font-medium shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
              >
                ✨ Add Event
              </button>
              <button 
                onClick={()=> navigate('/calendar')} 
                className="px-4 py-2.5 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg w-full text-slate-900 dark:text-slate-100 font-medium hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200"
              >
                📅 View Calendar
              </button>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div style={{ animationDelay: '0.3s' }} className="slide-left">
          <Card title="Upcoming Events">
            <div className="space-y-2">
              {upcoming.map((ev, index)=> (
                <div 
                  key={ev.id} 
                  style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                  className="p-3 border border-indigo-100 dark:border-slate-700 rounded-lg flex justify-between items-center hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md hover:scale-[1.01] transition-all duration-200 cursor-pointer bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 card-enter"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{ev.title}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                      <span>📅 {dayjs(ev.date).format('MMM D')}</span>
                      <span>•</span>
                      <span>🕒 {ev.time}</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                    {ev.duration}m
                  </div>
                </div>
              ))}
              {!upcoming.length && (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                  <div className="text-4xl mb-2">📭</div>
                  <div className="text-sm">No upcoming events</div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div style={{ animationDelay: '0.35s' }} className="slide-right">
          <Card title="Past Events">
            <div className="space-y-2">
              {past.map((ev, index)=> (
                <div 
                  key={ev.id}
                  style={{ animationDelay: `${0.45 + index * 0.05}s` }}
                  className="p-3 border border-gray-200 dark:border-slate-700 rounded-lg flex justify-between items-center hover:shadow-md hover:scale-[1.01] transition-all duration-200 cursor-pointer opacity-75 hover:opacity-100 card-enter"
                >
                  <div>
                    <div className="font-semibold text-slate-700 dark:text-slate-300">{ev.title}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                      <span>📅 {dayjs(ev.date).format('MMM D')}</span>
                      <span>•</span>
                      <span>🕒 {ev.time}</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                    {ev.duration}m
                  </div>
                </div>
              ))}
              {!past.length && (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                  <div className="text-4xl mb-2">📝</div>
                  <div className="text-sm">No past events</div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
