'use client'

import { Search, Sparkles, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { tokens } from '@/lib/design-tokens'
import { SCHOOL_PROFILES, type SchoolProfile, type WritingStyle } from '@/data/school-profiles'
import { RECRUIT_NODES, FESTIVAL_NODES, CAMPUS_NODES, type CalendarNode } from '@/data/njnu-calendar'
import {
  CONTENT_TYPE_LABELS,
  WRITING_STYLE_LABELS,
  NODE_TYPE_CONTENT_SUGGESTIONS,
  buildPromptByTable,
  type ContentType,
  type NodeTable,
} from '@/lib/prompt-builder'
import { useScene } from '@/components/SceneProvider'

// ── 类型 ──────────────────────────────────────────────────────

export interface PickerSelection {
  school: SchoolProfile | null
  node: CalendarNode | null
  nodeTable: NodeTable | null
  contentType: ContentType | null
  writingStyle: WritingStyle | null
}

interface SuperSearchProps {
  onSearch: (query: string, selection: PickerSelection) => void
  /** 外部注入节点（从日历卡片点击时使用） */
  injectNode?: { node: CalendarNode; table: NodeTable } | null
  onInjectConsumed?: () => void
  /** 供提示词按钮读取当前拼装结果 */
  onSelectionChange?: (selection: PickerSelection, builtPrompt: string | null) => void
}

// ── 节点表配置 ────────────────────────────────────────────────

const NODE_TABLES: { key: NodeTable; label: string; nodes: CalendarNode[] }[] = [
  { key: 'recruit',  label: '招生节点', nodes: RECRUIT_NODES },
  { key: 'festival', label: '节气节日', nodes: FESTIVAL_NODES },
  { key: 'campus',   label: '校园节点', nodes: CAMPUS_NODES },
]

// ── 工具 ──────────────────────────────────────────────────────

function selectionToChips(sel: PickerSelection): string[] {
  const chips: string[] = []
  if (sel.school) chips.push(sel.school.name)
  if (sel.node) chips.push(sel.node.title)
  if (sel.contentType) chips.push(CONTENT_TYPE_LABELS[sel.contentType])
  if (sel.writingStyle) chips.push(WRITING_STYLE_LABELS[sel.writingStyle])
  return chips
}

function tryBuildPrompt(sel: PickerSelection): string | null {
  if (!sel.school || !sel.node || !sel.nodeTable || !sel.contentType || !sel.writingStyle) return null
  return buildPromptByTable(sel.nodeTable, {
    school: sel.school,
    node: sel.node,
    contentType: sel.contentType,
    writingStyle: sel.writingStyle,
  })
}

const EMPTY: PickerSelection = {
  school: null, node: null, nodeTable: null, contentType: null, writingStyle: null,
}

// ── 组件 ──────────────────────────────────────────────────────

export default function SuperSearch({
  onSearch,
  injectNode,
  onInjectConsumed,
  onSelectionChange,
}: SuperSearchProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [sel, setSel] = useState<PickerSelection>(EMPTY)
  const [activeNodeTable, setActiveNodeTable] = useState<NodeTable>('recruit')
  const wrapperRef = useRef<HTMLDivElement>(null)

  // 全局学校上下文：选择器预选
  const { currentSchool } = useScene()
  useEffect(() => {
    setSel(prev => ({ ...prev, school: currentSchool }))
  }, [currentSchool])

  // 外部注入节点（从日历卡片点击）
  useEffect(() => {
    if (!injectNode) return
    const { node, table } = injectNode
    setSel(prev => {
      const next = { ...prev, node, nodeTable: table }
      // 自动推荐内容类型
      if (!prev.contentType) {
        const suggestions = NODE_TYPE_CONTENT_SUGGESTIONS[node.type]
        next.contentType = suggestions[0] ?? null
      }
      return next
    })
    setActiveNodeTable(table)
    setPickerOpen(true)
    onInjectConsumed?.()
  }, [injectNode])

  // 通知外部 selection 变化
  useEffect(() => {
    onSelectionChange?.(sel, tryBuildPrompt(sel))
  }, [sel])

  // 点击外部关闭 picker
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setPickerOpen(false)
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const chips = selectionToChips(sel)
  const hasSelection = chips.length > 0
  const canSubmit = query.trim() || hasSelection

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSearch(query.trim(), sel)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (canSubmit) onSearch(query.trim(), sel)
    }
  }

  const updateSel = (patch: Partial<PickerSelection>) => {
    setSel(prev => ({ ...prev, ...patch }))
  }

  const removeChip = (label: string) => {
    setSel(prev => {
      const next = { ...prev }
      if (prev.school && SCHOOL_PROFILES.find(s => s.name === label)) next.school = null
      else if (prev.node && prev.node.title === label) { next.node = null; next.nodeTable = null }
      else if (prev.contentType && CONTENT_TYPE_LABELS[prev.contentType] === label) next.contentType = null
      else if (prev.writingStyle && WRITING_STYLE_LABELS[prev.writingStyle] === label) next.writingStyle = null
      return next
    })
  }

  const clearAll = () => setSel(EMPTY)

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            boxShadow: isFocused || pickerOpen ? '0 4px 16px rgba(0,0,0,0.08)' : tokens.shadow.diffuse,
            borderRadius: pickerOpen ? `${tokens.radius.card} ${tokens.radius.card} 0 0` : tokens.radius.card,
            border: `1px solid ${isFocused || pickerOpen ? tokens.color.accent : tokens.color.border}`,
            borderBottom: pickerOpen ? `1px solid ${tokens.color.divider}` : undefined,
            backgroundColor: tokens.color.base.white,
            transition: 'box-shadow 0.2s, border-color 0.15s',
          }}
        >
          {/* 已选标签 chips */}
          {hasSelection && (
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center',
              padding: '10px 14px 0',
            }}>
              {chips.map(chip => (
                <span
                  key={chip}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '3px 10px 3px 10px',
                    borderRadius: '99px',
                    backgroundColor: '#EBF4FF',
                    border: '1px solid #BFDBFE',
                    color: '#1D4ED8',
                    fontSize: '12px',
                    fontFamily: tokens.typography.fontFamily.zh,
                  }}
                >
                  {chip}
                  <button
                    type="button"
                    onClick={() => removeChip(chip)}
                    style={{
                      display: 'flex', alignItems: 'center',
                      border: 'none', background: 'none',
                      padding: '0', cursor: 'pointer', color: '#93C5FD',
                      lineHeight: 1,
                    }}
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={clearAll}
                style={{
                  border: 'none', background: 'none',
                  fontSize: '11px', color: tokens.color.text.tertiary,
                  cursor: 'pointer', padding: '2px 4px',
                  fontFamily: tokens.typography.fontFamily.zh,
                }}
              >
                清空
              </button>
            </div>
          )}

          {/* 搜索图标 */}
          <div style={{ position: 'absolute', left: '16px', top: hasSelection ? '46px' : '16px', pointerEvents: 'none' }}>
            <Search size={16} style={{ color: isFocused ? tokens.color.accent : tokens.color.text.tertiary, transition: 'color 0.15s' }} />
          </div>

          {/* 文本框 */}
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => { setIsFocused(true); setPickerOpen(true) }}
            onKeyDown={handleKeyDown}
            placeholder={hasSelection ? '可继续补充描述，或直接点击 AI 选题...' : '今天发什么？点击选择标签，或直接描述方向...'}
            rows={hasSelection ? 2 : 3}
            style={{
              width: '100%',
              paddingLeft: '44px',
              paddingRight: '16px',
              paddingTop: '14px',
              paddingBottom: '48px',
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
            bottom: '10px', left: '12px', right: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          }}>
            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                marginLeft: 'auto',
                height: '30px', padding: '0 14px',
                borderRadius: tokens.radius.button,
                border: 'none',
                backgroundColor: canSubmit ? tokens.color.accent : tokens.color.text.tertiary,
                color: tokens.color.base.white,
                fontSize: '12px',
                fontWeight: tokens.typography.weight.medium,
                fontFamily: tokens.typography.fontFamily.zh,
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                opacity: canSubmit ? 1 : 0.4,
                display: 'flex', alignItems: 'center', gap: '5px',
                transition: 'background-color 0.15s, opacity 0.15s',
              }}
              onMouseEnter={e => { if (canSubmit) e.currentTarget.style.backgroundColor = '#0B7FCC' }}
              onMouseLeave={e => { if (canSubmit) e.currentTarget.style.backgroundColor = tokens.color.accent }}
            >
              <Sparkles size={12} />
              AI 选题
            </button>
          </div>
        </div>

        {/* Picker 面板 */}
        {pickerOpen && (
          <PickerPanel
            sel={sel}
            activeNodeTable={activeNodeTable}
            onNodeTableChange={setActiveNodeTable}
            onUpdate={updateSel}
            globalSchool={currentSchool}
          />
        )}
      </form>
    </div>
  )
}

// ── PickerPanel ───────────────────────────────────────────────

interface PickerPanelProps {
  sel: PickerSelection
  activeNodeTable: NodeTable
  onNodeTableChange: (t: NodeTable) => void
  onUpdate: (patch: Partial<PickerSelection>) => void
  globalSchool: SchoolProfile | null
}

function PickerPanel({ sel, activeNodeTable, onNodeTableChange, onUpdate, globalSchool }: PickerPanelProps) {
  const allCurrentNodes = NODE_TABLES.find(t => t.key === activeNodeTable)?.nodes ?? []

  // 用于节点过滤的学校：picker内选的优先，否则用全局
  const filterSchool = sel.school ?? globalSchool

  // 过滤节点：去掉不兼容和其他学校专属节点
  const currentNodes = allCurrentNodes.filter(node => {
    if (!filterSchool) {
      if (node.schoolOnly) return false
      if (node.tier985Only) return false
      return true
    }
    if (node.schoolOnly && node.schoolOnly !== filterSchool.name) return false
    if (node.tier985Only && filterSchool.tier !== '985') return false
    if (filterSchool.incompatibleNodeIds?.includes(node.id)) return false
    return true
  })

  const writingStyles = Object.keys(WRITING_STYLE_LABELS) as WritingStyle[]
  // 文章类型：有选中节点时只显示推荐类型，否则显示全部
  const contentTypes: ContentType[] = sel.node
    ? NODE_TYPE_CONTENT_SUGGESTIONS[sel.node.type]
    : (Object.keys(CONTENT_TYPE_LABELS) as ContentType[])

  // 全局已选学校时隐藏学校列，变为3列
  const showSchoolCol = !globalSchool
  const cols = showSchoolCol ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr'

  return (
    <div style={{
      backgroundColor: tokens.color.base.white,
      border: `1px solid ${tokens.color.accent}`,
      borderTop: 'none',
      borderRadius: `0 0 ${tokens.radius.card} ${tokens.radius.card}`,
      overflow: 'hidden',
    }}>
      {/* 维度列 */}
      <div style={{ display: 'grid', gridTemplateColumns: cols, borderBottom: `1px solid ${tokens.color.divider}` }}>

        {/* 学校列：全局已选学校时隐藏 */}
        {showSchoolCol && (
        <PickerSection label="学校">
          {SCHOOL_PROFILES.map(school => (
            <PickerChip
              key={school.name}
              label={school.name}
              sub={school.tier === '985' ? '985' : school.tier === '211' ? '211' : school.tier === 'private' ? '民办' : '本科'}
              selected={sel.school?.name === school.name}
              onClick={() => {
                const next = sel.school?.name === school.name ? null : school
                onUpdate({
                  school: next,
                  writingStyle: next?.recommendedStyles[0] ?? sel.writingStyle,
                })
              }}
            />
          ))}
        </PickerSection>
        )}

        {/* 节点：节点已经过滤，直接渲染即可 */}
        <PickerSection
          label="节点"
          tabs={NODE_TABLES.map(t => ({ key: t.key, label: t.label }))}
          activeTab={activeNodeTable}
          onTabChange={k => onNodeTableChange(k as NodeTable)}
        >
          {currentNodes.map(node => (
            <PickerChip
              key={node.id}
              label={node.title}
              sub={node.date}
              selected={sel.node?.id === node.id}
              onClick={() => {
                const isDeselect = sel.node?.id === node.id
                onUpdate({
                  node: isDeselect ? null : node,
                    nodeTable: isDeselect ? null : activeNodeTable,
                    contentType: isDeselect
                      ? sel.contentType
                      : NODE_TYPE_CONTENT_SUGGESTIONS[node.type][0] ?? sel.contentType,
                  })
                }}
              />
          ))}
        </PickerSection>

        {/* 文章类型 */}
        <PickerSection label="文章类型" subLabel={sel.node ? '已按节点过滤' : undefined}>
          {contentTypes.map(type => (
            <PickerChip
              key={type}
              label={CONTENT_TYPE_LABELS[type]}
              selected={sel.contentType === type}
              onClick={() => onUpdate({ contentType: sel.contentType === type ? null : type })}
            />
          ))}
        </PickerSection>

        {/* 写手风格 */}
        <PickerSection label="写手风格">
          {writingStyles.map(style => (
            <PickerChip
              key={style}
              label={WRITING_STYLE_LABELS[style]}
              selected={sel.writingStyle === style}
              recommended={sel.school?.recommendedStyles.includes(style)}
              onClick={() => onUpdate({ writingStyle: sel.writingStyle === style ? null : style })}
            />
          ))}
        </PickerSection>
      </div>

      {/* 底部提示 */}
      <div style={{
        padding: '8px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '11px', color: tokens.color.text.tertiary, fontFamily: tokens.typography.fontFamily.zh }}>
          选好标签后点击「AI 选题」，或继续在上方输入补充描述
        </span>
        {sel.school && sel.node && sel.contentType && sel.writingStyle && (
          <span style={{ fontSize: '11px', color: '#16A34A', fontFamily: tokens.typography.fontFamily.zh }}>
            四项已选，可生成选题
          </span>
        )}
      </div>
    </div>
  )
}

// ── PickerSection ─────────────────────────────────────────────

interface PickerSectionProps {
  label: string
  subLabel?: string
  tabs?: { key: string; label: string }[]
  activeTab?: string
  onTabChange?: (key: string) => void
  children: React.ReactNode
}

function PickerSection({ label, subLabel, tabs, activeTab, onTabChange, children }: PickerSectionProps) {
  return (
    <div style={{
      borderRight: `1px solid ${tokens.color.divider}`,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* 标题行 */}
      <div style={{
        padding: '8px 12px 6px',
        borderBottom: `1px solid ${tokens.color.divider}`,
        display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap',
      }}>
        <span style={{
          fontSize: '11px', fontWeight: 600,
          color: tokens.color.text.tertiary,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          fontFamily: tokens.typography.fontFamily.zh,
        }}>
          {label}
        </span>
        {subLabel && (
          <span style={{ fontSize: '10px', color: tokens.color.accent, fontFamily: tokens.typography.fontFamily.zh }}>
            {subLabel}
          </span>
        )}
        {tabs && tabs.map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange?.(tab.key)}
            style={{
              padding: '1px 7px',
              borderRadius: '99px',
              border: `1px solid ${activeTab === tab.key ? tokens.color.accent : tokens.color.border}`,
              backgroundColor: activeTab === tab.key ? '#EBF4FF' : 'transparent',
              color: activeTab === tab.key ? tokens.color.accent : tokens.color.text.tertiary,
              fontSize: '10px',
              cursor: 'pointer',
              fontFamily: tokens.typography.fontFamily.zh,
              transition: 'all 0.1s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* 选项列表 */}
      <div style={{
        padding: '8px',
        display: 'flex', flexDirection: 'column', gap: '4px',
        maxHeight: '180px', overflowY: 'auto',
      }}>
        {children}
      </div>
    </div>
  )
}

// ── PickerChip ────────────────────────────────────────────────

interface PickerChipProps {
  label: string
  sub?: string
  selected: boolean
  recommended?: boolean
  disabled?: boolean
  disabledReason?: string
  onClick: () => void
}

function PickerChip({ label, sub, selected, recommended, disabled, disabledReason, onClick }: PickerChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={disabledReason}
      style={{
        width: '100%',
        padding: '6px 10px',
        borderRadius: '8px',
        border: `1px solid ${selected ? tokens.color.accent : 'transparent'}`,
        backgroundColor: disabled ? tokens.color.base.gray : selected ? '#EBF4FF' : 'transparent',
        color: disabled ? tokens.color.text.tertiary : selected ? tokens.color.accent : tokens.color.text.primary,
        fontSize: '13px',
        fontFamily: tokens.typography.fontFamily.zh,
        cursor: disabled ? 'not-allowed' : 'pointer',
        textAlign: 'left',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        opacity: disabled ? 0.45 : 1,
        transition: 'all 0.1s',
        flexShrink: 0,
      }}
      onMouseEnter={e => { if (!selected && !disabled) e.currentTarget.style.backgroundColor = tokens.color.base.gray }}
      onMouseLeave={e => { if (!selected && !disabled) e.currentTarget.style.backgroundColor = 'transparent' }}
    >
      <span style={{ fontWeight: selected ? 600 : 400 }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {sub && (
          <span style={{ fontSize: '10px', color: selected ? '#93C5FD' : tokens.color.text.tertiary }}>
            {sub}
          </span>
        )}
        {recommended && !selected && !disabled && (
          <span style={{
            fontSize: '10px', padding: '1px 5px', borderRadius: '99px',
            backgroundColor: tokens.color.base.gray,
            color: tokens.color.text.tertiary,
          }}>
            推荐
          </span>
        )}
        {disabled && (
          <span style={{ fontSize: '10px', color: tokens.color.text.tertiary }}>不适用</span>
        )}
      </span>
    </button>
  )
}
