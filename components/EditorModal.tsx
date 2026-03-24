'use client'

import { useState } from 'react'
import { X, Sparkles, Loader2 } from 'lucide-react'
import { tokens } from '@/lib/design-tokens'

interface EditorModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  inspireContent?: string  // 格式：「字段名：值\n字段名：值…」
}

export default function EditorModal({ isOpen, onClose, title, inspireContent }: EditorModalProps) {
  const [outline, setOutline] = useState('')
  const [generating, setGenerating] = useState(false)

  // 解析 content 为字段数组 [{label, value}]
  const fields = (inspireContent || '')
    .split('\n')
    .map(line => {
      const colon = line.indexOf('：')
      if (colon === -1) return null
      return { label: line.slice(0, colon).trim(), value: line.slice(colon + 1).trim() }
    })
    .filter(Boolean) as { label: string; value: string }[]

  const handleGenerateOutline = async () => {
    setGenerating(true)
    setOutline('')
    try {
      const res = await fetch('/api/inspire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `请为以下选题生成一篇公众号文章大纲：\n\n标题：${title}\n${inspireContent || ''}\n\n要求：大纲分 4-5 个章节，每节 2-3 个要点，结合南师大校园场景，语言简洁。`,
          }],
        }),
      })
      if (!res.ok || !res.body) { setOutline('生成失败，请重试。'); return }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setOutline(accumulated)
      }
    } catch {
      setOutline('请求失败，请检查网络后重试。')
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

          {/* 选题信息表格 */}
          {fields.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                选题信息
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <tbody>
                  {fields.map(({ label, value }) => (
                    <tr key={label}>
                      <td style={{
                        width: '110px', padding: '9px 12px',
                        borderBottom: `1px solid ${tokens.color.divider}`,
                        backgroundColor: tokens.color.base.gray,
                        color: tokens.color.text.tertiary,
                        fontWeight: tokens.typography.weight.medium,
                        verticalAlign: 'top', whiteSpace: 'nowrap',
                        borderRadius: '0',
                      }}>
                        {label}
                      </td>
                      <td style={{
                        padding: '9px 14px',
                        borderBottom: `1px solid ${tokens.color.divider}`,
                        color: tokens.color.text.primary,
                        lineHeight: 1.65,
                        verticalAlign: 'top',
                      }}>
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 生成大纲按钮 */}
          <button
            onClick={handleGenerateOutline}
            disabled={generating}
            style={{
              height: '36px', padding: '0 20px',
              borderRadius: tokens.radius.button,
              border: 'none',
              backgroundColor: generating ? tokens.color.text.tertiary : tokens.color.accent,
              color: tokens.color.base.white,
              fontSize: '13px', fontWeight: tokens.typography.weight.medium,
              fontFamily: tokens.typography.fontFamily.zh,
              cursor: generating ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              marginBottom: '16px',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => { if (!generating) e.currentTarget.style.backgroundColor = '#0B7FCC' }}
            onMouseLeave={(e) => { if (!generating) e.currentTarget.style.backgroundColor = generating ? tokens.color.text.tertiary : tokens.color.accent }}
          >
            {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {generating ? '大纲生成中…' : '生成大纲'}
          </button>

          {/* 大纲区 */}
          {(outline || generating) && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                文章大纲
              </div>
              {generating && !outline ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '24px 16px', color: tokens.color.text.tertiary, fontSize: '13px' }}>
                  <Loader2 size={15} className="animate-spin" />
                  AI 正在生成大纲…
                </div>
              ) : (
                <textarea
                  value={outline}
                  onChange={(e) => setOutline(e.target.value)}
                  rows={14}
                  style={{
                    width: '100%', padding: '14px 16px',
                    fontSize: '13px', lineHeight: '1.8',
                    borderRadius: tokens.radius.buttonSm,
                    border: `1px solid ${tokens.color.border}`,
                    backgroundColor: tokens.color.base.gray,
                    color: tokens.color.text.primary,
                    fontFamily: tokens.typography.fontFamily.zh,
                    resize: 'vertical', outline: 'none',
                    boxSizing: 'border-box', transition: 'border-color 0.15s',
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
