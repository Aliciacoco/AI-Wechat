'use client'

import { Search, Sparkles, Flame } from 'lucide-react'
import { useState } from 'react'
import { tokens } from '@/lib/design-tokens'

interface SuperSearchProps {
  onSearch: (query: string) => void
  onTodayRecommend?: () => void
  recommendLoading?: boolean
  placeholder?: string
}

export default function SuperSearch({
  onSearch,
  onTodayRecommend,
  recommendLoading = false,
  placeholder = '今天发什么？描述一个方向或话题，AI 帮你找选题...',
}: SuperSearchProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter without shift submits
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (query.trim()) onSearch(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '14px' }}>
      <div
        style={{
          position: 'relative',
          boxShadow: isFocused ? '0 4px 16px rgba(0,0,0,0.08)' : tokens.shadow.diffuse,
          borderRadius: tokens.radius.card,
          border: `1px solid ${isFocused ? tokens.color.accent : tokens.color.border}`,
          backgroundColor: tokens.color.base.white,
          transition: 'box-shadow 0.2s, border-color 0.15s',
        }}
      >
        {/* 搜索图标 */}
        <div style={{
          position: 'absolute', left: '16px', top: '16px',
          pointerEvents: 'none',
        }}>
          <Search size={16} style={{ color: isFocused ? tokens.color.accent : tokens.color.text.tertiary, transition: 'color 0.15s' }} />
        </div>

        {/* 多行文本框 */}
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          style={{
            width: '100%',
            paddingLeft: '44px',
            paddingRight: '16px',
            paddingTop: '14px',
            paddingBottom: '48px', // leave room for bottom bar
            fontSize: '14px',
            lineHeight: '1.6',
            borderRadius: tokens.radius.card,
            border: 'none',
            backgroundColor: 'transparent',
            color: tokens.color.text.primary,
            outline: 'none',
            resize: 'none',
            fontFamily: tokens.typography.fontFamily.zh,
            boxSizing: 'border-box',
            display: 'block',
          }}
        />

        {/* 底部操作栏 */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '12px',
          right: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* 今日最推荐 */}
          {onTodayRecommend && (
            <button
              type="button"
              onClick={recommendLoading ? undefined : onTodayRecommend}
              disabled={recommendLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 12px',
                borderRadius: tokens.radius.button,
                border: `1px solid ${tokens.color.border}`,
                backgroundColor: 'transparent',
                color: recommendLoading ? tokens.color.text.tertiary : tokens.color.text.tertiary,
                fontSize: '12px',
                fontFamily: tokens.typography.fontFamily.zh,
                cursor: recommendLoading ? 'not-allowed' : 'pointer',
                opacity: recommendLoading ? 0.6 : 1,
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!recommendLoading) {
                  e.currentTarget.style.borderColor = '#F57C00'
                  e.currentTarget.style.color = '#F57C00'
                  e.currentTarget.style.backgroundColor = '#FFF8F0'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = tokens.color.border
                e.currentTarget.style.color = tokens.color.text.tertiary
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <Flame size={12} />
              {recommendLoading ? '推荐中...' : '今日最推荐'}
            </button>
          )}

          {/* AI 选题 提交按钮 */}
          <button
            type="submit"
            disabled={!query.trim()}
            style={{
              marginLeft: 'auto',
              height: '30px',
              padding: '0 14px',
              borderRadius: tokens.radius.button,
              border: 'none',
              backgroundColor: query.trim() ? tokens.color.accent : tokens.color.text.tertiary,
              color: tokens.color.base.white,
              fontSize: '12px',
              fontWeight: tokens.typography.weight.medium,
              fontFamily: tokens.typography.fontFamily.zh,
              cursor: query.trim() ? 'pointer' : 'not-allowed',
              opacity: query.trim() ? 1 : 0.4,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'background-color 0.15s, opacity 0.15s',
            }}
            onMouseEnter={(e) => { if (query.trim()) e.currentTarget.style.backgroundColor = '#0062C4' }}
            onMouseLeave={(e) => { if (query.trim()) e.currentTarget.style.backgroundColor = tokens.color.accent }}
          >
            <Sparkles size={12} />
            AI 选题
          </button>
        </div>
      </div>
    </form>
  )
}
