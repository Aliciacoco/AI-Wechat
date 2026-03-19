'use client'

import { Eye, ThumbsUp } from 'lucide-react'
import Image from 'next/image'

interface Article {
  id: string
  title: string
  date: string
  views: number
  likes: number
  url: string
}

interface SchoolBenchmarkProps {
  school: string
  logo: string
  articles: Article[]
}

export default function SchoolBenchmark({ school, logo, articles }: SchoolBenchmarkProps) {
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  return (
    <div className="bg-white rounded-2xl border-2 p-5 transition-all hover:shadow-lg hover:-translate-y-1" style={{ borderColor: 'var(--border)' }}>
      {/* 学校头部 */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b-2" style={{ borderColor: 'var(--border-light)' }}>
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2" style={{ borderColor: 'var(--border)' }}>
          <Image
            src={logo}
            alt={school}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
            {school}
          </h3>
          <p className="text-xs" style={{ color: 'var(--foreground-tertiary)' }}>
            {articles.length} 篇标杆案例
          </p>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="space-y-3">
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-xl transition-all hover:bg-gray-50"
          >
            <h4 className="text-sm font-bold mb-2 line-clamp-2" style={{ color: 'var(--foreground)' }}>
              {article.title}
            </h4>
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: 'var(--foreground-tertiary)' }}>{article.date}</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye size={12} style={{ color: 'var(--foreground-tertiary)' }} />
                  <span className="font-medium" style={{ color: 'var(--foreground-secondary)' }}>
                    {formatNumber(article.views)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp size={12} style={{ color: 'var(--foreground-tertiary)' }} />
                  <span className="font-medium" style={{ color: 'var(--foreground-secondary)' }}>
                    {formatNumber(article.likes)}
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
