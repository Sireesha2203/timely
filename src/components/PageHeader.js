import React from 'react'

export default function PageHeader({ title, actions }){
  return (
    <div className="flex items-center justify-between mb-6 slide-left">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
        {title}
      </h1>
      <div className="flex items-center gap-3 slide-right">{actions}</div>
    </div>
  )
}
