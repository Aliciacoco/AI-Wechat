'use client'

import { useEffect, useState } from 'react'
import { Flame, Loader2, ChevronRight, Zap } from 'lucide-react'

interface HotTopic {
  id: string
  keyword: string
  heat: number
  trend: 'rising' | 'stable' | 'falling'
  source: string
  suggestedAngle: string
}

interface Props {
  accountId: string
  onSelectTopic?: (idea: string) => void
}

export default function HotTopics({ accountId, onSelectTopic }: Props) {
  const [topics, setTopics] = useState<HotTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [expanding, setExpanding] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<Record<string, { title: string; angle: string; audience: string; reason: string }[]>>({})

  useEffect(() => {
    setLoading(true)
    fetch(`/api/hotTopics?accountId=${accountId}`)
      .then(r => r.json())
      .then(d => { setTopics(d); setLoading(false) })
  }, [accountId])

  const handleExpand = async (topic: HotTopic) => {
    if (recommendations[topic.id]) {
      setExpanding(expanding === topic.id ? null : topic.id)
      return
    }
    setExpanding(topic.id)
    const res = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, keyword: topic.keyword })
    })
    const data = await res.json()
    setRecommendations(prev => ({ ...prev, [topic.id]: Array.isArray(data) ? data : [] }))
  }

  if (loading) return (
    <div className="space-y-2">
      {[1, 2, 3].map(i => <div key={i} className="h-14 bg-white rounded-xl border border-gray-100 animate-pulse" />)}
    </div>
  )

  const trendIcon = (t: string) => t === 'rising' ? '↑' : t === 'falling' ? '↓' : '→'
  const trendColor = (t: string) => t === 'rising' ? 'text-red-500' : t === 'falling' ? 'text-blue-400' : 'text-gray-400'

  return (
    <div className="space-y-2">
      {topics.map(topic => (
        <div key={topic.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            onClick={() => handleExpand(topic)}
          >
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Flame size={14} className="text-orange-400" />
              <div className="w-10 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 rounded-full" style={{ width: `${topic.heat}%` }} />
              </div>
              <span className={`text-xs font-bold ${trendColor(topic.trend)}`}>{trendIcon(topic.trend)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800">{topic.keyword}</div>
              <div className="text-xs text-gray-400 truncate">{topic.suggestedAngle}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-gray-300">{topic.source}</span>
              {expanding === topic.id && !recommendations[topic.id]
                ? <Loader2 size={14} className="animate-spin text-green-500" />
                : <ChevronRight size={14} className={`text-gray-300 transition-transform ${expanding === topic.id ? 'rotate-90' : ''}`} />
              }
            </div>
          </button>

          {expanding === topic.id && recommendations[topic.id] && (
            <div className="border-t border-gray-50 px-4 py-3 bg-green-50/40 space-y-2">
              <div className="flex items-center gap-1 text-xs text-green-600 font-medium mb-2">
                <Zap size={12} /> AI 为该账号生成的选题方向
              </div>
              {recommendations[topic.id].map((r, i) => (
                <div key={i} className="bg-white rounded-lg p-3 border border-green-100">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium text-sm text-gray-800">{r.title}</div>
                    <button
                      onClick={() => onSelectTopic?.(r.title)}
                      className="flex-shrink-0 text-xs bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition-colors"
                    >
                      用这个
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{r.angle}</div>
                  <div className="text-xs text-gray-400 mt-1">受众：{r.audience}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
