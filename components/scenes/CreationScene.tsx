'use client'

import { useState, useEffect } from 'react'
import { Star, Trash2, Copy, Check, Calendar } from 'lucide-react'
import { Card, Badge, Button } from '@/components/ui'
import { tokens } from '@/lib/design-tokens'
import EditorModal from '@/components/EditorModal'

interface FavoriteItem {
  id: string
  title: string
  style: string
  source: string
  createdAt: string
}

function loadFavorites(): FavoriteItem[] {
  const stored = localStorage.getItem('favorites')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error('Failed to load favorites:', e)
    }
  }
  return [
    { id: '1', title: '春分时节，随园的这抹绿意藏着师大人的诗与远方', style: '情感共鸣型', source: '选题页 · 全网热点', createdAt: '2026-03-19 10:30' },
    { id: '2', title: '随园春色｜南师大最美春天打卡地图来了！', style: '信息实用型', source: 'AI 生成 · 标题推荐', createdAt: '2026-03-19 09:15' },
    { id: '3', title: '春天来了，随园的这些宝藏角落你都去过吗？', style: '悬念好奇型', source: 'AI 生成 · 标题推荐', createdAt: '2026-03-18 16:45' },
  ]
}

export default function CreationScene() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorTitle, setEditorTitle] = useState('')

  const refresh = () => {
    setFavorites(loadFavorites())
  }

  useEffect(() => {
    refresh()

    const handler = () => refresh()
    window.addEventListener('scene:enter-creation', handler)
    return () => window.removeEventListener('scene:enter-creation', handler)
  }, [])

  const handleDelete = (id: string) => {
    const updated = favorites.filter((item) => item.id !== id)
    setFavorites(updated)
    localStorage.setItem('favorites', JSON.stringify(updated))
  }

  const handleCopy = (id: string, title: string) => {
    navigator.clipboard.writeText(title)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleClearAll = () => {
    if (confirm('确定要清空所有收藏吗？')) {
      setFavorites([])
      localStorage.removeItem('favorites')
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Badge variant="default">{favorites.length} 条</Badge>
          </div>
          {favorites.length > 0 && (
            <Button variant="danger" size="sm" onClick={handleClearAll}>
              <Trash2 size={13} />清空收藏
            </Button>
          )}
        </div>

        {favorites.length === 0 ? (
          <Card style={{ padding: '64px 32px', textAlign: 'center' }}>
            <Star size={40} style={{ color: tokens.color.text.tertiary, margin: '0 auto 16px' }} />
            <p style={{ fontSize: '15px', fontWeight: tokens.typography.weight.medium, color: tokens.color.text.primary, marginBottom: '8px' }}>
              还没有收藏任何内容
            </p>
            <p style={{ fontSize: '13px', color: tokens.color.text.tertiary }}>
              在选题页或 AI 生成弹窗中点击星标图标，即可收藏标题和灵感
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {favorites.map((item) => (
              <Card key={item.id} style={{ padding: '16px 20px' }}>
                <div className="flex items-start justify-between gap-4">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '15px', fontWeight: tokens.typography.weight.medium, color: tokens.color.text.primary, lineHeight: 1.6, marginBottom: '10px' }}>
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="accent" style={{ fontSize: '11px' }}>{item.style}</Badge>
                      <span style={{ fontSize: '12px', color: tokens.color.text.tertiary }}>
                        来源：{item.source}
                      </span>
                      <span style={{ fontSize: '12px', color: tokens.color.text.tertiary, display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Calendar size={11} />{item.createdAt}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <button
                      onClick={() => {
                        setEditorTitle(item.title)
                        setEditorOpen(true)
                      }}
                      style={{
                        height: '32px', padding: '0 12px',
                        borderRadius: tokens.radius.button,
                        border: 'none',
                        backgroundColor: tokens.color.accent,
                        color: tokens.color.base.white,
                        fontSize: '12px',
                        fontWeight: tokens.typography.weight.medium,
                        fontFamily: tokens.typography.fontFamily.zh,
                        display: 'flex', alignItems: 'center', gap: '4px',
                        cursor: 'pointer', transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0062C4' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = tokens.color.accent }}
                    >
                      进入创作
                    </button>
                    <button
                      onClick={() => handleCopy(item.id, item.title)}
                      title="复制"
                      style={{
                        width: '32px', height: '32px', borderRadius: tokens.radius.buttonSm,
                        border: 'none', backgroundColor: 'transparent',
                        color: copiedId === item.id ? '#065F46' : tokens.color.text.tertiary,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = tokens.color.base.gray }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      {copiedId === item.id ? <Check size={15} /> : <Copy size={15} />}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="删除"
                      style={{
                        width: '32px', height: '32px', borderRadius: tokens.radius.buttonSm,
                        border: 'none', backgroundColor: 'transparent',
                        color: tokens.color.text.tertiary,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#FF3B30'
                        e.currentTarget.style.backgroundColor = '#FFF2F1'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = tokens.color.text.tertiary
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <EditorModal isOpen={editorOpen} onClose={() => setEditorOpen(false)} title={editorTitle} />
    </div>
  )
}
