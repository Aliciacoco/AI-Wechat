'use client'

import { useState, useEffect } from 'react'
import Modal from './Modal'
import AITitleSuggestions from './AITitleSuggestions'
import HistoricalReview from './HistoricalReview'
import BenchmarkCases from './BenchmarkCases'

interface AIGenerateModalProps {
  isOpen: boolean
  onClose: () => void
  topic: string
}

// 模拟数据
const MOCK_TITLES = [
  {
    id: '1',
    title: '春招季来了！南师学子就业力全面解析',
    style: '信息实用型',
    description: '清晰传达就业数据价值',
    audience: '在校生、校友',
    estimatedViews: 8500,
    tone: '专业权威',
    hotspot: '春招热点',
  },
  {
    id: '2',
    title: '还在焦虑找工作？看南师大如何助力学子圆梦',
    style: '情感共鸣型',
    description: '触动求职焦虑情绪，引发共鸣',
    audience: '应届生',
    estimatedViews: 12000,
    tone: '亲切共鸣',
    hotspot: '就业焦虑',
  },
  {
    id: '3',
    title: '南师学子就业去向曝光：这10个数据让人惊喜',
    style: '悬念好奇型',
    description: '用数字制造好奇心',
    audience: '全体师生',
    estimatedViews: 15000,
    tone: '悬念吸引',
    hotspot: '数据披露',
  },
  {
    id: '4',
    title: '我在南师大，毕业后我去了这些地方',
    style: '荣耀触发型',
    description: '用第一人称激发自豪感',
    audience: '在校生、校友',
    estimatedViews: 10500,
    tone: '自豪骄傲',
    hotspot: '校友故事',
  },
]

const MOCK_HISTORICAL = [
  {
    id: '1',
    title: '春分时节，随园银杏初绿',
    publishDate: '2025年3月20日',
    views: 8500,
    likes: 420,
    url: '#',
    cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png',
  },
  {
    id: '2',
    title: '随园的春天，藏在每一片新叶里',
    publishDate: '2024年3月22日',
    views: 12300,
    likes: 680,
    url: '#',
    cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png',
  },
]

const MOCK_BENCHMARKS = [
  {
    id: '1',
    school: '北京大学',
    title: '未名湖畔春色满园，燕园最美四月天',
    publishDate: '2周前',
    views: 85000,
    likes: 6200,
    url: '#',
    cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png',
    isPopular: true,
  },
  {
    id: '2',
    school: '清华大学',
    title: '春分｜清华园里的24小时美好时光',
    publishDate: '1周前',
    views: 92000,
    likes: 7800,
    url: '#',
    cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png',
    isPopular: true,
  },
  {
    id: '3',
    school: '复旦大学',
    title: '复旦春色｜这是属于你的复旦春天',
    publishDate: '3天前',
    views: 42000,
    likes: 3100,
    url: '#',
    cover: 'https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png',
  },
]

export default function AIGenerateModal({ isOpen, onClose, topic }: AIGenerateModalProps) {
  const [activeLayer, setActiveLayer] = useState<1 | 2 | 3>(1)
  const [favoritedTitles, setFavoritedTitles] = useState<Set<string>>(new Set())

  // 加载状态
  const [loadingTitles, setLoadingTitles] = useState(true)
  const [loadingHistorical, setLoadingHistorical] = useState(true)
  const [loadingBenchmark, setLoadingBenchmark] = useState(true)

  // 数据状态
  const [titles, setTitles] = useState(MOCK_TITLES)
  const [historicalArticles, setHistoricalArticles] = useState(MOCK_HISTORICAL)
  const [benchmarkCases, setBenchmarkCases] = useState(MOCK_BENCHMARKS)

  // 错误状态
  const [error, setError] = useState<string | null>(null)

  // 真实 AI 生成过程
  useEffect(() => {
    if (isOpen && topic) {
      // 重置状态
      setLoadingTitles(true)
      setLoadingHistorical(true)
      setLoadingBenchmark(true)
      setError(null)

      // 第一层：AI 标题生成
      fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, type: 'titles' }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setTitles(data.data)
          } else {
            console.error('Failed to generate titles:', data.error)
            setTitles(MOCK_TITLES) // 失败时使用备用数据
          }
        })
        .catch(err => {
          console.error('Error generating titles:', err)
          setTitles(MOCK_TITLES) // 失败时使用备用数据
        })
        .finally(() => {
          setLoadingTitles(false)
        })

      // 第二层：历史本校回溯
      fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, type: 'historical' }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setHistoricalArticles(data.data)
          } else {
            console.error('Failed to search historical:', data.error)
            setHistoricalArticles(MOCK_HISTORICAL)
          }
        })
        .catch(err => {
          console.error('Error searching historical:', err)
          setHistoricalArticles(MOCK_HISTORICAL)
        })
        .finally(() => {
          setLoadingHistorical(false)
        })

      // 第三层：名校参考对标
      fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, type: 'benchmark' }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setBenchmarkCases(data.data)
          } else {
            console.error('Failed to search benchmark:', data.error)
            setBenchmarkCases(MOCK_BENCHMARKS)
          }
        })
        .catch(err => {
          console.error('Error searching benchmark:', err)
          setBenchmarkCases(MOCK_BENCHMARKS)
        })
        .finally(() => {
          setLoadingBenchmark(false)
        })
    }
  }, [isOpen, topic])

  const handleFavorite = (id: string) => {
    setFavoritedTitles((prev) => {
      const newSet = new Set(prev)
      const title = titles.find((t) => t.id === id)

      if (newSet.has(id)) {
        // 取消收藏
        newSet.delete(id)
        // 从 localStorage 移除
        const stored = localStorage.getItem('favorites')
        if (stored && title) {
          try {
            const favorites = JSON.parse(stored)
            const filtered = favorites.filter((item: any) => item.id !== id)
            localStorage.setItem('favorites', JSON.stringify(filtered))
          } catch (e) {
            console.error('Failed to remove favorite:', e)
          }
        }
      } else {
        // 添加收藏
        newSet.add(id)
        // 保存到 localStorage
        if (title) {
          const stored = localStorage.getItem('favorites')
          let favorites = []
          if (stored) {
            try {
              favorites = JSON.parse(stored)
            } catch (e) {
              console.error('Failed to parse favorites:', e)
            }
          }
          const newFavorite = {
            id: title.id,
            title: title.title,
            style: title.style,
            source: 'AI 生成 · 标题推荐',
            createdAt: new Date().toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }),
          }
          favorites.push(newFavorite)
          localStorage.setItem('favorites', JSON.stringify(favorites))
        }
      }
      return newSet
    })
  }

  const handleCopy = (title: string) => {
    navigator.clipboard.writeText(title)
  }

  const titlesWithFavorites = titles.map((title) => ({
    ...title,
    isFavorited: favoritedTitles.has(title.id),
  }))

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI 灵感生成" size="lg">{/* 主题提示 */}
      <div className="mb-6 p-3 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
        <span className="text-xs" style={{ color: 'var(--foreground-tertiary)' }}>
          当前主题：
        </span>
        <span className="text-sm font-medium ml-2" style={{ color: 'var(--foreground)' }}>
          {topic}
        </span>
      </div>

      {/* 三层垂直排列展示 */}
      <div className="space-y-6">
        {/* 第一层：AI 标题推荐 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white" style={{ backgroundColor: 'var(--primary)' }}>
                1
              </span>
              AI 标题推荐
              {loadingTitles && (
                <span className="text-xs font-normal" style={{ color: 'var(--foreground-tertiary)' }}>
                  生成中...
                </span>
              )}
            </h3>
            {/* 三维策略说明 */}
            {!loadingTitles && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FCE7F3', color: '#9D174D', fontSize: '11px' }}>❤️ 动心</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#D1FAE5', color: '#064E3B', fontSize: '11px' }}>📌 有用</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEF3C7', color: '#78350F', fontSize: '11px' }}>🎯 一笑</span>
              </div>
            )}
          </div>
          <AITitleSuggestions
            titles={titlesWithFavorites}
            onFavorite={handleFavorite}
            onCopy={handleCopy}
            loading={loadingTitles}
          />
        </div>

        {/* 第二层：历史本校回溯 */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white" style={{ backgroundColor: 'var(--primary)' }}>
              2
            </span>
            历史本校回溯
            {loadingHistorical && (
              <span className="text-xs font-normal" style={{ color: 'var(--foreground-tertiary)' }}>
                查询中...
              </span>
            )}
          </h3>
          <HistoricalReview articles={historicalArticles} topic={topic} loading={loadingHistorical} />
        </div>

        {/* 第三层：名校参考对标 */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white" style={{ backgroundColor: 'var(--primary)' }}>
              3
            </span>
            名校参考对标
            {loadingBenchmark && (
              <span className="text-xs font-normal" style={{ color: 'var(--foreground-tertiary)' }}>
                分析中...
              </span>
            )}
          </h3>
          <BenchmarkCases articles={benchmarkCases} topic={topic} loading={loadingBenchmark} />
        </div>
      </div>
    </Modal>
  )
}
