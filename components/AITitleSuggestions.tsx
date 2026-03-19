'use client'

import { Star, Copy, Check, Eye } from 'lucide-react'
import { useState } from 'react'

interface TitleOption {
  id: string
  title: string
  style: string
  description: string
  audience?: string
  isFavorited?: boolean
  estimatedViews?: number
  tone?: string
  hotspot?: string
}

interface AITitleSuggestionsProps {
  titles: TitleOption[]
  loading?: boolean
  onFavorite: (id: string) => void
  onCopy: (title: string) => void
}

// 格式化浏览量
function formatViews(views: number): string {
  if (views >= 10000) {
    return (views / 10000).toFixed(1) + 'w'
  }
  if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'k'
  }
  return views.toString()
}

export default function AITitleSuggestions({ titles, loading = false, onFavorite, onCopy }: AITitleSuggestionsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (id: string, title: string) => {
    onCopy(title)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-lg border p-4 animate-pulse"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="flex gap-2 mb-2">
              <div className="h-6 bg-gray-200 rounded w-20" />
              <div className="h-6 bg-gray-200 rounded w-20" />
            </div>
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {titles.map((title) => (
        <div
          key={title.id}
          className="rounded-xl border-2 p-4 transition-all hover:shadow-md group"
          style={{ borderColor: title.isFavorited ? 'var(--primary)' : 'var(--border)' }}
        >
          {/* 标题 */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-base font-bold leading-relaxed flex-1" style={{ color: 'var(--foreground)' }}>
              {title.title}
            </h3>
            {/* 操作按钮 */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => onFavorite(title.id)}
                className="w-8 h-8 rounded-md flex items-center justify-center transition-all"
                style={{
                  color: title.isFavorited ? '#fbbf24' : 'var(--foreground-tertiary)',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!title.isFavorited) {
                    e.currentTarget.style.backgroundColor = 'var(--background-hover)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!title.isFavorited) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
                title="收藏"
              >
                <Star size={16} fill={title.isFavorited ? '#fbbf24' : 'none'} />
              </button>

              <button
                onClick={() => handleCopy(title.id, title.title)}
                className="w-8 h-8 rounded-md flex items-center justify-center transition-all"
                style={{
                  color: copiedId === title.id ? '#10b981' : 'var(--foreground-tertiary)',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                title="复制"
              >
                {copiedId === title.id ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* 标签行 */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {/* 类型标签 */}
            <span
              className="text-xs px-2 py-1 rounded font-medium"
              style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}
            >
              {title.style}
            </span>

            {/* 预估浏览量 */}
            {title.estimatedViews !== undefined && (
              <span
                className="text-xs px-2 py-1 rounded font-medium flex items-center gap-1"
                style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}
              >
                <Eye size={12} />
                预估 {formatViews(title.estimatedViews)}
              </span>
            )}

            {/* 受众标签 */}
            {title.audience && (
              <span
                className="text-xs px-2 py-1 rounded font-medium"
                style={{ backgroundColor: '#fef3c7', color: '#d97706' }}
              >
                👥 {title.audience}
              </span>
            )}

            {/* 语气标签 */}
            {title.tone && (
              <span
                className="text-xs px-2 py-1 rounded font-medium"
                style={{ backgroundColor: '#e0e7ff', color: '#6366f1' }}
              >
                💬 {title.tone}
              </span>
            )}

            {/* 热点关联 */}
            {title.hotspot && (
              <span
                className="text-xs px-2 py-1 rounded font-medium"
                style={{ backgroundColor: '#dbeafe', color: '#3b82f6' }}
              >
                🔥 {title.hotspot}
              </span>
            )}
          </div>

          {/* 描述 */}
          <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground-tertiary)' }}>
            {title.description}
          </p>
        </div>
      ))}
    </div>
  )
}
