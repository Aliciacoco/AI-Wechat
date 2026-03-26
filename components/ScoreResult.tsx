'use client'

import { tokens } from '@/lib/design-tokens'
import { Card } from '@/components/ui'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import { Button, Badge } from '@/components/ui'

interface BenchmarkArticle {
  title: string
  school: string
  readCount: number
  matchScore: number
}

interface ScoreData {
  scores: Record<string, { score: number; label: string; reason: string }>
  total: number
  grade: string
  summary: string
  suggestions: string[]
  selfBenchmarks?: BenchmarkArticle[]
  competitorBenchmarks?: BenchmarkArticle[]
  competitorSchool?: string
}

interface Props {
  data: ScoreData
  topic?: string
  onGenerateTitles?: () => void
}

const GRADE_STYLE: Record<string, { color: string; bg: string }> = {
  '优秀': { color: '#065F46', bg: '#D1FAE5' },
  '良好': { color: '#1D4ED8', bg: '#DBEAFE' },
  '一般': { color: '#92400E', bg: '#FEF3C7' },
  '待改进': { color: '#991B1B', bg: '#FEE2E2' },
}

export default function ScoreResult({ data, onGenerateTitles }: Props) {
  const radarData = Object.values(data.scores).map(s => ({
    subject: s.label, value: s.score, fullMark: 25,
  }))
  const grade = GRADE_STYLE[data.grade] ?? { color: tokens.color.text.secondary, bg: tokens.color.base.gray }

  return (
    <div className="space-y-4">
      {/* 总评行 */}
      <Card style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Badge style={{ backgroundColor: grade.bg, color: grade.color, fontSize: '12px', flexShrink: 0 }}>
          {data.grade}
        </Badge>
        <p style={{ flex: 1, fontSize: '13px', color: tokens.color.text.secondary, lineHeight: 1.6 }}>{data.summary}</p>
        <Button variant="primary" size="sm" onClick={onGenerateTitles} style={{ flexShrink: 0 }}>
          生成标题 →
        </Button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 雷达图 */}
        <Card style={{ padding: '16px' }}>
          <p style={{ fontSize: '12px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.tertiary, marginBottom: '8px', letterSpacing: tokens.typography.letterSpacing.label }}>
            四维评分
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={tokens.color.divider} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: tokens.color.text.tertiary }} />
              <Radar dataKey="value" stroke={tokens.color.accent} fill={tokens.color.accent} fillOpacity={0.12} strokeWidth={2} />
              <Tooltip formatter={(v) => [`${v}/25`, '得分']} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* 维度进度条 */}
        <Card style={{ padding: '16px' }}>
          <p style={{ fontSize: '12px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.tertiary, marginBottom: '12px', letterSpacing: tokens.typography.letterSpacing.label }}>
            维度分析
          </p>
          <div className="space-y-2.5">
            {Object.values(data.scores).map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: tokens.color.text.secondary, width: '56px', flexShrink: 0 }}>{s.label}</span>
                <div style={{ flex: 1, height: '6px', borderRadius: '99px', backgroundColor: tokens.color.base.gray, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: '99px', backgroundColor: tokens.color.accent, width: `${(s.score / 25) * 100}%`, transition: 'width 0.4s' }} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.primary, width: '20px', textAlign: 'right', flexShrink: 0 }}>{s.score}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 竞品对标 */}
      {((data.selfBenchmarks?.length ?? 0) > 0 || (data.competitorBenchmarks?.length ?? 0) > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.selfBenchmarks && data.selfBenchmarks.length > 0 && (
            <Card style={{ padding: '14px 16px' }}>
              <p style={{ fontSize: '11px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.tertiary, marginBottom: '10px', letterSpacing: tokens.typography.letterSpacing.label }}>本校往年同题</p>
              <ul className="space-y-2">
                {data.selfBenchmarks.map((a, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: tokens.color.text.secondary, flex: 1, lineHeight: 1.5 }}>「{a.title}」</span>
                    <span style={{ fontSize: '12px', fontWeight: tokens.typography.weight.semibold, color: '#065F46', flexShrink: 0 }}>{(a.readCount / 10000).toFixed(1)}万</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          {data.competitorBenchmarks && data.competitorBenchmarks.length > 0 && (
            <Card style={{ padding: '14px 16px', borderColor: '#BFDBFE' }}>
              <p style={{ fontSize: '11px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.accent, marginBottom: '10px', letterSpacing: tokens.typography.letterSpacing.label }}>
                {data.competitorSchool ?? '友校'}同类参考
              </p>
              <ul className="space-y-2">
                {data.competitorBenchmarks.map((a, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: tokens.color.text.secondary, flex: 1, lineHeight: 1.5 }}>「{a.title}」</span>
                    <span style={{ fontSize: '12px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.accent, flexShrink: 0 }}>{(a.readCount / 10000).toFixed(1)}万</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}

      {/* 改进建议 */}
      <Card style={{ padding: '14px 16px', backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
        <p style={{ fontSize: '12px', fontWeight: tokens.typography.weight.semibold, color: '#92400E', marginBottom: '8px' }}>修改建议</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {data.suggestions.map((s, i) => (
            <Badge key={i} variant="warning" style={{ fontSize: '11px', height: 'auto', padding: '4px 10px', lineHeight: 1.5, whiteSpace: 'normal', textAlign: 'left' }}>
              {s}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  )
}
