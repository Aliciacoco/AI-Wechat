'use client'

import { useEffect, useState } from 'react'
import { BarChart2, Clock, TrendingUp, Award } from 'lucide-react'

interface InsightData {
  totalArticles: number
  avgReadCount: number
  topByType: { type: string; count: number; avgRead: number }[]
  topArticles: { title: string; readCount: number; publishDate: string }[]
  bestTimeHint: string
  competitorInsight?: string
}

interface Props { accountId: string }

export default function InsightCards({ accountId }: Props) {
  const [data, setData] = useState<InsightData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/insights?accountId=${accountId}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [accountId])

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse h-44" />
      ))}
    </div>
  )
  if (!data) return null

  const topType = data.topByType[0]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 卡片1：内容类型效果 */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
            <BarChart2 size={16} className="text-green-600" />
          </div>
          <span className="text-sm font-medium text-gray-600">哪类内容最受欢迎</span>
        </div>
        <div className="space-y-2">
          {data.topByType.slice(0, 4).map((t, i) => (
            <div key={t.type} className="flex items-center gap-2">
              <span className={`text-xs w-4 text-center font-bold ${i === 0 ? 'text-amber-500' : 'text-gray-300'}`}>
                {i === 0 ? '★' : `${i + 1}`}
              </span>
              <span className="text-sm text-gray-700 flex-1">{t.type}</span>
              <span className="text-xs text-gray-400">均 {(t.avgRead / 10000).toFixed(1)}万</span>
            </div>
          ))}
        </div>
        {topType && (
          <div className="mt-3 pt-3 border-t border-gray-50 text-xs text-green-600">
            💡 {topType.type}类文章平均阅读最高
          </div>
        )}
      </div>

      {/* 卡片2：历史爆款 */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
            <Award size={16} className="text-amber-500" />
          </div>
          <span className="text-sm font-medium text-gray-600">历史爆款 Top 3</span>
        </div>
        <div className="space-y-3">
          {data.topArticles.slice(0, 3).map((a, i) => (
            <div key={i}>
              <div className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
                <span className={`font-bold ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-gray-400' : 'text-orange-300'}`}>
                  #{i + 1}
                </span>
                <span className="text-green-600 font-medium">{(a.readCount / 10000).toFixed(1)}万</span>
              </div>
              <div className="text-sm text-gray-800 leading-snug line-clamp-2">{a.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 卡片3：发布时机 + 竞品 */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Clock size={16} className="text-blue-500" />
          </div>
          <span className="text-sm font-medium text-gray-600">发布时机</span>
          {/* 悬浮气泡：仅在 hover 时显示策略文本 */}
          <div className="relative group ml-auto">
            <span className="text-[10px] text-blue-400 border border-blue-100 rounded-full px-2 py-0.5 cursor-default select-none">
              查看建议
            </span>
            <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs text-gray-600 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
              {data.bestTimeHint}
            </div>
          </div>
        </div>
        {data.competitorInsight && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
              <TrendingUp size={11} /> 竞品对比
            </div>
            <div className="text-xs text-gray-600">{data.competitorInsight}</div>
          </div>
        )}
        <div className="mt-3 text-xs text-gray-400">
          基于 {data.totalArticles} 篇历史文章 · 均阅读 {(data.avgReadCount / 10000).toFixed(1)}万
        </div>
      </div>
    </div>
  )
}
