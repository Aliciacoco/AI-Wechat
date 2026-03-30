'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowLeft, RotateCcw, Send, Star, ClipboardList, X, Trash2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { tokens } from '@/lib/design-tokens'
import EditorModal from '@/components/EditorModal'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface CreationItem {
  id: string
  title: string
  content?: string
  source: string
  createdAt: string
  schoolName?: string
}

interface AIGenerateModalProps {
  isOpen: boolean
  onClose: () => void
  initialPrompt: string
  displayTopic?: string
  schoolName?: string
}

function loadCreationList(): CreationItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem('creation-list') || localStorage.getItem('favorites')
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

export default function AIGenerateModal({ isOpen, onClose, initialPrompt, displayTopic, schoolName }: AIGenerateModalProps) {
  const topicLabel = displayTopic || initialPrompt.slice(0, 30).replace(/\n/g, ' ') + (initialPrompt.length > 30 ? '…' : '')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // 已加入创作清单的行 key 集合
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set())

  // 悬浮清单面板
  const [listOpen, setListOpen] = useState(false)
  const [creationList, setCreationList] = useState<CreationItem[]>([])
  const [shake, setShake] = useState(false)

  // EditorModal
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorTitle, setEditorTitle] = useState('')
  const [editorContent, setEditorContent] = useState('')

  const refreshList = useCallback(() => {
    setCreationList(loadCreationList())
  }, [])

  useEffect(() => {
    refreshList()
    window.addEventListener('storage', refreshList)
    return () => window.removeEventListener('storage', refreshList)
  }, [refreshList])

  function saveRow(title: string, rowContent: string) {
    const key = title + '|' + rowContent
    if (savedKeys.has(key)) return
    const item: CreationItem = {
      id: crypto.randomUUID(),
      title,
      content: rowContent,
      source: `AI 灵感 · ${topicLabel}`,
      createdAt: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      schoolName,
    }
    const stored = localStorage.getItem('creation-list')
    let list: CreationItem[] = []
    try { list = stored ? JSON.parse(stored) : [] } catch { list = [] }
    list.push(item)
    localStorage.setItem('creation-list', JSON.stringify(list))
    window.dispatchEvent(new Event('storage'))
    setSavedKeys(prev => new Set(prev).add(key))
    setCreationList([...list])
    // 触发悬浮按钮抖动
    setShake(true)
    setTimeout(() => setShake(false), 500)
    // 自动展开面板
    setListOpen(true)
  }

  function deleteFromList(id: string) {
    const updated = creationList.filter(i => i.id !== id)
    setCreationList(updated)
    localStorage.setItem('creation-list', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }

  // 打开时自动发起首次请求
  useEffect(() => {
    if (isOpen && initialPrompt && messages.length === 0) {
      sendMessage(initialPrompt, [])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialPrompt])

  // 关闭时重置
  useEffect(() => {
    if (!isOpen) {
      abortRef.current?.abort()
      setMessages([])
      setInput('')
      setStreamingContent('')
      setLoading(false)
      setSavedKeys(new Set())
      setListOpen(false)
      setEditorOpen(false)
    }
  }, [isOpen])

  // 锁定 body 滚动
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Esc 关闭
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape' && !editorOpen) onClose() }
    if (isOpen) document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose, editorOpen])

  // 新消息滚到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  // textarea 自适应高度
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }, [input])

  async function sendMessage(content: string, history: Message[]) {
    if (!content.trim() || loading) return
    const newMessages: Message[] = [...history, { role: 'user', content: content.trim() }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setStreamingContent('')
    abortRef.current = new AbortController()
    try {
      const res = await fetch('/api/inspire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
        signal: abortRef.current.signal,
      })
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: '请求失败' }))
        setMessages(prev => [...prev, { role: 'assistant', content: `请求失败：${err.error || '未知错误'}` }])
        return
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setStreamingContent(accumulated)
      }
      setMessages(prev => [...prev, { role: 'assistant', content: accumulated }])
      setStreamingContent('')
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        setMessages(prev => [...prev, { role: 'assistant', content: '生成失败，请重试。' }])
      }
      setStreamingContent('')
    } finally {
      setLoading(false)
    }
  }

  const handleSend = () => sendMessage(input, messages)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleReset = () => {
    abortRef.current?.abort()
    setMessages([])
    setInput('')
    setStreamingContent('')
    setLoading(false)
    setTimeout(() => sendMessage(initialPrompt, []), 50)
  }

  // 重新生成某条 assistant 消息（针对多轮对话中某一条）
  const handleRegenerateAt = (msgIndex: number) => {
    const history = messages.slice(0, msgIndex) // 保留到该条之前的历史
    const lastUser = [...history].reverse().find(m => m.role === 'user')
    if (!lastUser) return
    abortRef.current?.abort()
    setMessages(history)
    setStreamingContent('')
    setLoading(false)
    setTimeout(() => sendMessage(lastUser.content, history.slice(0, -1)), 50)
  }

  function extractText(children: React.ReactNode): string {
    if (typeof children === 'string') return children
    if (Array.isArray(children)) return children.map(extractText).join('')
    if (typeof children === 'object' && children !== null && 'props' in (children as any)) {
      return extractText((children as any).props?.children)
    }
    return ''
  }

  function RowSaveBtn({ title, rowContent }: { title: string; rowContent: string }) {
    const key = title + '|' + rowContent
    const saved = savedKeys.has(key)
    return (
      <button
        onClick={(e) => { e.stopPropagation(); saveRow(title, rowContent) }}
        title={saved ? '已加入创作清单' : '加入创作清单'}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '22px', height: '22px', marginRight: '6px',
          borderRadius: '6px', border: 'none',
          backgroundColor: saved ? '#FFFBEB' : 'transparent',
          color: saved ? '#F59E0B' : tokens.color.text.tertiary,
          cursor: saved ? 'default' : 'pointer',
          flexShrink: 0, transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => { if (!saved) { e.currentTarget.style.color = '#F59E0B'; e.currentTarget.style.backgroundColor = '#FFFBEB' } }}
        onMouseLeave={(e) => { if (!saved) { e.currentTarget.style.color = tokens.color.text.tertiary; e.currentTarget.style.backgroundColor = 'transparent' } }}
      >
        <Star size={13} fill={saved ? '#F59E0B' : 'none'} />
      </button>
    )
  }

  const renderContent = (content: string) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        table: ({ children }) => (
          <div style={{ margin: '8px 0' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '13px', lineHeight: 1.6, tableLayout: 'fixed' }}>
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th style={{ padding: '7px 12px', borderBottom: `2px solid ${tokens.color.border}`, textAlign: 'left', fontWeight: 600, color: tokens.color.text.primary, backgroundColor: tokens.color.base.gray, wordBreak: 'keep-all' }}>
            {children}
          </th>
        ),
        tr: ({ children }) => {
          const cells = React.Children.toArray(children)
          const isHeader = cells.some(cell => React.isValidElement(cell) && (cell.props as any).node?.tagName === 'th')
          if (isHeader) return <tr>{children}</tr>
          const COL_NAMES = ['选题类别', '建议标题', '核心策略', '内容切入角度', '预期共鸣点']
          const allTexts = cells.filter(React.isValidElement).map(cell => extractText((cell.props as any).children).trim())
          const title = allTexts[1] || allTexts[0] || ''
          const rowContent = allTexts.map((text, i) => `${COL_NAMES[i] || `列${i + 1}`}：${text}`).filter(line => line.split('：')[1]?.trim()).join('\n')
          return (
            <tr>
              {cells.map((cell, idx) => {
                if (idx === 1 && React.isValidElement(cell)) {
                  const cellChildren = (cell.props as any).children
                  return (
                    <td key={idx} style={{ padding: '7px 12px', borderBottom: `1px solid ${tokens.color.divider}`, color: tokens.color.text.secondary, verticalAlign: 'top', wordBreak: 'break-all' }}>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        {title && <RowSaveBtn title={title} rowContent={rowContent} />}
                        <span>{cellChildren}</span>
                      </span>
                    </td>
                  )
                }
                return cell
              })}
            </tr>
          )
        },
        td: ({ children }) => (
          <td style={{ padding: '7px 12px', borderBottom: `1px solid ${tokens.color.divider}`, color: tokens.color.text.secondary, verticalAlign: 'top', wordBreak: 'break-all' }}>
            {children}
          </td>
        ),
        p: ({ children }) => <p style={{ margin: '4px 0', lineHeight: 1.75, color: tokens.color.text.secondary, fontSize: '14px' }}>{children}</p>,
        strong: ({ children }) => <strong style={{ color: tokens.color.text.primary, fontWeight: 600 }}>{children}</strong>,
        h1: ({ children }) => <h1 style={{ fontSize: '16px', fontWeight: 700, margin: '14px 0 6px', color: tokens.color.text.primary }}>{children}</h1>,
        h2: ({ children }) => <h2 style={{ fontSize: '15px', fontWeight: 600, margin: '12px 0 4px', color: tokens.color.text.primary }}>{children}</h2>,
        h3: ({ children }) => <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '10px 0 4px', color: tokens.color.text.primary }}>{children}</h3>,
        ul: ({ children }) => <ul style={{ paddingLeft: '20px', margin: '4px 0', color: tokens.color.text.secondary, fontSize: '14px' }}>{children}</ul>,
        ol: ({ children }) => <ol style={{ paddingLeft: '20px', margin: '4px 0', color: tokens.color.text.secondary, fontSize: '14px' }}>{children}</ol>,
        li: ({ children }) => <li style={{ margin: '3px 0', lineHeight: 1.65 }}>{children}</li>,
        code: ({ children, className }) => {
          const isBlock = !!className?.includes('language-')
          return isBlock ? (
            <code style={{ display: 'block', padding: '10px 14px', borderRadius: '8px', backgroundColor: tokens.color.base.gray, fontSize: '12px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', color: tokens.color.text.secondary }}>{children}</code>
          ) : (
            <code style={{ padding: '1px 5px', borderRadius: '4px', backgroundColor: tokens.color.base.gray, fontSize: '12px', fontFamily: 'monospace', color: tokens.color.text.secondary }}>{children}</code>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )

  if (!isOpen) return null

  const assistantMessages = messages.filter(m => m.role === 'assistant')
  const lastAssistantIndex = [...messages].map((m, i) => m.role === 'assistant' ? i : -1).filter(i => i >= 0).pop() ?? -1

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: '#F2F4F7', display: 'flex', flexDirection: 'column', fontFamily: tokens.typography.fontFamily.zh }}>

      {/* 顶部导航栏 */}
      <div style={{ flexShrink: 0, height: '56px', backgroundColor: tokens.color.base.white, borderBottom: `1px solid ${tokens.color.divider}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: '16px' }}>
        <button
          onClick={onClose}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: tokens.radius.buttonSm, border: 'none', backgroundColor: 'transparent', color: tokens.color.text.secondary, fontSize: '14px', cursor: 'pointer', transition: 'background-color 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = tokens.color.base.gray }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <ArrowLeft size={16} />返回
        </button>
        <div style={{ width: '1px', height: '18px', backgroundColor: tokens.color.divider }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '13px', color: tokens.color.text.tertiary }}>当前主题：</span>
          <span style={{ fontSize: '14px', fontWeight: 500, color: tokens.color.text.primary }}>{topicLabel}</span>
        </div>

      {/* 对话内容区 */}
      <div ref={scrollAreaRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '32px 0 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {messages.map((msg, i) => (
            <div key={i}>
              {msg.role === 'user' ? (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ maxWidth: '72%', padding: '10px 14px', borderRadius: '16px 16px 4px 16px', backgroundColor: tokens.color.accent, color: '#fff', fontSize: '14px', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ borderRadius: '4px 16px 16px 16px', backgroundColor: tokens.color.base.white, border: `1px solid ${tokens.color.border}`, boxShadow: tokens.shadow.diffuse, padding: '16px 20px' }}>
                    {renderContent(msg.content)}
                  </div>
                  {/* 重新生成按钮：仅最后一条 assistant 消息显示 */}
                  {i === lastAssistantIndex && !loading && (
                    <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-start' }}>
                      <button
                        onClick={() => handleRegenerateAt(i)}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '99px', border: `1px solid ${tokens.color.border}`, backgroundColor: tokens.color.base.white, color: tokens.color.text.tertiary, fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = tokens.color.accent; e.currentTarget.style.color = tokens.color.accent }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = tokens.color.border; e.currentTarget.style.color = tokens.color.text.tertiary }}
                      >
                        <RotateCcw size={11} />重新生成
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* 流式输出 */}
          {(loading || streamingContent) && (
            <div style={{ padding: '16px 20px', borderRadius: '4px 16px 16px 16px', backgroundColor: tokens.color.base.white, border: `1px solid ${tokens.color.border}`, boxShadow: tokens.shadow.diffuse }}>
              {streamingContent ? renderContent(streamingContent) : (
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center', padding: '4px 0' }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: tokens.color.text.tertiary, display: 'inline-block', animation: 'inspire-bounce 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
                  ))}
                  <style>{`@keyframes inspire-bounce { 0%,80%,100%{opacity:.3;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }`}</style>
                </div>
              )}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* 底部输入栏 */}
      <div style={{ flexShrink: 0, backgroundColor: tokens.color.base.white, borderTop: `1px solid ${tokens.color.divider}`, padding: '16px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div
            style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', padding: '10px 14px', borderRadius: '14px', border: `1px solid ${tokens.color.border}`, backgroundColor: tokens.color.base.white, boxShadow: tokens.shadow.diffuse, transition: 'border-color 0.15s' }}
            onFocusCapture={e => { e.currentTarget.style.borderColor = tokens.color.accent }}
            onBlurCapture={e => { e.currentTarget.style.borderColor = tokens.color.border }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="继续追问或修改要求……Enter 发送，Shift+Enter 换行"
              rows={1}
              style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', fontSize: '14px', lineHeight: 1.6, color: tokens.color.text.primary, fontFamily: tokens.typography.fontFamily.zh, backgroundColor: 'transparent', minHeight: '24px', maxHeight: '120px', overflowY: 'auto' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              style={{ width: '34px', height: '34px', borderRadius: '99px', border: 'none', backgroundColor: !input.trim() || loading ? tokens.color.base.gray : tokens.color.accent, color: !input.trim() || loading ? tokens.color.text.tertiary : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: !input.trim() || loading ? 'not-allowed' : 'pointer', flexShrink: 0, transition: 'background-color 0.15s' }}
            >
              <Send size={15} />
            </button>
          </div>
          <p style={{ fontSize: '11px', color: tokens.color.text.tertiary, marginTop: '8px', textAlign: 'center' }}>
            由 DeepSeek 驱动 · 遵循「动心·有用·一笑」选题框架
          </p>
        </div>
      </div>

      {/* ── 右侧悬浮创作清单 ── */}
      <style>{`
        @keyframes list-slide-in { from { opacity:0; transform:translateX(12px) } to { opacity:1; transform:translateX(0) } }
        @keyframes fab-shake { 0%,100%{transform:translateY(-50%) rotate(0)} 20%{transform:translateY(-50%) rotate(-12deg)} 40%{transform:translateY(-50%) rotate(12deg)} 60%{transform:translateY(-50%) rotate(-8deg)} 80%{transform:translateY(-50%) rotate(8deg)} }
        @keyframes fab-shake-open { 0%,100%{transform:translateY(-50%) rotate(0)} 20%{transform:translateY(-50%) rotate(-12deg)} 40%{transform:translateY(-50%) rotate(12deg)} 60%{transform:translateY(-50%) rotate(-8deg)} 80%{transform:translateY(-50%) rotate(8deg)} }
      `}</style>

      {/* 悬浮按钮 */}
      <div
        onClick={() => setListOpen(v => !v)}
        style={{
          position: 'fixed', right: 0, top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 200,
          width: '44px', height: '56px',
          backgroundColor: listOpen ? tokens.color.accent : tokens.color.base.white,
          borderTop: `1px solid ${listOpen ? tokens.color.accent : tokens.color.border}`,
          borderLeft: `1px solid ${listOpen ? tokens.color.accent : tokens.color.border}`,
          borderBottom: `1px solid ${listOpen ? tokens.color.accent : tokens.color.border}`,
          borderRight: 'none',
          borderRadius: '12px 0 0 12px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px',
          cursor: 'pointer',
          boxShadow: '-2px 0 12px rgba(0,0,0,0.08)',
          transition: 'background-color 0.15s, border-color 0.15s',
          animation: shake ? 'fab-shake 0.5s ease' : 'none',
        }}
      >
        <ClipboardList size={17} color={listOpen ? '#fff' : tokens.color.text.secondary} />
        {creationList.length > 0 && (
          <span style={{
            fontSize: '10px', fontWeight: 700, lineHeight: 1,
            color: listOpen ? 'rgba(255,255,255,0.9)' : tokens.color.accent,
          }}>
            {creationList.length > 99 ? '99+' : creationList.length}
          </span>
        )}
      </div>

      {/* 展开面板 */}
      {listOpen && (
        <div style={{
          position: 'fixed', right: '44px', top: '50%', transform: 'translateY(-50%)',
          zIndex: 199,
          width: '280px',
          maxHeight: '60vh',
          backgroundColor: tokens.color.base.white,
          border: `1px solid ${tokens.color.border}`,
          borderRadius: '16px 0 0 16px',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.10)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'list-slide-in 0.2s ease',
          fontFamily: tokens.typography.fontFamily.zh,
        }}>
          {/* 面板头部 */}
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${tokens.color.divider}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: tokens.color.text.primary }}>创作清单</span>
            <button onClick={() => setListOpen(false)} style={{ width: '24px', height: '24px', borderRadius: '6px', border: 'none', backgroundColor: 'transparent', color: tokens.color.text.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = tokens.color.base.gray }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <X size={13} />
            </button>
          </div>

          {/* 清单内容 */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {creationList.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: tokens.color.text.tertiary }}>点击星标将选题加入清单</p>
              </div>
            ) : (
              creationList.map(item => (
                <div
                  key={item.id}
                  style={{ padding: '10px 12px', borderRadius: '10px', marginBottom: '4px', cursor: 'pointer', transition: 'background-color 0.15s', position: 'relative' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = tokens.color.base.gray }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  onClick={() => {
                    window.open(`/creation/${item.id}`, '_blank')
                  }}
                >
                  <p style={{ fontSize: '13px', color: tokens.color.text.primary, lineHeight: 1.5, marginBottom: '4px', paddingRight: '20px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: '11px', color: tokens.color.text.tertiary }}>{item.createdAt}</p>
                  <button
                    onClick={e => { e.stopPropagation(); deleteFromList(item.id) }}
                    style={{ position: 'absolute', top: '10px', right: '8px', width: '20px', height: '20px', borderRadius: '4px', border: 'none', backgroundColor: 'transparent', color: tokens.color.text.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0, transition: 'opacity 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#FF3B30'; e.currentTarget.style.opacity = '1' }}
                    onMouseLeave={e => { e.currentTarget.style.color = tokens.color.text.tertiary; e.currentTarget.style.opacity = '0' }}
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <EditorModal isOpen={editorOpen} onClose={() => setEditorOpen(false)} title={editorTitle} inspireContent={editorContent} />
    </div>
  )
}
