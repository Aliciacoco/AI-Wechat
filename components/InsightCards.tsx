'use client'

import { useEffect, useState } from 'react'
import { BarChart2, Clock, TrendingUp, Award } from 'lucide-react'
import { Card } from '@/components/ui'
import { tokens } from '@/lib/design-tokens'

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
        <Card key={i} style={{ padding: '20px', height: '176px' }} className="animate-pulse">{' '}</Card>
      ))}
    </div>
  )
  if (!data) return null

  const topType = data.topByType[0]
  const RANK_COLOR = ['#F59E0B', tokens.color.text.tertiary, '#CD7F32']

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 内容类型效果 */}
      <Card style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: tokens.radius.buttonSm, backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart2 size={15} style={{ color: '#065F46' }} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: tokens.typography.weight.medium, color: tokens.color.text.secondary }}>哪类内容最受欢迎</span>
        </div>
        <div className="space-y-2">
          {data.topByType.slice(0, 4).map((t, i) => (
            <div key={t.type} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', width: '16px', textAlign: 'center', fontWeight: tokens.typography.weight.semibold, color: RANK_COLOR[i] ?? tokens.color.text.tertiary, flexShrink: 0 }}>
                {i === 0 ? '★' : `${i + 1}`}
              </span>
              <span style={{ fontSize: '13px', color: tokens.color.text.secondary, flex: 1 }}>{t.type}</span>
              <span style={{ fontSize: '11px', color: tokens.color.text.tertiary }}>均 {(t.avgRead / 10000).toFixed(1)}万</span>
            </div>
          ))}
        </div>
        {topType && (
          <p style={{ marginTop: '10px', paddingTop: '10px', borderTop: `1px solid ${tokens.color.divider}`, fontSize: '11px', color: '#065F46' }}>
            💡 {topType.type}类文章平均阅读最高
          </p>
        )}
      </Card>

      {/* 历史爆款 */}
      <Card style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: tokens.radius.buttonSm, backgroundColor: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={15} style={{ color: '#F59E0B' }} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: tokens.typography.weight.medium, color: tokens.color.text.secondary }}>历史爆款 Top 3</span>
        </div>
        <div className="space-y-3">
          {data.topArticles.slice(0, 3).map((a, i) => (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                <span style={{ fontSize: '11px', fontWeight: tokens.typography.weight.semibold, color: RANK_COLOR[i] ?? tokens.color.text.tertiary }}>#{i + 1}</span>
                <span style={{ fontSize: '11px', color: '#065F46', fontWeight: tokens.typography.weight.medium }}>{(a.readCount / 10000).toFixed(1)}万</span>
              </div>
              <p className="line-clamp-2" style={{ fontSize: '12px', color: tokens.color.text.primary, lineHeight: 1.5 }}>{a.title}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* 发布时机 */}
      <Card style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: tokens.radius.buttonSm, backgroundColor: '#EBF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={15} style={{ color: tokens.color.accent }} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: tokens.typography.weight.medium, color: tokens.color.text.secondary }}>发布时机</span>
          <div style={{ position: 'relative', marginLeft: 'auto' }} className="group">
            <span style={{ fontSize: '10px', color: tokens.color.accent, border: `1px solid #BFDBFE`, borderRadius: tokens.radius.button, padding: '2px 8px', cursor: 'default', userSelect: 'none' }}>
              查看建议
            </span>
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 4px)', width: '220px',
              backgroundColor: tokens.color.base.white, border: `1px solid ${tokens.color.border}`,
              borderRadius: tokens.radius.buttonSm, boxShadow: tokens.shadow.diffuse,
              padding: '10px 12px', fontSize: '12px', color: tokens.color.text.secondary, lineHeight: 1.5,
              zIndex: 20, pointerEvents: 'none',
            }} className="opacity-0 group-hover:opacity-100 transition-opacity">
              {data.bestTimeHint}
            </div>
          </div>
        </div>
        {data.competitorInsight && (
          <div style={{ backgroundColor: tokens.color.base.gray, borderRadius: tokens.radius.buttonSm, padding: '10px 12px' }}>
            <p style={{ fontSize: '11px', color: tokens.color.text.tertiary, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
              <TrendingUp size={10} /> 竞品对比
            </p>
            <p style={{ fontSize: '12px', color: tokens.color.text.secondary }}>{data.competitorInsight}</p>
          </div>
        )}
        <p style={{ marginTop: '10px', fontSize: '11px', color: tokens.color.text.tertiary }}>
          基于 {data.totalArticles} 篇历史文章 · 均阅读 {(data.avgReadCount / 10000).toFixed(1)}万
        </p>
      </Card>
    </div>
  )
}
