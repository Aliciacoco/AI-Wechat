'use client'

import { Eye, ThumbsUp, ExternalLink, TrendingUp } from 'lucide-react'

export interface ArticleCard {
  id: string
  cover: string
  title: string
  publishTime: string
  views: number
  likes: number
  url: string
  school?: string
  showHighViews?: boolean // 是否显示过万阅读标签
}

interface ArticleWaterfallProps {
  articles: ArticleCard[]
  loading?: boolean
  showHighViewsTag?: boolean // 是否启用过万阅读标签功能
}

export default function ArticleWaterfall({ articles, loading = false, showHighViewsTag = false }: ArticleWaterfallProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg border overflow-hidden animate-pulse"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="aspect-[16/9] bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="flex gap-4">
                <div className="h-3 bg-gray-200 rounded w-16" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div
        className="text-center py-12 rounded-lg border bg-white"
        style={{ borderColor: 'var(--border)' }}
      >
        <p className="text-sm" style={{ color: 'var(--foreground-tertiary)' }}>
          暂无数据
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {articles.map((article) => {
        const hasHighViews = showHighViewsTag && article.views >= 10000

        return (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl border-2 p-4 group transition-all hover:shadow-md flex gap-4 relative"
            style={{ borderColor: 'var(--border)' }}
          >
            {/* 过万阅读标签 */}
            {hasHighViews && (
              <div
                className="absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-md z-10 group/tag cursor-help"
                style={{ backgroundColor: '#ef4444', color: 'white' }}
                title={`阅读量达到 ${formatNumber(article.views)}，超过10000次阅读`}
              >
                <TrendingUp size={12} />
                <span>过万阅读</span>
              </div>
            )}

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
                <span>{article.publishTime}</span>
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
            <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <img
                src={article.cover}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </a>
        )
      })}
    </div>
  )
}

// 格式化数字（如：10000 -> 1w）
function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
