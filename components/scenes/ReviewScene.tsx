'use client'

import { useState, useRef, useCallback } from 'react'
import { tokens } from '@/lib/design-tokens'
import type { ReviewResult, ReviewIssue } from '@/app/api/review/route'

const DIMENSION_LABEL: Record<ReviewIssue['dimension'], string> = {
  calendar: '校历核查',
  leaders: '领导信息',
  political: '时政术语',
  names: '专有名词',
  logic: '逻辑一致性',
}

const LEVEL_CONFIG = {
  high:   { label: '高风险', color: '#FF3B30', bg: '#FFF2F1', highlight: 'rgba(255,59,48,0.15)' },
  medium: { label: '中风险', color: '#FF9500', bg: '#FFF8EE', highlight: 'rgba(255,149,0,0.15)' },
  low:    { label: '低风险', color: '#86868B', bg: '#F5F5F7', highlight: 'rgba(134,134,139,0.12)' },
}

const OVERALL_CONFIG = {
  pass:   { label: '审核通过', color: '#34C759', bg: '#F0FFF4' },
  low:    { label: '轻微问题', color: '#86868B', bg: '#F5F5F7' },
  medium: { label: '建议修改', color: '#FF9500', bg: '#FFF8EE' },
  high:   { label: '发现风险', color: '#FF3B30', bg: '#FFF2F1' },
}

const DIMENSION_ALL: ReviewIssue['dimension'][] = ['calendar', 'leaders', 'political', 'names', 'logic']

// 把纯文本按问题 quote 拆分成带标注的 HTML 片段
function buildHighlightedHTML(
  text: string,
  issues: ReviewIssue[],
  activeQuote: string | null,
  fixedQuotes: Set<string>,
): string {
  if (!issues.length) return escapeHtml(text).replace(/\n/g, '<br/>')

  // 按出现顺序找每个 quote 的位置
  type Segment = { start: number; end: number; issue: ReviewIssue }
  const segments: Segment[] = []

  for (const issue of issues) {
    if (fixedQuotes.has(issue.quote)) continue
    const idx = text.indexOf(issue.quote)
    if (idx === -1) continue
    // 避免重叠
    const overlap = segments.some(s => idx < s.end && idx + issue.quote.length > s.start)
    if (!overlap) {
      segments.push({ start: idx, end: idx + issue.quote.length, issue })
    }
  }

  segments.sort((a, b) => a.start - b.start)

  let result = ''
  let cursor = 0
  for (const seg of segments) {
    if (cursor < seg.start) {
      result += escapeHtml(text.slice(cursor, seg.start)).replace(/\n/g, '<br/>')
    }
    const isActive = activeQuote === seg.issue.quote
    const cfg = LEVEL_CONFIG[seg.issue.level]
    const bg = isActive ? cfg.highlight : 'rgba(255,59,48,0.08)'
    const borderColor = isActive ? cfg.color : `${cfg.color}60`
    result += `<mark data-quote="${escapeAttr(seg.issue.quote)}" style="background:${bg};border-bottom:2px solid ${borderColor};border-radius:2px;padding:0 1px;cursor:pointer;transition:background 0.15s;">${escapeHtml(seg.issue.quote)}</mark>`
    cursor = seg.end
  }
  if (cursor < text.length) {
    result += escapeHtml(text.slice(cursor)).replace(/\n/g, '<br/>')
  }
  return result
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
function escapeAttr(s: string) {
  return s.replace(/"/g, '&quot;')
}

export default function ReviewScene() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [error, setError] = useState('')
  const [activeQuote, setActiveQuote] = useState<string | null>(null)
  const [fixedQuotes, setFixedQuotes] = useState<Set<string>>(new Set())
  const articleRef = useRef<HTMLDivElement>(null)
  const issueRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const handleReview = async () => {
    if (!content.trim()) return
    setLoading(true)
    setResult(null)
    setError('')
    setActiveQuote(null)
    setFixedQuotes(new Set())
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setResult(json.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : '审核失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 右侧点击问题 → 高亮左侧对应 mark
  const handleIssueClick = useCallback((quote: string) => {
    setActiveQuote(prev => prev === quote ? null : quote)
    // 滚动左侧 mark 到可视区域
    setTimeout(() => {
      const mark = articleRef.current?.querySelector(`mark[data-quote="${escapeAttr(quote)}"]`)
      mark?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 30)
  }, [])

  // 一键替换：用 suggestion 替换 content 中的 quote
  const handleFix = useCallback((issue: ReviewIssue) => {
    setContent(prev => {
      const idx = prev.indexOf(issue.quote)
      if (idx === -1) return prev
      return prev.slice(0, idx) + issue.suggestion + prev.slice(idx + issue.quote.length)
    })
    setFixedQuotes(prev => new Set(prev).add(issue.quote))
    if (activeQuote === issue.quote) setActiveQuote(null)
  }, [activeQuote])

  const issues = result?.issues ?? []
  const issuesByDimension = DIMENSION_ALL.map(dim => ({
    dim,
    issues: issues.filter(i => i.dimension === dim),
  }))

  const highlightedHTML = result
    ? buildHighlightedHTML(content, issues, activeQuote, fixedQuotes)
    : null

  const pendingCount = issues.filter(i => !fixedQuotes.has(i.quote)).length

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px', fontFamily: tokens.typography.fontFamily.zh }}>
      {/* 页头 */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.primary, margin: 0 }}>
          发布前审核
        </h1>
        <p style={{ fontSize: '14px', color: tokens.color.text.tertiary, margin: '6px 0 0' }}>
          粘贴推文正文，AI 自动检查校历、领导信息、时政术语和专有名词
        </p>
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', minHeight: '600px' }}>

        {/* 左侧：文章区 */}
        <div style={{
          flex: 1,
          backgroundColor: tokens.color.base.white,
          borderRadius: '20px',
          border: `1px solid ${tokens.color.border}`,
          padding: '24px',
          height: 'calc(100vh - 200px)',
          minHeight: '560px',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: '88px',
        }}>
          <div style={{ fontSize: '13px', fontWeight: tokens.typography.weight.medium, color: tokens.color.text.secondary, marginBottom: '12px' }}>
            推文正文
          </div>

          {/* 未审核：textarea；审核后：高亮 div */}
          {!result ? (
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="将公众号推文正文粘贴到此处…"
              style={{
                flex: 1, border: 'none', outline: 'none', resize: 'none',
                fontSize: '14px', lineHeight: '1.8', color: tokens.color.text.primary,
                fontFamily: tokens.typography.fontFamily.zh, backgroundColor: 'transparent',
                overflowY: 'auto',
              }}
            />
          ) : (
            <div
              ref={articleRef}
              onClick={e => {
                const mark = (e.target as HTMLElement).closest('mark')
                if (mark) {
                  const quote = mark.getAttribute('data-quote') ?? ''
                  handleIssueClick(quote)
                  // 右侧对应问题卡滚动
                  issueRefs.current[quote]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                }
              }}
              dangerouslySetInnerHTML={{ __html: highlightedHTML! }}
              style={{
                flex: 1, fontSize: '14px', lineHeight: '1.8',
                color: tokens.color.text.primary, overflowY: 'auto',
              }}
            />
          )}

          <div style={{ marginTop: '16px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: tokens.color.text.tertiary }}>
              {content.length > 0 ? `${content.length} 字` : ''}
              {result && fixedQuotes.size > 0 && (
                <span style={{ color: '#34C759', marginLeft: '8px' }}>已修复 {fixedQuotes.size} 处</span>
              )}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {result && (
                <button
                  onClick={() => { setResult(null); setActiveQuote(null); setFixedQuotes(new Set()) }}
                  style={{
                    padding: '10px 18px', borderRadius: tokens.radius.button,
                    border: `1px solid ${tokens.color.border}`, backgroundColor: 'transparent',
                    fontSize: '14px', color: tokens.color.text.secondary,
                    fontFamily: tokens.typography.fontFamily.zh, cursor: 'pointer',
                  }}
                >
                  重新编辑
                </button>
              )}
              <button
                onClick={handleReview}
                disabled={loading || !content.trim()}
                style={{
                  padding: '10px 28px', borderRadius: tokens.radius.button, border: 'none',
                  backgroundColor: loading || !content.trim() ? '#C7C7CC' : tokens.color.accent,
                  color: tokens.color.base.white, fontSize: '14px',
                  fontWeight: tokens.typography.weight.semibold,
                  fontFamily: tokens.typography.fontFamily.zh,
                  cursor: loading || !content.trim() ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.15s',
                }}
              >
                {loading ? '审核中…' : result ? '重新审核' : '开始审核'}
              </button>
            </div>
          </div>
        </div>

        {/* 右侧：结果面板 */}
        <div style={{
          width: '420px',
          flexShrink: 0,
          height: 'calc(100vh - 200px)',
          minHeight: '560px',
          overflowY: 'auto',
          position: 'sticky',
          top: '88px',
          paddingBottom: '12px',
        }}>

          {/* 空状态 */}
          {!result && !loading && !error && (
            <div style={{
              backgroundColor: tokens.color.base.white, borderRadius: '20px',
              border: `1px solid ${tokens.color.border}`, padding: '24px',
              height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '12px',
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: tokens.color.base.gray, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                🔍
              </div>
              <div style={{ fontSize: '14px', color: tokens.color.text.tertiary, textAlign: 'center' }}>
                粘贴推文后点击「开始审核」<br />审核结果将在此处显示
              </div>
            </div>
          )}

          {/* 加载中 */}
          {loading && (
            <div style={{
              backgroundColor: tokens.color.base.white, borderRadius: '20px',
              border: `1px solid ${tokens.color.border}`, padding: '24px',
              height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '16px',
            }}>
              <div style={{ fontSize: '14px', color: tokens.color.text.secondary }}>AI 正在逐项审核…</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '280px' }}>
                {DIMENSION_ALL.map(dim => (
                  <div key={dim} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: tokens.color.accent, opacity: 0.5 }} />
                    <span style={{ fontSize: '13px', color: tokens.color.text.tertiary }}>{DIMENSION_LABEL[dim]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 错误 */}
          {error && (
            <div style={{ backgroundColor: '#FFF2F1', borderRadius: '20px', border: '1px solid #FFCDD2', padding: '24px', fontSize: '14px', color: '#FF3B30' }}>
              {error}
            </div>
          )}

          {/* 结果 */}
          {result && !loading && (
            <>
              {/* 总体结论 */}
              <div style={{
                backgroundColor: OVERALL_CONFIG[result.overallLevel].bg,
                borderRadius: '20px',
                border: `1px solid ${OVERALL_CONFIG[result.overallLevel].color}30`,
                padding: '20px 24px',
                marginBottom: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '12px', fontWeight: tokens.typography.weight.semibold,
                    color: OVERALL_CONFIG[result.overallLevel].color,
                    backgroundColor: `${OVERALL_CONFIG[result.overallLevel].color}18`,
                    padding: '2px 10px', borderRadius: '99px',
                  }}>
                    {OVERALL_CONFIG[result.overallLevel].label}
                  </span>
                  <span style={{ fontSize: '13px', color: tokens.color.text.secondary }}>
                    {pendingCount > 0 ? `还有 ${pendingCount} 个问题待处理` : '所有问题已处理'}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: tokens.color.text.secondary, margin: 0 }}>
                  {result.summary}
                </p>
              </div>

              {/* 各维度 */}
              {issuesByDimension.map(({ dim, issues: dimIssues }) => (
                <div key={dim} style={{
                  backgroundColor: tokens.color.base.white, borderRadius: '16px',
                  border: `1px solid ${tokens.color.border}`, overflow: 'hidden',
                  marginBottom: '12px',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderBottom: dimIssues.length > 0 ? `1px solid ${tokens.color.divider}` : 'none',
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: tokens.typography.weight.medium, color: tokens.color.text.primary }}>
                      {DIMENSION_LABEL[dim]}
                    </span>
                    <span style={{
                      fontSize: '11px', fontWeight: tokens.typography.weight.medium,
                      color: dimIssues.length === 0 ? '#34C759' : LEVEL_CONFIG[dimIssues[0].level].color,
                      backgroundColor: dimIssues.length === 0 ? '#F0FFF4' : LEVEL_CONFIG[dimIssues[0].level].bg,
                      padding: '2px 8px', borderRadius: '99px',
                    }}>
                      {dimIssues.length === 0 ? '通过' : `${dimIssues.length} 个问题`}
                    </span>
                  </div>

                  {dimIssues.map((issue, idx) => {
                    const isFixed = fixedQuotes.has(issue.quote)
                    const isActive = activeQuote === issue.quote
                    const cfg = LEVEL_CONFIG[issue.level]
                    return (
                      <div
                        key={idx}
                        ref={el => { issueRefs.current[issue.quote] = el }}
                        onClick={() => !isFixed && handleIssueClick(issue.quote)}
                        style={{
                          padding: isFixed ? '10px 18px' : '14px 18px',
                          borderBottom: idx < dimIssues.length - 1 ? `1px solid ${tokens.color.divider}` : 'none',
                          backgroundColor: isActive ? `${cfg.color}08` : 'transparent',
                          cursor: isFixed ? 'default' : 'pointer',
                          transition: 'background-color 0.15s, padding 0.2s',
                          borderLeft: isActive ? `3px solid ${cfg.color}` : '3px solid transparent',
                        }}
                      >
                        {/* 已修复：折叠为单行 */}
                        {isFixed ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              fontSize: '10px', fontWeight: tokens.typography.weight.medium,
                              color: '#34C759', backgroundColor: '#F0FFF4',
                              padding: '1px 7px', borderRadius: '99px', flexShrink: 0,
                            }}>
                              已修复
                            </span>
                            <span style={{
                              fontSize: '12px', color: tokens.color.text.tertiary,
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                              {issue.quote}
                            </span>
                          </div>
                        ) : (
                          <>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1, minWidth: 0 }}>
                                <span style={{
                                  fontSize: '10px', fontWeight: tokens.typography.weight.semibold,
                                  color: cfg.color, backgroundColor: cfg.bg,
                                  padding: '1px 7px', borderRadius: '99px', flexShrink: 0, marginTop: '1px',
                                }}>
                                  {cfg.label}
                                </span>
                                <span style={{
                                  fontSize: '12px', color: tokens.color.text.tertiary,
                                  backgroundColor: tokens.color.base.gray,
                                  padding: '1px 8px', borderRadius: '6px', lineHeight: '1.6',
                                  wordBreak: 'break-all',
                                }}>
                                  「{issue.quote}」
                                </span>
                              </div>
                              <button
                                onClick={e => { e.stopPropagation(); handleFix(issue) }}
                                style={{
                                  flexShrink: 0, padding: '3px 10px',
                                  borderRadius: '99px', border: `1px solid ${cfg.color}`,
                                  backgroundColor: 'transparent', color: cfg.color,
                                  fontSize: '11px', fontWeight: tokens.typography.weight.medium,
                                  fontFamily: tokens.typography.fontFamily.zh, cursor: 'pointer',
                                  transition: 'background-color 0.15s',
                                  whiteSpace: 'nowrap',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = cfg.bg }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                              >
                                一键替换
                              </button>
                            </div>
                            <p style={{ fontSize: '13px', color: tokens.color.text.primary, margin: '0 0 4px', lineHeight: '1.6' }}>
                              {issue.problem}
                            </p>
                            <p style={{ fontSize: '12px', color: tokens.color.accent, margin: 0 }}>
                              建议：{issue.suggestion}
                            </p>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}

            </>
          )}
        </div>
      </div>
    </div>
  )
}
