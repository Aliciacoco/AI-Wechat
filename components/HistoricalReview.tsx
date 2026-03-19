'use client'

import { Clock, Eye, ThumbsUp, ExternalLink, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface HistoricalArticle {
  id: string
  title: string
  publishDate: string
  views: number
  likes: number
  url: string
  cover?: string
}

interface HistoricalReviewProps {
  articles: HistoricalArticle[]
  loading?: boolean
  topic: string
}

export default function HistoricalReview({ articles, loading = false, topic }: HistoricalReviewProps) {
  const [showAll, setShowAll] = useState(false)

  // 默认只显示1条
  const displayedArticles = showAll ? articles : articles.slice(0, 1)
  const hasMore = articles.length > 1

  if (loading) {
    return (
      <div className="space-y-3">
        {[1].map((i) => (
          <div
            key={i}
            className="rounded-lg border p-4 animate-pulse"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
              <div className="w-32 h-24 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div
        className="rounded-lg border p-8 text-center"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background-secondary)' }}
      >
        <p className="text-sm" style={{ color: 'var(--foreground-tertiary)' }}>
          未找到「{topic}」相关的历史文章
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {displayedArticles.map((article) => (
        <a
          key={article.id}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-xl border-2 p-4 group transition-all hover:shadow-md flex gap-4"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* 左侧：标题和信息 */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            {/* 标题 */}
            <h3
              className="text-base font-bold leading-snug mb-2 line-clamp-2 transition-colors"
              style={{ color: 'var(--foreground)' }}
            >
              {article.title}
            </h3>

            {/* 底部信息 */}
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--foreground-tertiary)' }}>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{article.publishDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={12} />
                <span>{formatNumber(article.views)}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp size={12} />
                <span>{formatNumber(article.likes)}</span>
              </div>
            </div>
          </div>

          {/* 右侧：封面图 */}
          {article.cover && (
            <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <img
                src={article.cover}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}
        </a>
      ))}

      {/* 查看更多按钮 */}
      {hasMore && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-3 rounded-lg border-2 border-dashed transition-all hover:border-solid hover:bg-gray-50 flex items-center justify-center gap-2"
          style={{ borderColor: 'var(--border)', color: 'var(--foreground-secondary)' }}
        >
          <ChevronDown size={16} />
          <span className="text-sm font-medium">查看更多 ({articles.length - 1} 条)</span>
        </button>
      )}
    </div>
  )
}

function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
