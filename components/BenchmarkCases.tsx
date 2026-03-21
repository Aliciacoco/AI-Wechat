'use client'

import { TrendingUp, Eye, ThumbsUp, Award, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Card, Badge, Button } from '@/components/ui'
import { tokens } from '@/lib/design-tokens'

interface BenchmarkArticle {
  id: string
  school: string
  title: string
  publishDate: string
  views: number
  likes: number
  url: string
  cover?: string
  isPopular?: boolean
}

interface BenchmarkCasesProps {
  articles: BenchmarkArticle[]
  loading?: boolean
  topic: string
}

function formatNumber(num: number): string {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

export default function BenchmarkCases({ articles, loading = false, topic }: BenchmarkCasesProps) {
  const [showAll, setShowAll] = useState(false)
  const displayedArticles = showAll ? articles : articles.slice(0, 1)
  const hasMore = articles.length > 1

  if (loading) {
    return (
      <div className="space-y-3">
        <Card style={{ padding: '16px' }}>
          <div className="animate-pulse space-y-2">
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 rounded-lg w-3/4" style={{ backgroundColor: tokens.color.base.gray }} />
                <div className="h-3 rounded-lg w-1/2" style={{ backgroundColor: tokens.color.base.gray }} />
                <div className="h-3 rounded-lg w-1/3" style={{ backgroundColor: tokens.color.base.gray }} />
              </div>
              <div className="w-28 h-20 rounded-xl" style={{ backgroundColor: tokens.color.base.gray }} />
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <Card style={{ padding: '32px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: tokens.color.text.tertiary }}>
          未找到「{topic}」相关的名校案例
        </p>
      </Card>
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
          style={{ display: 'block', textDecoration: 'none', position: 'relative' }}
        >
          {/* 爆款角标 */}
          {article.isPopular && (
            <div style={{
              position: 'absolute', top: '-8px', right: '-8px', zIndex: 10,
              backgroundColor: '#F59E0B', color: 'white',
              borderRadius: tokens.radius.button, padding: '2px 8px',
              fontSize: '11px', fontWeight: tokens.typography.weight.semibold,
              display: 'flex', alignItems: 'center', gap: '3px',
              boxShadow: tokens.shadow.diffuse,
            }}>
              <Award size={11} />爆款
            </div>
          )}
          <Card
            style={{
              padding: '14px',
              display: 'flex',
              gap: '12px',
              borderColor: article.isPopular ? '#F59E0B' : tokens.color.border,
              transition: 'box-shadow 0.15s',
            }}
            shadow
          >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="accent" style={{ fontSize: '11px' }}>{article.school}</Badge>
                <span style={{ fontSize: '11px', color: tokens.color.text.tertiary }}>{article.publishDate}</span>
              </div>
              <p
                className="line-clamp-2"
                style={{ fontSize: '14px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.primary, lineHeight: 1.5, marginBottom: '8px' }}
              >
                {article.title}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: tokens.color.text.tertiary }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Eye size={11} />{formatNumber(article.views)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ThumbsUp size={11} />{formatNumber(article.likes)}
                </span>
                {article.isPopular && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FF3B30', fontWeight: tokens.typography.weight.medium }}>
                    <TrendingUp size={11} />高互动
                  </span>
                )}
              </div>
            </div>
            {article.cover && (
              <div style={{ width: '112px', height: '80px', flexShrink: 0, overflow: 'hidden', borderRadius: tokens.radius.buttonSm, backgroundColor: tokens.color.base.gray }}>
                <img
                  src={article.cover}
                  alt={article.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            )}
          </Card>
        </a>
      ))}

      {hasMore && !showAll && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(true)}
          style={{ width: '100%', borderRadius: tokens.radius.buttonSm, border: `1px dashed ${tokens.color.border}`, backgroundColor: 'transparent' }}
        >
          <ChevronDown size={14} />
          查看更多（{articles.length - 1} 条）
        </Button>
      )}
    </div>
  )
}
