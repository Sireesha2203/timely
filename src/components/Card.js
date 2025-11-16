import React from 'react'

export default function Card({ title, children, className='' }){
  return (
    <div className={`
      bg-white dark:bg-slate-800/90 rounded-2xl 
      shadow-lg hover:shadow-2xl 
      border border-gray-100/50 dark:border-slate-700/50 
      p-6 
      transition-all duration-500 ease-out
      hover:scale-[1.02] hover:-translate-y-1
      backdrop-blur-sm
      ${className}
    `}>
      {title && (
        <div className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2.5 tracking-wide uppercase">
          <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse"></div>
          {title}
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}
