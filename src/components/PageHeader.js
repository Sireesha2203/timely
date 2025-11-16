import React from 'react'

export default function PageHeader({ title, actions }){
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  )
}
