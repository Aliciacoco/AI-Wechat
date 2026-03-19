'use client'

import { useEffect, useState } from 'react'
import { Calendar, Clock } from 'lucide-react'

interface CalendarEvent {
  id: string
  name: string
  date: string
  type: string
  category: string
  daysAhead: number
  suggestedAngles: string[]
  historicalRef?: { title: string; readCount: number; date: string } | null
}

interface Props {
  accountId: string
  onSelectTopic?: (idea: string) => void
}

function urgencyStyle(days: number) {
  if (days < 0) return { bg: 'bg-gray-50', badge: 'bg-gray-100 text-gray-400', text: '已过' }
  if (days <= 7) return { bg: 'bg-red-50', badge: 'bg-red-100 text-red-600', text: `${days}天后` }
  if (days <= 30) return { bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-600', text: `${days}天后` }
  return { bg: 'bg-gray-50', badge: 'bg-gray-100 text-gray-500', text: `${days}天后` }
}

export default function CalendarPanel({ accountId, onSelectTopic }: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/calendar?accountId=${accountId}`)
      .then(r => r.json())
      .then(d => { setEvents(d); setLoading(false) })
  }, [accountId])

  if (loading) return (
    <div className="space-y-2">
      {[1, 2, 3].map(i => <div key={i} className="h-14 bg-white rounded-xl border border-gray-100 animate-pulse" />)}
    </div>
  )

  return (
    <div className="space-y-2">
      {events.map(ev => {
        const style = urgencyStyle(ev.daysAhead)
        const isExpanded = expanded === ev.id
        return (
          <div key={ev.id} className={`rounded-xl border border-gray-100 shadow-sm overflow-hidden ${style.bg}`}>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 hover:opacity-80 transition-opacity text-left"
              onClick={() => setExpanded(isExpanded ? null : ev.id)}
            >
              <Calendar size={15} className="text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800">{ev.name}</div>
                <div className="text-xs text-gray-400">{ev.date} · {ev.category}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${style.badge}`}>
                {style.text}
              </span>
            </button>

            {isExpanded && (
              <div className="px-4 pb-3 space-y-2 border-t border-white/60">
                <div className="text-xs text-gray-500 font-medium mt-2">推荐角度</div>
                {ev.suggestedAngles.map((angle, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 bg-white rounded-lg px-3 py-2 border border-gray-100">
                    <span className="text-sm text-gray-700">{angle}</span>
                    <button
                      onClick={() => onSelectTopic?.(angle)}
                      className="flex-shrink-0 text-xs bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition-colors"
                    >
                      用这个
                    </button>
                  </div>
                ))}
                {ev.historicalRef && (
                  <div className="bg-white/80 rounded-lg px-3 py-2 border border-gray-100">
                    <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                      <Clock size={10} /> 去年同期爆款参考
                    </div>
                    <div className="text-xs text-gray-700 font-medium">{ev.historicalRef.title}</div>
                    <div className="text-xs text-green-600">{(ev.historicalRef.readCount / 10000).toFixed(1)}万阅读</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
