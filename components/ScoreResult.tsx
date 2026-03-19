'use client'

import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

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

const gradeColor: Record<string, string> = {
  '优秀': 'text-green-600 bg-green-50',
  '良好': 'text-blue-600 bg-blue-50',
  '一般': 'text-amber-600 bg-amber-50',
  '待改进': 'text-red-500 bg-red-50',
}

export default function ScoreResult({ data, onGenerateTitles }: Props) {
  const radarData = Object.values(data.scores).map(s => ({
    subject: s.label,
    value: s.score,
    fullMark: 25,
  }))

  const gradeClass = gradeColor[data.grade] || 'text-gray-600 bg-gray-50'

  return (
    <div className="space-y-4">
      {/* 评级摘要行（去掉大号数字，保留等级标签 + 一句话总评） */}
      <div className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <span className={`inline-flex text-sm font-semibold px-3 py-1.5 rounded-full flex-shrink-0 ${gradeClass}`}>
          {data.grade}
        </span>
        <div className="flex-1 text-sm text-gray-600 leading-relaxed">{data.summary}</div>
        <button
          onClick={onGenerateTitles}
          className="flex-shrink-0 bg-green-500 text-white text-sm px-4 py-2 rounded-xl hover:bg-green-600 transition-colors font-medium"
        >
          生成标题 →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 雷达图 */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-2">四维评分</div>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Radar dataKey="value" stroke="#16a34a" fill="#16a34a" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip formatter={(v) => [`${v}/25`, '得分']} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* 各维度（压缩为迷你进度条，去掉理由文字） */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">维度分析</div>
          <div className="space-y-2.5">
            {Object.values(data.scores).map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-16 flex-shrink-0">{s.label}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${(s.score / 25) * 100}%` }} />
                </div>
                <span className="text-xs font-semibold text-gray-700 w-6 text-right">{s.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 竞品对标参照 */}
      {((data.selfBenchmarks && data.selfBenchmarks.length > 0) || (data.competitorBenchmarks && data.competitorBenchmarks.length > 0)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.selfBenchmarks && data.selfBenchmarks.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">本校往年同题</div>
              <ul className="space-y-2">
                {data.selfBenchmarks.map((a, i) => (
                  <li key={i} className="flex items-start justify-between gap-2">
                    <span className="text-xs text-gray-700 flex-1 leading-snug">「{a.title}」</span>
                    <span className="text-xs font-semibold text-green-600 flex-shrink-0 tabular-nums">
                      {(a.readCount / 10000).toFixed(1)}万
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.competitorBenchmarks && data.competitorBenchmarks.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
              <div className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-3">
                {data.competitorSchool ?? '友校'}同类参考
              </div>
              <ul className="space-y-2">
                {data.competitorBenchmarks.map((a, i) => (
                  <li key={i} className="flex items-start justify-between gap-2">
                    <span className="text-xs text-gray-700 flex-1 leading-snug">「{a.title}」</span>
                    <span className="text-xs font-semibold text-blue-500 flex-shrink-0 tabular-nums">
                      {(a.readCount / 10000).toFixed(1)}万
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 改进建议 - pill 标签样式 */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
        <div className="text-xs font-semibold text-amber-700 mb-2">修改建议</div>
        <div className="flex flex-wrap gap-2">
          {data.suggestions.map((s, i) => (
            <span key={i} className="inline-block text-xs text-amber-800 bg-amber-100 rounded-full px-3 py-1.5 leading-snug">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
