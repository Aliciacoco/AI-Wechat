'use client'

import { Sparkles, ArrowRight } from 'lucide-react'

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
  // 判断是旧格式（字符串）还是新格式（对象）
  const isNewFormat = typeof content === 'object' && 'theme' in content

  return (
    <div
      className={`rounded-lg p-4 flex gap-3 mb-6 transition-all ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
      style={{
        backgroundColor: 'var(--primary-light)',
        borderLeft: '3px solid var(--primary)',
      }}
      onClick={onClick}
    >
      <div className="flex-shrink-0 mt-0.5">
        <Sparkles size={16} style={{ color: 'var(--primary)' }} className={loading ? 'animate-pulse' : ''} />
      </div>
      <div className="flex-1">
        <div className="text-xs font-semibold mb-1" style={{ color: 'var(--primary)' }}>
          AI 简报
        </div>
        {loading ? (
          <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
            正在分析数据...
          </p>
        ) : isNewFormat ? (
          <div>
            <p className="text-sm mb-2" style={{ color: 'var(--foreground-secondary)' }}>
              {(content as AIBriefData).text}
            </p>
            <p className="text-base font-bold mb-1" style={{ color: 'var(--foreground)' }}>
              {(content as AIBriefData).theme}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground-tertiary)' }}>
              {(content as AIBriefData).description}
            </p>
          </div>
        ) : (
          <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
            {content as string}
          </p>
        )}
      </div>
      {onClick && !loading && (
        <div className="flex-shrink-0 mt-0.5">
          <ArrowRight size={16} style={{ color: 'var(--primary)' }} />
        </div>
      )}
    </div>
  )
}
