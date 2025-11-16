import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children, onToday }) {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar onToday={onToday} />
        <main className="p-4 md:p-6 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">{children}</main>
      </div>
    </div>
  )
}
