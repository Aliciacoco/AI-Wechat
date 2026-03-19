'use client'

import Image from 'next/image'
import { Sparkles, RefreshCw, Loader2 } from 'lucide-react'

interface School {
  id: string
  name: string
  shortName: string
  logo: string
  lastUpdate?: string // 上次更新时间
}

interface Recommendation {
  accountId: string
  theme: string
  description: string
}

interface SchoolAvatarScrollProps {
  schools: School[]
  selectedId: string | null
  onSelect: (id: string) => void
  recommendations?: Recommendation[]
  onRecommendationClick?: (theme: string) => void
  onChangeRecommendation?: (accountId: string) => void
  changingRecommendationId?: string | null
}

export default function SchoolAvatarScroll({
  schools,
  selectedId,
  onSelect,
  recommendations = [],
  onRecommendationClick,
  onChangeRecommendation,
  changingRecommendationId
}: SchoolAvatarScrollProps) {
  // 获取当前选中账号的推荐
  const currentRecommendation = recommendations.find(r => r.accountId === selectedId)
  const isChanging = changingRecommendationId === selectedId

  return (
    <div className="mb-6">
      {/* 头像横向滚动 */}
      <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide mb-4">
        {schools.map((school) => {
          const isSelected = selectedId === school.id

          return (
            <button
              key={school.id}
              onClick={() => onSelect(school.id)}
              className="flex flex-col items-center gap-2 flex-shrink-0 group"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all relative overflow-hidden"
                style={{
                  border: isSelected ? '2px solid var(--primary)' : '2px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                }}
              >
                {school.logo ? (
                  <Image
                    src={school.logo}
                    alt={school.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span
                    className="text-lg font-semibold"
                    style={{ color: isSelected ? 'var(--primary)' : 'var(--foreground-secondary)' }}
                  >
                    {school.shortName}
                  </span>
                )}
                {isSelected && (
                  <div
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--primary)' }}
                  />
                )}
              </div>
              <span
                className="text-xs text-center max-w-[64px] truncate"
                style={{ color: isSelected ? 'var(--foreground)' : 'var(--foreground-tertiary)' }}
              >
                {school.name}
              </span>
              {school.lastUpdate && (
                <span
                  className="text-xs text-center"
                  style={{ color: 'var(--foreground-tertiary)' }}
                >
                  {school.lastUpdate}更新
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* 推荐主题卡片 - 横版样式 */}
      {currentRecommendation && (
        <div className="space-y-3">
          <div
            className="bg-white rounded-xl border-2 border-dashed p-4 flex gap-4 transition-all hover:border-solid hover:shadow-md"
            style={{ borderColor: 'var(--primary)' }}
          >
            {/* 左侧：标题和信息 */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              {/* AI 推荐标签 */}
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} style={{ color: 'var(--primary)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
                  AI 推荐主题
                </span>
              </div>

              {/* 主题标题 */}
              <h3
                className="text-base font-bold leading-snug mb-2 line-clamp-2"
                style={{ color: 'var(--foreground)' }}
              >
                {currentRecommendation.theme}
              </h3>

              {/* 描述 */}
              <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--foreground-secondary)' }}>
                {currentRecommendation.description}
              </p>
            </div>

            {/* 右侧：操作按钮 */}
            <div className="w-32 h-24 flex-shrink-0 flex flex-col gap-2">
              <button
                onClick={() => onRecommendationClick?.(currentRecommendation.theme)}
                className="flex-1 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-1.5 border-b-4"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  borderBottomColor: 'var(--primary-hover)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <Sparkles size={14} />
                去创作
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (onChangeRecommendation && currentRecommendation && !isChanging) {
                    onChangeRecommendation(currentRecommendation.accountId)
                  }
                }}
                disabled={isChanging}
                className="flex-1 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-1.5 border-b-4"
                style={{
                  backgroundColor: isChanging ? 'var(--background-tertiary)' : 'var(--background-secondary)',
                  color: isChanging ? 'var(--foreground-tertiary)' : 'var(--foreground-secondary)',
                  borderBottomColor: 'var(--border)',
                  cursor: isChanging ? 'not-allowed' : 'pointer',
                  opacity: isChanging ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isChanging) {
                    e.currentTarget.style.backgroundColor = 'var(--background-hover)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isChanging) {
                    e.currentTarget.style.backgroundColor = 'var(--background-secondary)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }
                }}
              >
                {isChanging ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>生成中...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={14} />
                    <span>换一条</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
