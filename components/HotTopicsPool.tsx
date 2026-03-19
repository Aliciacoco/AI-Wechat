'use client'

import { TrendingUp, Sparkles, Loader2 } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

// 社交平台图标映射
const PLATFORM_ICONS: Record<string, string> = {
  '微博': '/platforms/微博.svg',
  '抖音': '/platforms/抖音.svg',
  '小红书': '/platforms/小红书.svg',
  '微信': '/platforms/微信.svg',
}

interface HotTopic {
  id: string
  title: string
  source: string
  heat: number
  tags: string[]
}

interface HotTopicsPoolProps {
  topics: HotTopic[]
  onGenerateIdea: (topic: HotTopic) => void
}

export default function HotTopicsPool({ topics, onGenerateIdea }: HotTopicsPoolProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleGenerate = async (topic: HotTopic) => {
    setLoadingId(topic.id)
    await onGenerateIdea(topic)
    setLoadingId(null)
  }

  // 按热度排序
  const sortedTopics = [...topics].sort((a, b) => b.heat - a.heat)

  return (
    <div className="space-y-2">
      {sortedTopics.map((topic, index) => (
        <div
          key={topic.id}
          className="bg-white rounded-lg border-2 p-3 transition-all hover:shadow-md group"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* 热度排名和平台 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: index < 3 ? 'var(--danger)' : 'var(--background-secondary)',
                  color: index < 3 ? 'white' : 'var(--foreground-tertiary)'
                }}
              >
                {index + 1}
              </div>
              <TrendingUp size={14} style={{ color: 'var(--danger)' }} />
              <span className="text-xs font-bold" style={{ color: 'var(--danger)' }}>
                {topic.heat}
              </span>
            </div>
            {PLATFORM_ICONS[topic.source] && (
              <Image
                src={PLATFORM_ICONS[topic.source]}
                alt={topic.source}
                width={16}
                height={16}
                className="w-4 h-4"
              />
            )}
          </div>

          {/* 标题 */}
          <h3 className="text-sm font-medium mb-2 line-clamp-2 leading-snug" style={{ color: 'var(--foreground)' }}>
            {topic.title}
          </h3>

          {/* 标签 */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {topic.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-1.5 py-0.5 rounded font-medium"
                style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* 生成按钮 */}
          <button
            onClick={() => handleGenerate(topic)}
            disabled={loadingId === topic.id}
            className="w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border-b-4 opacity-0 group-hover:opacity-100"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'white',
              borderBottomColor: 'var(--primary-hover)'
            }}
            onMouseEnter={(e) => {
              if (loadingId !== topic.id) {
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={(e) => {
              if (loadingId !== topic.id) {
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
          >
            {loadingId === topic.id ? (
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
      ))}
    </div>
  )
}
