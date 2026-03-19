'use client'

import { useState, useEffect } from 'react'
import { Star, Trash2, Copy, Check, Calendar } from 'lucide-react'

interface FavoriteItem {
  id: string
  title: string
  style: string
  source: string
  createdAt: string
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // 从 localStorage 加载收藏
  useEffect(() => {
    const stored = localStorage.getItem('favorites')
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to load favorites:', e)
      }
    } else {
      // 模拟数据
      const mockFavorites: FavoriteItem[] = [
        {
          id: '1',
          title: '春分时节，随园的这抹绿意藏着师大人的诗与远方',
          style: '情感流',
          source: '选题页 · 全网热点',
          createdAt: '2026-03-19 10:30',
        },
        {
          id: '2',
          title: '随园春色｜南师大最美春天打卡地图来了！',
          style: '视觉流',
          source: 'AI 生成 · 标题推荐',
          createdAt: '2026-03-19 09:15',
        },
        {
          id: '3',
          title: '春天来了，随园的这些宝藏角落你都去过吗？',
          style: '互动流',
          source: 'AI 生成 · 标题推荐',
          createdAt: '2026-03-18 16:45',
        },
      ]
      setFavorites(mockFavorites)
    }
  }, [])

  const handleDelete = (id: string) => {
    const newFavorites = favorites.filter((item) => item.id !== id)
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
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
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              ⭐ 收藏夹
            </h1>
            <span className="text-sm" style={{ color: 'var(--foreground-tertiary)' }}>
              已收藏的标题与灵感
            </span>
            <span
              className="text-xs px-2 py-1 rounded"
              style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--foreground-tertiary)' }}
            >
              共 {favorites.length} 条
            </span>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm px-4 py-2 rounded-md transition-all flex items-center gap-2"
              style={{ color: '#ef4444', backgroundColor: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fef2f2'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <Trash2 size={14} />
              清空收藏
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          // 空状态
          <div
            className="rounded-lg border p-12 text-center"
            style={{ borderColor: 'var(--border)', backgroundColor: 'white' }}
          >
            <Star size={48} style={{ color: 'var(--foreground-tertiary)', margin: '0 auto 16px' }} />
            <h3 className="text-base font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              还没有收藏任何内容
            </h3>
            <p className="text-sm" style={{ color: 'var(--foreground-tertiary)' }}>
              在选题页或 AI 生成弹窗中点击星标图标，即可收藏标题和灵感
            </p>
          </div>
        ) : (
          // 收藏列表
          <div className="grid grid-cols-1 gap-4">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border p-5 transition-all hover:shadow-md group"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* 标题 */}
                    <h3 className="text-base font-medium mb-3 leading-relaxed" style={{ color: 'var(--foreground)' }}>
                      {item.title}
                    </h3>

                    {/* 元信息 */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className="text-xs px-2 py-1 rounded"
                        style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}
                      >
                        {item.style}
                      </span>
                      <span className="text-xs flex items-center gap-1" style={{ color: 'var(--foreground-tertiary)' }}>
                        来源：{item.source}
                      </span>
                      <span className="text-xs flex items-center gap-1" style={{ color: 'var(--foreground-tertiary)' }}>
                        <Calendar size={12} />
                        {item.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleCopy(item.id, item.title)}
                      className="w-9 h-9 rounded-md flex items-center justify-center transition-all"
                      style={{
                        color: copiedId === item.id ? '#10b981' : 'var(--foreground-tertiary)',
                        backgroundColor: 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--background-hover)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                      title="复制"
                    >
                      {copiedId === item.id ? <Check size={16} /> : <Copy size={16} />}
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-9 h-9 rounded-md flex items-center justify-center transition-all"
                      style={{
                        color: 'var(--foreground-tertiary)',
                        backgroundColor: 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#ef4444'
                        e.currentTarget.style.backgroundColor = '#fef2f2'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--foreground-tertiary)'
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                      title="删除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

