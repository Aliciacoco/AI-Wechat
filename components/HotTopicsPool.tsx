'use client'

import { Sparkles, Loader2 } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import { Card, Badge } from '@/components/ui'
import { tokens } from '@/lib/design-tokens'

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
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handleGenerate = async (topic: HotTopic) => {
    setLoadingId(topic.id)
    await onGenerateIdea(topic)
    setLoadingId(null)
  }

  const sortedTopics = [...topics].sort((a, b) => b.heat - a.heat)

  return (
    <div className="space-y-2">
      {sortedTopics.map((topic) => (
        <div
          key={topic.id}
          onMouseEnter={() => setHoveredId(topic.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <Card style={{ padding: '12px' }}>
          {/* 平台图标（左侧放大）+ 标题 */}
          <div className="flex items-start gap-3 mb-2">
            {PLATFORM_ICONS[topic.source] ? (
              <Image src={PLATFORM_ICONS[topic.source]} alt={topic.source} width={28} height={28} style={{ flexShrink: 0, marginTop: '1px' }} />
            ) : (
              <div style={{ width: '28px', height: '28px', flexShrink: 0 }} />
            )}
            <p
              className="line-clamp-2"
              style={{
                fontSize: '13px',
                fontWeight: tokens.typography.weight.medium,
                color: tokens.color.text.primary,
                lineHeight: 1.5,
                flex: 1,
                marginBottom: hoveredId === topic.id ? '0' : '0',
              }}
            >
              {topic.title}
            </p>
          </div>

          {/* 悬停时展示生成按钮 */}
          <div
            style={{
              overflow: 'hidden',
              maxHeight: hoveredId === topic.id ? '40px' : '0',
              opacity: hoveredId === topic.id ? 1 : 0,
              transition: 'max-height 0.2s ease, opacity 0.15s ease',
            }}
          >
            <button
              disabled={loadingId === topic.id}
              onClick={() => handleGenerate(topic)}
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
                cursor: loadingId === topic.id ? 'not-allowed' : 'pointer',
                opacity: loadingId === topic.id ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
              }}
            >
              {loadingId === topic.id ? (
                <><Loader2 size={12} className="animate-spin" />生成中...</>
              ) : (
                <><Sparkles size={12} />生成选题</>
              )}
            </button>
          </div>
          </Card>
        </div>
      ))}
    </div>
  )
}
