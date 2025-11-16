import React, { createContext, useContext, useEffect, useState } from 'react';
import data from '../data/events.json';
import { hasConflict } from '../utils/conflicts';

const EventContext = createContext(null);

export function useEvents(){
  return useContext(EventContext);
}

export function EventProvider({ children }){
  const [events, setEvents] = useState(() => {
    try {
      const raw = localStorage.getItem('timely.events');
      return raw ? JSON.parse(raw) : data;
    } catch(e){
      return data;
    }
  });

  useEffect(() => {
    localStorage.setItem('timely.events', JSON.stringify(events));
  }, [events]);

  function addEvent(ev){
    // generate id
    const id = Date.now().toString();
    const candidate = { ...ev, id };
    const conflict = hasConflict(candidate, events);
    setEvents((s) => [...s, candidate]);
    return { id, conflict };
  }

  function updateEvent(id, updates){
    setEvents((s) => s.map((ev) => ev.id === id ? { ...ev, ...updates } : ev));
    const updated = { ...(events.find(e=>e.id===id)||{}), ...updates };
    const conflict = hasConflict(updated, events, id);
    return { conflict };
  }

  function deleteEvent(id){
    setEvents((s) => s.filter((ev) => ev.id !== id));
  }

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
}
