import React from 'react'

export default function Table({ columns, data, renderRow }){
  return (
    <div className="overflow-auto bg-white dark:bg-slate-800/90 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700/50 backdrop-blur-sm card-enter">
      <table className="min-w-full text-sm">
        <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-slate-700 dark:text-slate-200">
          <tr>
            {columns.map((c)=> (
              <th key={c.key} className="px-5 py-4 text-left font-bold uppercase tracking-wider text-xs">
                {c.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-slate-900 dark:text-slate-100 divide-y divide-gray-100 dark:divide-slate-700/50">
          {data.map((row)=> (
            renderRow ? renderRow(row) : (
              <tr key={row.id} className="border-t dark:border-slate-700/50 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300">
                {columns.map((c)=> <td key={c.key} className="px-5 py-4">{row[c.key]}</td>)}
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  )
}
