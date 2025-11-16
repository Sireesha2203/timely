import React from 'react'

export default function Card({ title, children, className='' }){
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 ${className}`}>
      {title && <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">{title}</div>}
      <div>{children}</div>
    </div>
  )
}
