'use client'

import { Sparkles, Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { CalendarNode, CalendarNodeType } from '@/data/njnu-calendar'
import { tokens } from '@/lib/design-tokens'

interface CalendarNodesProps {
  nodes: CalendarNode[]
  onGenerateIdea: (node: CalendarNode) => void
}

const TYPE_CONFIG: Record<CalendarNodeType, { bg: string; text: string; border: string; icon: string; label: string }> = {
  festival: { bg: '#FFF8E1', text: '#B45309', border: '#FDE68A', icon: '🎉', label: '节日' },
  school:   { bg: '#EBF4FF', text: '#1D4ED8', border: '#BFDBFE', icon: '🏫', label: '校园' },
  season:   { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0', icon: '🌸', label: '节气' },
  recruit:  { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', icon: '📢', label: '招生' },
  youth:    { bg: '#F5F3FF', text: '#5B21B6', border: '#DDD6FE', icon: '⚡', label: '青年' },
}

export default function CalendarNodes({ nodes, onGenerateIdea }: CalendarNodesProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handleGenerate = async (node: CalendarNode) => {
    setLoadingId(node.id)
    await onGenerateIdea(node)
    setLoadingId(null)
  }

  if (nodes.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: 'var(--foreground-tertiary)' }}>
        <p className="text-sm">近90天内暂无节点</p>
      </div>
    )
  }

  return (
    <div className="relative calendar-nodes-scroll" style={{ maxHeight: '520px', overflowY: 'auto', paddingRight: '2px' }}>
      {/* 时间轴线 */}
      <div
        className="absolute left-[11px] top-4 bottom-4 w-0.5"
        style={{ backgroundColor: 'var(--border)' }}
      />

      <div className="space-y-3">
        {nodes.map((node) => {
          const cfg = TYPE_CONFIG[node.type]
          const isUrgent = (node.daysLeft ?? 99) <= 7
          const isHovered = hoveredId === node.id

          return (
            <div
              key={node.id}
              className="relative pl-8"
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* 时间轴圆点 */}
              <div className="absolute left-0 top-3 w-6 h-6 rounded-full flex items-center justify-center z-10 bg-white">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#D1D1D6' }} />
              </div>

              {/* 卡片 */}
              <div
                className="bg-white rounded-xl border transition-all"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span className="text-sm">{cfg.icon}</span>
                      <span
                        className="text-xs font-medium px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: cfg.bg, color: cfg.text }}
                      >
                        {cfg.label}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--foreground-tertiary)' }}>
                        {node.date}
                      </span>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                      style={{
                        backgroundColor: isUrgent ? '#FEF2F2' : 'var(--background-secondary)',
                        color: isUrgent ? '#DC2626' : 'var(--foreground-secondary)',
                      }}
                    >
                      {node.daysLeft === 0 ? '今天' : `${node.daysLeft}天后`}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold mt-1.5 leading-snug" style={{ color: 'var(--foreground)' }}>
                    {node.title}
                  </h3>

                  {/* 悬停时展示生成按钮 */}
                  <div
                    style={{
                      overflow: 'hidden',
                      maxHeight: isHovered ? '40px' : '0',
                      opacity: isHovered ? 1 : 0,
                      marginTop: isHovered ? '8px' : '0',
                      transition: 'max-height 0.2s ease, opacity 0.15s ease, margin-top 0.15s ease',
                    }}
                  >
                    <button
                      disabled={loadingId === node.id}
                      onClick={() => handleGenerate(node)}
                      style={{
                        width: '100%',
                        height: '30px',
                        borderRadius: tokens.radius.buttonSm,
                        border: 'none',
                        backgroundColor: tokens.color.accent,
                        color: tokens.color.base.white,
                        fontSize: '12px',
                        fontWeight: tokens.typography.weight.medium,
                        fontFamily: tokens.typography.fontFamily.zh,
                        cursor: loadingId === node.id ? 'not-allowed' : 'pointer',
                        opacity: loadingId === node.id ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                      }}
                    >
                      {loadingId === node.id ? (
                        <><Loader2 size={12} className="animate-spin" />生成中...</>
                      ) : (
                        <><Sparkles size={12} />生成选题</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
