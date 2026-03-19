'use client'

import { Calendar, Sparkles, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface CalendarNode {
  id: string
  date: string
  title: string
  type: 'festival' | 'school' | 'season'
  description: string
  daysLeft: number
}

interface CalendarNodesProps {
  nodes: CalendarNode[]
  onGenerateIdea: (node: CalendarNode) => void
}

const TYPE_COLORS = {
  festival: { bg: '#fef3c7', text: '#f59e0b', icon: '🎉' },
  school: { bg: '#dbeafe', text: '#3b82f6', icon: '🏫' },
  season: { bg: '#d1fae5', text: '#10b981', icon: '🌸' },
}

export default function CalendarNodes({ nodes, onGenerateIdea }: CalendarNodesProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleGenerate = async (node: CalendarNode) => {
    setLoadingId(node.id)
    await onGenerateIdea(node)
    setLoadingId(null)
  }

  return (
    <div className="relative">
      {/* 时间轴线 */}
      <div
        className="absolute left-[11px] top-4 bottom-4 w-0.5"
        style={{ backgroundColor: 'var(--border)' }}
      />

      <div className="space-y-4">
        {nodes.map((node, index) => {
          const colors = TYPE_COLORS[node.type]
          return (
            <div key={node.id} className="relative pl-8">
              {/* 时间轴节点 - 灰色小圆点 */}
              <div
                className="absolute left-0 top-3 w-6 h-6 rounded-full flex items-center justify-center z-10"
                style={{
                  backgroundColor: 'white',
                }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: 'var(--foreground-tertiary)',
                  }}
                />
              </div>

              {/* 卡片内容 */}
              <div
                className="bg-white rounded-lg border-2 p-3 transition-all hover:shadow-md group"
                style={{ borderColor: 'var(--border)' }}
              >
                {/* 日期和倒计时 */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{colors.icon}</span>
                    <span className="text-xs font-bold" style={{ color: colors.text }}>
                      {node.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-xs px-2 py-0.5 rounded font-bold"
                      style={{
                        backgroundColor: node.daysLeft <= 7 ? '#fee2e2' : 'var(--background-secondary)',
                        color: node.daysLeft <= 7 ? '#ef4444' : 'var(--foreground-secondary)'
                      }}
                    >
                      还有 {node.daysLeft} 天
                    </span>
                  </div>
                </div>

                {/* 标题 */}
                <h3 className="text-sm font-bold mb-2 leading-snug" style={{ color: 'var(--foreground)' }}>
                  {node.title}
                </h3>

                {/* 生成按钮 */}
                <button
                  onClick={() => handleGenerate(node)}
                  disabled={loadingId === node.id}
                  className="w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border-b-4 opacity-0 group-hover:opacity-100"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    borderBottomColor: 'var(--primary-hover)'
                  }}
                  onMouseEnter={(e) => {
                    if (loadingId !== node.id) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (loadingId !== node.id) {
                      e.currentTarget.style.transform = 'translateY(0)'
                    }
                  }}
                >
                  {loadingId === node.id ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      AI 标题
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
