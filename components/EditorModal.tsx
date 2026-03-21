'use client'

import { useState } from 'react'
import { X, Loader2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { tokens } from '@/lib/design-tokens'

interface EditorModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
}

const DEFAULT_OUTLINE = `一、引言
• 话题背景与当下时节的关联
• 引出核心角度，吸引读者继续阅读

二、主体内容
• 核心事实/故事/观点（2-3个层次展开）
• 结合南师大实际场景或师生视角
• 数据、引用或案例支撑

三、情感共鸣
• 挖掘与读者的情感连接点
• 南师大特有的文化底蕴呼应

四、结尾
• 行动引导或互动话题
• 金句收尾，与开篇呼应`

export default function EditorModal({ isOpen, onClose, title }: EditorModalProps) {
  const [outline, setOutline] = useState(DEFAULT_OUTLINE)
  const [body, setBody] = useState('')
  const [generating, setGenerating] = useState(false)
  const [outlineCollapsed, setOutlineCollapsed] = useState(false)

  const handleGenerateBody = async () => {
    if (!outline.trim()) return
    setGenerating(true)
    setBody('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: title, outline, type: 'body' }),
      })

      const result = await response.json()
      if (result.success && result.content) {
        setBody(result.content)
      } else {
        setBody('生成失败，请重试。\n\n错误：' + (result.error || '未知错误'))
      }
    } catch {
      setBody('请求失败，请检查网络后重试。')
    } finally {
      setGenerating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        backgroundColor: 'rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '48px', paddingBottom: '48px',
        fontFamily: tokens.typography.fontFamily.zh,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          width: '760px',
          maxWidth: 'calc(100vw - 48px)',
          maxHeight: 'calc(100vh - 96px)',
          backgroundColor: tokens.color.base.white,
          borderRadius: tokens.radius.card,
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* 顶部标题栏 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: `1px solid ${tokens.color.divider}`,
          flexShrink: 0,
        }}>
          <h2 style={{
            fontSize: '16px', fontWeight: tokens.typography.weight.semibold,
            color: tokens.color.text.primary, lineHeight: 1.5,
            flex: 1, marginRight: '16px',
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '28px', height: '28px', borderRadius: tokens.radius.buttonSm,
              border: 'none', backgroundColor: 'transparent',
              color: tokens.color.text.tertiary, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = tokens.color.base.gray }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* 内容区（滚动） */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* 大纲区 */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '10px', cursor: 'pointer',
              }}
              onClick={() => setOutlineCollapsed(!outlineCollapsed)}
            >
              <span style={{
                fontSize: '13px', fontWeight: tokens.typography.weight.semibold,
                color: tokens.color.text.secondary, textTransform: 'uppercase', letterSpacing: '0.04em',
              }}>
                推荐大纲
              </span>
              <div style={{ color: tokens.color.text.tertiary }}>
                {outlineCollapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
              </div>
            </div>

            {!outlineCollapsed && (
              <textarea
                value={outline}
                onChange={(e) => setOutline(e.target.value)}
                rows={10}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '13px',
                  lineHeight: '1.7',
                  borderRadius: tokens.radius.buttonSm,
                  border: `1px solid ${tokens.color.border}`,
                  backgroundColor: tokens.color.base.gray,
                  color: tokens.color.text.primary,
                  fontFamily: tokens.typography.fontFamily.zh,
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = tokens.color.accent }}
                onBlur={(e) => { e.currentTarget.style.borderColor = tokens.color.border }}
              />
            )}

            {/* 生成正文按钮 */}
            <button
              onClick={handleGenerateBody}
              disabled={generating}
              style={{
                marginTop: '12px',
                height: '36px',
                padding: '0 20px',
                borderRadius: tokens.radius.button,
                border: 'none',
                backgroundColor: generating ? tokens.color.text.tertiary : tokens.color.accent,
                color: tokens.color.base.white,
                fontSize: '13px',
                fontWeight: tokens.typography.weight.medium,
                fontFamily: tokens.typography.fontFamily.zh,
                cursor: generating ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => { if (!generating) e.currentTarget.style.backgroundColor = '#0062C4' }}
              onMouseLeave={(e) => { if (!generating) e.currentTarget.style.backgroundColor = tokens.color.accent }}
            >
              {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {generating ? '正文生成中...' : '生成正文'}
            </button>
          </div>

          {/* 正文区 */}
          {(body || generating) && (
            <div>
              <div style={{
                fontSize: '13px', fontWeight: tokens.typography.weight.semibold,
                color: tokens.color.text.secondary, textTransform: 'uppercase',
                letterSpacing: '0.04em', marginBottom: '10px',
              }}>
                正文
              </div>
              {generating && !body ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '32px 16px',
                  color: tokens.color.text.tertiary, fontSize: '13px',
                }}>
                  <Loader2 size={16} className="animate-spin" />
                  AI 正在撰写正文...
                </div>
              ) : (
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={16}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '14px',
                    lineHeight: '1.85',
                    borderRadius: tokens.radius.buttonSm,
                    border: `1px solid ${tokens.color.border}`,
                    backgroundColor: tokens.color.base.white,
                    color: tokens.color.text.primary,
                    fontFamily: tokens.typography.fontFamily.zh,
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = tokens.color.accent }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = tokens.color.border }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
