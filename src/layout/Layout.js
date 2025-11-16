import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children, onToday }) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-gray-50 to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 transition-all duration-500">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar onToday={onToday} />
        <main className="p-4 md:p-6 transition-all duration-300">
          <div className="page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
