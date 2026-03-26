'use client'

import { Sparkles, ArrowRight } from 'lucide-react'
import { tokens } from '@/lib/design-tokens'

interface AIBriefData {
  text: string
  theme: string
  description: string
}

interface AIBriefProps {
  content: string | AIBriefData
  loading?: boolean
  onClick?: () => void
}

export default function AIBrief({ content, loading = false, onClick }: AIBriefProps) {
  const isNewFormat = typeof content === 'object' && 'theme' in content

  return (
    <div
      style={{
        borderRadius: tokens.radius.card,
        padding: '14px 16px',
        marginBottom: '24px',
        backgroundColor: '#EBF4FF',
        borderLeft: `3px solid ${tokens.color.accent}`,
        display: 'flex',
        gap: '12px',
        cursor: onClick ? 'pointer' : undefined,
        transition: 'box-shadow 0.15s',
      }}
      onClick={onClick}
      onMouseEnter={(e) => { if (onClick) e.currentTarget.style.boxShadow = tokens.shadow.diffuse }}
      onMouseLeave={(e) => { if (onClick) e.currentTarget.style.boxShadow = tokens.shadow.none }}
    >
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        <Sparkles size={15} style={{ color: tokens.color.accent }} className={loading ? 'animate-pulse' : ''} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '11px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.accent, marginBottom: '4px', letterSpacing: tokens.typography.letterSpacing.label }}>
          AI 简报
        </p>
        {loading ? (
          <p style={{ fontSize: '13px', color: tokens.color.text.secondary }}>正在分析数据...</p>
        ) : isNewFormat ? (
          <div>
            <p style={{ fontSize: '12px', color: tokens.color.text.secondary, marginBottom: '4px' }}>
              {(content as AIBriefData).text}
            </p>
            <p style={{ fontSize: '14px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.primary, marginBottom: '2px' }}>
              {(content as AIBriefData).theme}
            </p>
            <p style={{ fontSize: '12px', color: tokens.color.text.tertiary, lineHeight: 1.5 }}>
              {(content as AIBriefData).description}
            </p>
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: tokens.color.text.primary, lineHeight: 1.5 }}>
            {content as string}
          </p>
        )}
      </div>
      {onClick && !loading && (
        <div style={{ flexShrink: 0, marginTop: '2px' }}>
          <ArrowRight size={15} style={{ color: tokens.color.accent }} />
        </div>
      )}
    </div>
  )
}
