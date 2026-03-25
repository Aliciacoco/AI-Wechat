'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Search, ChevronDown, Sparkles } from 'lucide-react'
import { tokens } from '@/lib/design-tokens'
import type { CalendarNode } from '@/data/njnu-calendar'
import {
  SCHOOL_PROFILES,
  findSchoolProfile,
  type SchoolProfile,
  type WritingStyle,
} from '@/data/school-profiles'
import {
  NODE_TYPE_CONTENT_SUGGESTIONS,
  CONTENT_TYPE_LABELS,
  WRITING_STYLE_LABELS,
  buildStructuredPrompt,
  buildPromptPreview,
  type ContentType,
} from '@/lib/prompt-builder'

interface PromptConfigPanelProps {
  isOpen: boolean
  node: CalendarNode | null
  onClose: () => void
  /** 配置完成，传出生成好的提示词和展示标签 */
  onConfirm: (prompt: string, displayTopic: string) => void
}

export default function PromptConfigPanel({ isOpen, node, onClose, onConfirm }: PromptConfigPanelProps) {
  const [schoolQuery, setSchoolQuery] = useState('')
  const [selectedSchool, setSelectedSchool] = useState<SchoolProfile | null>(null)
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false)
  const [contentType, setContentType] = useState<ContentType | null>(null)
  const [writingStyle, setWritingStyle] = useState<WritingStyle | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const schoolInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 过滤后的学校列表
  const filteredSchools = schoolQuery.trim().length > 0
    ? SCHOOL_PROFILES.filter(s =>
        s.name.includes(schoolQuery) ||
        s.aliases.some(a => a.toLowerCase().includes(schoolQuery.toLowerCase()))
      )
    : SCHOOL_PROFILES

  // 打开时重置状态
  useEffect(() => {
    if (isOpen && node) {
      setSchoolQuery('')
      setSelectedSchool(null)
      setShowSchoolDropdown(false)
      setShowPreview(false)
      // 根据节点类型自动预填内容类型（取第一个推荐）
      const suggestions = NODE_TYPE_CONTENT_SUGGESTIONS[node.type]
      setContentType(suggestions[0] ?? null)
      setWritingStyle(null)
    }
  }, [isOpen, node])

  // 点击外部关闭下拉
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSchoolDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Esc 关闭
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen || !node) return null

  const canConfirm = selectedSchool && contentType && writingStyle

  const handleSelectSchool = (school: SchoolProfile) => {
    setSelectedSchool(school)
    setSchoolQuery(school.name)
    setShowSchoolDropdown(false)
    // 自动推荐写手风格
    if (school.recommendedStyles.length > 0) {
      setWritingStyle(school.recommendedStyles[0])
    }
  }

  const handleConfirm = () => {
    if (!canConfirm) return
    const prompt = buildStructuredPrompt({
      school: selectedSchool,
      node,
      contentType,
      writingStyle,
    })
    const displayTopic = `${selectedSchool.name} · ${node.title} · ${CONTENT_TYPE_LABELS[contentType]}`
    onConfirm(prompt, displayTopic)
  }

  const previewText = canConfirm
    ? buildPromptPreview({ school: selectedSchool!, node, contentType: contentType!, writingStyle: writingStyle! })
    : null

  const suggestedContentTypes = NODE_TYPE_CONTENT_SUGGESTIONS[node.type]

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        backgroundColor: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: tokens.typography.fontFamily.zh,
      }}
    >
      <div style={{
        backgroundColor: tokens.color.base.white,
        borderRadius: tokens.radius.modal,
        border: `1px solid ${tokens.color.border}`,
        boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
        width: 'calc(100% - 32px)',
        maxWidth: '520px',
        maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>

        {/* 头部 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: `1px solid ${tokens.color.divider}`,
          backgroundColor: tokens.color.base.gray,
          borderRadius: `${tokens.radius.modal} ${tokens.radius.modal} 0 0`,
        }}>
          <div>
            <p style={{ fontSize: '12px', color: tokens.color.text.tertiary, marginBottom: '2px' }}>
              配置生成参数
            </p>
            <p style={{ fontSize: '14px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.primary }}>
              {node.title}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '28px', height: '28px', borderRadius: tokens.radius.buttonSm,
              border: 'none', backgroundColor: 'transparent',
              color: tokens.color.text.tertiary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = tokens.color.border }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* 配置内容 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* 1. 学校选择 */}
          <section>
            <Label>学校</Label>
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '9px 12px',
                borderRadius: '10px',
                border: `1px solid ${showSchoolDropdown ? tokens.color.accent : tokens.color.border}`,
                backgroundColor: tokens.color.base.white,
                transition: 'border-color 0.15s',
              }}>
                <Search size={14} style={{ color: tokens.color.text.tertiary, flexShrink: 0 }} />
                <input
                  ref={schoolInputRef}
                  value={schoolQuery}
                  onChange={(e) => {
                    setSchoolQuery(e.target.value)
                    setSelectedSchool(null)
                    setShowSchoolDropdown(true)
                  }}
                  onFocus={() => setShowSchoolDropdown(true)}
                  placeholder="搜索学校名称…"
                  style={{
                    flex: 1, border: 'none', outline: 'none',
                    fontSize: '14px', color: tokens.color.text.primary,
                    fontFamily: tokens.typography.fontFamily.zh,
                    backgroundColor: 'transparent',
                  }}
                />
                {selectedSchool && (
                  <span style={{
                    fontSize: '11px', padding: '2px 7px', borderRadius: '99px',
                    backgroundColor: '#EBF4FF', color: '#1D4ED8',
                    flexShrink: 0,
                  }}>
                    {selectedSchool.tier === '985' ? '985' : selectedSchool.tier === '211' ? '211' : selectedSchool.tier === 'private' ? '民办' : '本科'}
                  </span>
                )}
              </div>

              {/* 下拉列表 */}
              {showSchoolDropdown && filteredSchools.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  marginTop: '4px',
                  backgroundColor: tokens.color.base.white,
                  border: `1px solid ${tokens.color.border}`,
                  borderRadius: '10px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  zIndex: 10,
                  overflow: 'hidden',
                }}>
                  {filteredSchools.map(school => (
                    <button
                      key={school.name}
                      onClick={() => handleSelectSchool(school)}
                      style={{
                        width: '100%', padding: '10px 14px',
                        border: 'none', backgroundColor: 'transparent',
                        cursor: 'pointer', textAlign: 'left',
                        display: 'flex', flexDirection: 'column', gap: '2px',
                        borderBottom: `1px solid ${tokens.color.divider}`,
                        transition: 'background-color 0.1s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = tokens.color.base.gray }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: 500, color: tokens.color.text.primary }}>
                        {school.name}
                      </span>
                      <span style={{ fontSize: '11px', color: tokens.color.text.tertiary }}>
                        {school.positioning.slice(0, 36)}…
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 学校定位自动显示 */}
            {selectedSchool && (
              <div style={{
                marginTop: '8px', padding: '10px 12px',
                borderRadius: '8px', backgroundColor: '#F0F7FF',
                border: '1px solid #BFDBFE',
              }}>
                <p style={{ fontSize: '12px', color: '#1D4ED8', fontWeight: 500, marginBottom: '3px' }}>
                  自动识别定位
                </p>
                <p style={{ fontSize: '12px', color: '#1E40AF', lineHeight: 1.6 }}>
                  {selectedSchool.positioning}
                </p>
              </div>
            )}
          </section>

          {/* 2. 内容类型 */}
          <section>
            <Label>内容类型</Label>
            <p style={{ fontSize: '11px', color: tokens.color.text.tertiary, marginBottom: '8px' }}>
              根据节点类型自动推荐，可手动调整
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(Object.keys(CONTENT_TYPE_LABELS) as ContentType[]).map(type => {
                const isSuggested = suggestedContentTypes.includes(type)
                const isSelected = contentType === type
                return (
                  <button
                    key={type}
                    onClick={() => setContentType(type)}
                    style={{
                      padding: '6px 13px',
                      borderRadius: '99px',
                      border: `1px solid ${isSelected ? tokens.color.accent : tokens.color.border}`,
                      backgroundColor: isSelected ? tokens.color.accent : isSuggested ? '#F0F7FF' : tokens.color.base.white,
                      color: isSelected ? '#fff' : isSuggested ? '#1D4ED8' : tokens.color.text.secondary,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      fontFamily: tokens.typography.fontFamily.zh,
                    }}
                  >
                    {CONTENT_TYPE_LABELS[type]}
                    {isSuggested && !isSelected && (
                      <span style={{ marginLeft: '4px', fontSize: '10px', opacity: 0.7 }}>推荐</span>
                    )}
                  </button>
                )
              })}
            </div>
          </section>

          {/* 3. 写手风格 */}
          <section>
            <Label>写手风格</Label>
            {selectedSchool && (
              <p style={{ fontSize: '11px', color: tokens.color.text.tertiary, marginBottom: '8px' }}>
                已根据学校类型自动推荐，可手动调整
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(Object.keys(WRITING_STYLE_LABELS) as WritingStyle[]).map(style => {
                const isRecommended = selectedSchool?.recommendedStyles.includes(style)
                const isSelected = writingStyle === style
                return (
                  <button
                    key={style}
                    onClick={() => setWritingStyle(style)}
                    style={{
                      padding: '9px 14px',
                      borderRadius: '10px',
                      border: `1px solid ${isSelected ? tokens.color.accent : tokens.color.border}`,
                      backgroundColor: isSelected ? '#F0F7FF' : tokens.color.base.white,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      transition: 'all 0.15s',
                      fontFamily: tokens.typography.fontFamily.zh,
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = tokens.color.base.gray }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = tokens.color.base.white }}
                  >
                    <span style={{
                      fontSize: '13px',
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? tokens.color.accent : tokens.color.text.primary,
                    }}>
                      {WRITING_STYLE_LABELS[style]}
                    </span>
                    {isRecommended && (
                      <span style={{
                        fontSize: '10px', padding: '2px 7px', borderRadius: '99px',
                        backgroundColor: isSelected ? '#DBEAFE' : tokens.color.base.gray,
                        color: isSelected ? tokens.color.accent : tokens.color.text.tertiary,
                      }}>
                        推荐
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </section>

          {/* 提示词预览 */}
          {previewText && (
            <section>
              <button
                onClick={() => setShowPreview(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  border: 'none', backgroundColor: 'transparent',
                  color: tokens.color.text.tertiary, fontSize: '12px',
                  cursor: 'pointer', padding: '0',
                  fontFamily: tokens.typography.fontFamily.zh,
                }}
              >
                <ChevronDown
                  size={13}
                  style={{ transform: showPreview ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                />
                预览提示词配置
              </button>
              {showPreview && (
                <div style={{
                  marginTop: '8px', padding: '12px 14px',
                  borderRadius: '8px',
                  backgroundColor: tokens.color.base.gray,
                  border: `1px solid ${tokens.color.divider}`,
                }}>
                  <pre style={{
                    fontSize: '11px', color: tokens.color.text.secondary,
                    lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0,
                    fontFamily: tokens.typography.fontFamily.zh,
                  }}>
                    {previewText}
                  </pre>
                </div>
              )}
            </section>
          )}
        </div>

        {/* 底部操作 */}
        <div style={{
          padding: '14px 20px',
          borderTop: `1px solid ${tokens.color.divider}`,
          display: 'flex', gap: '10px', justifyContent: 'flex-end',
          backgroundColor: tokens.color.base.white,
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px', borderRadius: '99px',
              border: `1px solid ${tokens.color.border}`,
              backgroundColor: 'transparent',
              color: tokens.color.text.secondary,
              fontSize: '13px', cursor: 'pointer',
              fontFamily: tokens.typography.fontFamily.zh,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = tokens.color.accent; e.currentTarget.style.color = tokens.color.accent }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = tokens.color.border; e.currentTarget.style.color = tokens.color.text.secondary }}
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            style={{
              padding: '8px 20px', borderRadius: '99px',
              border: 'none',
              backgroundColor: canConfirm ? tokens.color.accent : tokens.color.base.gray,
              color: canConfirm ? '#fff' : tokens.color.text.tertiary,
              fontSize: '13px', fontWeight: 500,
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', gap: '6px',
              fontFamily: tokens.typography.fontFamily.zh,
              transition: 'background-color 0.15s',
            }}
          >
            <Sparkles size={13} />
            生成选题
          </button>
        </div>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '12px', fontWeight: 600,
      color: tokens.color.text.secondary,
      letterSpacing: tokens.typography.letterSpacing.label,
      marginBottom: '8px',
      textTransform: 'uppercase',
    }}>
      {children}
    </p>
  )
}
