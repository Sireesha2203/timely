import React from 'react'

export default function Table({ columns, data, renderRow }){
  return (
    <div className="overflow-auto bg-white dark:bg-slate-800 rounded shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
          <tr>
            {columns.map((c)=> <th key={c.key} className="px-4 py-3 text-left">{c.title}</th>)}
          </tr>
        </thead>
        <tbody className="text-slate-900 dark:text-slate-100">
          {data.map((row)=> (
            renderRow ? renderRow(row) : (
              <tr key={row.id} className="border-t dark:border-slate-700">
                {columns.map((c)=> <td key={c.key} className="px-4 py-3">{row[c.key]}</td>)}
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  )
}
