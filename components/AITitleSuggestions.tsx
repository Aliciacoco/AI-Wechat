'use client'

import { Star, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { tokens } from '@/lib/design-tokens'

interface TitleOption {
  id: string
  title: string
  style: string        // 情感共鸣型 / 荣耀触发型 / 悬念好奇型 / 信息实用型
  description: string  // 吸引力来源（一句话 reason）
  audience?: string
  isFavorited?: boolean
  estimatedViews?: number
  tone?: string
  hotspot?: string
  appeal?: string      // 高 / 中 / 低
}

interface AITitleSuggestionsProps {
  titles: TitleOption[]
  loading?: boolean
  onFavorite: (id: string) => void
  onCopy: (title: string) => void
}

// 标题类型 → 「动心·有用·一笑」策略归属
const STYLE_META: Record<string, {
  strategy: '让用户动心' | '对用户有用' | '让用户会心一笑'
  strategyShort: string
  strategyColor: string
  strategyBg: string
  icon: string
  tagColor: string
  tagBg: string
}> = {
  '情感共鸣型': {
    strategy: '让用户动心',
    strategyShort: '动心',
    strategyColor: '#BE185D',
    strategyBg: '#FDF2F8',
    icon: '❤️',
    tagColor: '#9D174D',
    tagBg: '#FCE7F3',
  },
  '荣耀触发型': {
    strategy: '让用户动心',
    strategyShort: '动心',
    strategyColor: '#BE185D',
    strategyBg: '#FDF2F8',
    icon: '🏆',
    tagColor: '#9D174D',
    tagBg: '#FCE7F3',
  },
  '悬念好奇型': {
    strategy: '让用户会心一笑',
    strategyShort: '一笑',
    strategyColor: '#92400E',
    strategyBg: '#FFFBEB',
    icon: '🎯',
    tagColor: '#78350F',
    tagBg: '#FEF3C7',
  },
  '信息实用型': {
    strategy: '对用户有用',
    strategyShort: '有用',
    strategyColor: '#065F46',
    strategyBg: '#ECFDF5',
    icon: '📌',
    tagColor: '#064E3B',
    tagBg: '#D1FAE5',
  },
}

const DEFAULT_META = {
  strategy: '让用户动心' as const,
  strategyShort: '动心',
  strategyColor: '#BE185D',
  strategyBg: '#FDF2F8',
  icon: '✨',
  tagColor: '#9D174D',
  tagBg: '#FCE7F3',
}

const APPEAL_CONFIG = {
  高: { color: '#DC2626', bg: '#FEF2F2', label: '高潜力' },
  中: { color: '#D97706', bg: '#FFFBEB', label: '中潜力' },
  低: { color: '#6B7280', bg: '#F9FAFB', label: '低潜力' },
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl border p-4 animate-pulse"
      style={{ borderColor: tokens.color.border, backgroundColor: tokens.color.base.white }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 w-5 bg-gray-100 rounded-full" />
        <div className="h-4 w-16 bg-gray-100 rounded-full" />
        <div className="h-4 w-12 bg-gray-100 rounded-full ml-auto" />
      </div>
      <div className="h-5 bg-gray-100 rounded-lg w-4/5 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-full mb-1" />
      <div className="h-3 bg-gray-100 rounded w-2/3" />
    </div>
  )
}

export default function AITitleSuggestions({
  titles,
  loading = false,
  onFavorite,
  onCopy,
}: AITitleSuggestionsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (id: string, title: string) => {
    onCopy(title)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {titles.map((item, index) => {
        const meta = STYLE_META[item.style] ?? DEFAULT_META
        const appealCfg = item.appeal ? APPEAL_CONFIG[item.appeal as keyof typeof APPEAL_CONFIG] : null

        return (
          <div
            key={item.id}
            className="rounded-2xl border transition-all group"
            style={{
              borderColor: item.isFavorited ? tokens.color.accent : tokens.color.border,
              backgroundColor: tokens.color.base.white,
              boxShadow: item.isFavorited ? `0 0 0 1px ${tokens.color.accent}` : tokens.shadow.none,
            }}
          >
            {/* 顶部策略条 */}
            <div
              className="flex items-center gap-2 px-4 pt-3 pb-0"
            >
              {/* 序号 */}
              <span
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: tokens.color.base.gray,
                  color: tokens.color.text.tertiary,
                  fontSize: '11px',
                  fontWeight: tokens.typography.weight.semibold,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </span>

              {/* 类型 + 策略 */}
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: tokens.typography.weight.medium,
                  color: meta.tagColor,
                  backgroundColor: meta.tagBg,
                  padding: '2px 8px',
                  borderRadius: '99px',
                }}
              >
                {meta.icon} {item.style}
              </span>

              <span
                style={{
                  fontSize: '11px',
                  color: tokens.color.text.tertiary,
                }}
              >
                · {meta.strategy}
              </span>

              {/* 潜力标签 */}
              {appealCfg && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: tokens.typography.weight.medium,
                    color: appealCfg.color,
                    backgroundColor: appealCfg.bg,
                    padding: '2px 8px',
                    borderRadius: '99px',
                    marginLeft: 'auto',
                  }}
                >
                  {appealCfg.label}
                </span>
              )}
            </div>

            {/* 标题主体 */}
            <div className="px-4 pt-2 pb-1">
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: tokens.typography.weight.semibold,
                  color: tokens.color.text.primary,
                  lineHeight: 1.5,
                  fontFamily: tokens.typography.fontFamily.zh,
                }}
              >
                {item.title}
              </p>
            </div>

            {/* 吸引力来源 */}
            <div className="px-4 pb-3">
              <p
                style={{
                  fontSize: '12px',
                  color: tokens.color.text.tertiary,
                  lineHeight: 1.6,
                }}
              >
                {item.description}
              </p>

              {/* 受众 / 语气 / 热点 标签行 */}
              {(item.audience || item.tone || item.hotspot) && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {item.audience && (
                    <span style={{ fontSize: '11px', color: '#6B7280', backgroundColor: '#F9FAFB', padding: '2px 7px', borderRadius: '99px', border: '1px solid #F2F2F2' }}>
                      👥 {item.audience}
                    </span>
                  )}
                  {item.tone && (
                    <span style={{ fontSize: '11px', color: '#6B7280', backgroundColor: '#F9FAFB', padding: '2px 7px', borderRadius: '99px', border: '1px solid #F2F2F2' }}>
                      💬 {item.tone}
                    </span>
                  )}
                  {item.hotspot && (
                    <span style={{ fontSize: '11px', color: '#6B7280', backgroundColor: '#F9FAFB', padding: '2px 7px', borderRadius: '99px', border: '1px solid #F2F2F2' }}>
                      🔥 {item.hotspot}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* 操作栏 */}
            <div
              className="flex items-center justify-end gap-1 px-3 pb-3"
            >
              <button
                onClick={() => onFavorite(item.id)}
                title={item.isFavorited ? '取消收藏' : '收藏'}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: tokens.radius.buttonSm,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: item.isFavorited ? '#F59E0B' : tokens.color.text.tertiary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = tokens.color.base.gray }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <Star size={15} fill={item.isFavorited ? '#F59E0B' : 'none'} />
              </button>

              <button
                onClick={() => handleCopy(item.id, item.title)}
                title="复制标题"
                style={{
                  height: '32px',
                  padding: '0 12px',
                  borderRadius: tokens.radius.button,
                  border: `1px solid ${tokens.color.border}`,
                  backgroundColor: copiedId === item.id ? '#ECFDF5' : tokens.color.base.white,
                  color: copiedId === item.id ? '#065F46' : tokens.color.text.secondary,
                  fontSize: '12px',
                  fontWeight: tokens.typography.weight.medium,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (copiedId !== item.id) e.currentTarget.style.borderColor = tokens.color.accent
                }}
                onMouseLeave={(e) => {
                  if (copiedId !== item.id) e.currentTarget.style.borderColor = tokens.color.border
                }}
              >
                {copiedId === item.id ? (
                  <><Check size={13} /> 已复制</>
                ) : (
                  <><Copy size={13} /> 复制</>
                )}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
