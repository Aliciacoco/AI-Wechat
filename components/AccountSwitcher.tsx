'use client'

import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'

const ACCOUNTS = [
  { id: 'njnu-main', label: '南京师范大学', sub: '官方主号', role: 'own' },
  { id: 'njnu-admissions', label: '南师招生', sub: '招生专号', role: 'own' },
  { id: 'ecnu-main', label: '华东师范大学', sub: '竞品参考', role: 'competitor' },
  { id: 'ecnu-admissions', label: '华东师大本科招生', sub: '竞品参考', role: 'competitor' },
]

interface Props {
  accountId: string
  onChange: (id: string) => void
}

export default function AccountSwitcher({ accountId, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const current = ACCOUNTS.find(a => a.id === accountId) || ACCOUNTS[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm hover:border-green-400 transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
        <span className="font-medium text-gray-800">{current.label}</span>
        <span className="text-gray-400 text-xs">{current.sub}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-56 overflow-hidden">
            <div className="px-3 pt-2 pb-1 text-xs text-gray-400 font-medium">我方账号</div>
            {ACCOUNTS.filter(a => a.role === 'own').map(a => (
              <button key={a.id} onClick={() => { onChange(a.id); setOpen(false) }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-green-50 transition-colors text-left">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">{a.label}</div>
                  <div className="text-xs text-gray-400">{a.sub}</div>
                </div>
                {accountId === a.id && <Check size={14} className="text-green-500" />}
              </button>
            ))}
            <div className="px-3 pt-2 pb-1 text-xs text-gray-400 font-medium border-t border-gray-100 mt-1">竞品参考</div>
            {ACCOUNTS.filter(a => a.role === 'competitor').map(a => (
              <button key={a.id} onClick={() => { onChange(a.id); setOpen(false) }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-600">{a.label}</div>
                  <div className="text-xs text-gray-400">{a.sub}</div>
                </div>
                {accountId === a.id && <Check size={14} className="text-green-500" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
