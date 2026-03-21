'use client'

import { useState } from 'react'
import SuperSearch from '@/components/SuperSearch'
import HotTopicsPool from '@/components/HotTopicsPool'
import CalendarNodes from '@/components/CalendarNodes'
import ContentBalancer from '@/components/ContentBalancer'
import AIGenerateModal from '@/components/AIGenerateModal'
import { PromptButton } from '@/components/AlgorithmInfo'
import { NJNU_CALENDAR_NODES, getUpcomingNodes } from '@/data/njnu-calendar'

// 热点数据
const HOT_TOPICS = [
  {
    id: '1',
    title: '高校开学季：多所大学推出AI助手帮新生适应校园生活',
    source: '微博',
    heat: 98,
    tags: ['AI', '开学季', '校园生活'],
  },
  {
    id: '2',
    title: '师范类院校就业率持续走高，教育行业人才需求旺盛',
    source: '抖音',
    heat: 85,
    tags: ['就业', '师范', '教育'],
  },
  {
    id: '3',
    title: '秋日校园美景刷屏，多所高校晒出银杏大道',
    source: '小红书',
    heat: 92,
    tags: ['校园', '秋天', '美景'],
  },
  {
    id: '4',
    title: '大学生创新创业大赛启动，多个项目获千万级投资',
    source: '微信',
    heat: 76,
    tags: ['创业', '创新', '投资'],
  },
  {
    id: '5',
    title: '高校图书馆深夜亮灯，考研学子备战进入冲刺阶段',
    source: '微博',
    heat: 88,
    tags: ['考研', '学习', '图书馆'],
  },
  {
    id: '6',
    title: '名师开讲：如何在大学四年收获最大价值',
    source: '知乎',
    heat: 72,
    tags: ['教育', '成长', '导师'],
  },
]

// 节点日历数据 —— 从南师大全年节点库动态取近90天内节点
const CALENDAR_NODES = getUpcomingNodes(NJNU_CALENDAR_NODES)

// 内容平衡数据 - 按账号展示
const CONTENT_BALANCES = [
  {
    id: 'njnu-main',
    name: '南京师范大学',
    logo: '/schools/njnu.jpg',
    contentTypes: [
      { name: '人物专访', current: 8, recommended: 20 },
      { name: '校园活动', current: 35, recommended: 25 },
      { name: '科研成果', current: 12, recommended: 20 },
      { name: '招生宣传', current: 25, recommended: 15 },
      { name: '校园风景', current: 20, recommended: 20 },
    ],
    recommendation: '人物专访 - 优秀师生、校友故事',
  },
  {
    id: 'njnu-zs',
    name: '南师招生',
    logo: '/schools/njnu-zs.jpg',
    contentTypes: [
      { name: '专业介绍', current: 45, recommended: 35 },
      { name: '招生政策', current: 30, recommended: 25 },
      { name: '校园生活', current: 10, recommended: 20 },
      { name: '学长学姐说', current: 5, recommended: 15 },
      { name: '答疑解惑', current: 10, recommended: 5 },
    ],
    recommendation: '学长学姐说 - 在校生分享体验',
  },
]

export default function TopicsScene() {
  const [searchResults, setSearchResults] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentTopic, setCurrentTopic] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingRecommend, setIsLoadingRecommend] = useState(false)

  const handleSearch = async (query: string) => {
    console.log('搜索查询:', query)
    setSearchResults(query)
    setIsSearching(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: query, type: 'titles' })
      })

      const result = await response.json()

      if (result.success) {
        setCurrentTopic(query)
        setModalOpen(true)
      } else {
        alert('生成失败：' + (result.error || '未知错误'))
      }
    } catch (error) {
      console.error('Search error:', error)
      alert('请求失败，请重试')
    } finally {
      setIsSearching(false)
    }
  }

  const handleTagSelect = (label: string) => {
    setSearchResults(label)
    handleSearch(label)
  }

  const handleGenerateIdea = async (item: any) => {
    console.log('生成灵感:', item)
    let topic = ''
    if (item.title) {
      topic = item.title
    } else if (item.category) {
      topic = item.category
    } else if (typeof item === 'string') {
      topic = item
    } else {
      topic = '随机选题'
    }

    setCurrentTopic(topic)
    await new Promise(resolve => setTimeout(resolve, 300))
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-8" style={{ paddingTop: '48px', paddingBottom: '48px' }}>

        {/* 搜索框区域 - 居中布局，提示词按钮右对齐在上方 */}
        <div style={{ maxWidth: '680px', margin: '0 auto 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
            <PromptButton />
          </div>
          <SuperSearch
            onSearch={handleSearch}
            recommendLoading={isLoadingRecommend}
            onTodayRecommend={async () => {
              setIsLoadingRecommend(true)
              try {
                const res = await fetch('/api/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ type: 'recommendation', accountId: 'njnu-main', accountName: '南京师范大学' }),
                })
                const result = await res.json()
                const topic = result.success && result.data?.theme
                  ? result.data.theme
                  : '南师大今日推荐选题'
                setCurrentTopic(topic)
                setModalOpen(true)
              } catch {
                setCurrentTopic('南师大今日推荐选题')
                setModalOpen(true)
              } finally {
                setIsLoadingRecommend(false)
              }
            }}
          />
        </div>

        {/* 灵感池 - 三栏并排布局 */}
        <div className="grid grid-cols-3 gap-6" style={{ padding: '0 8px' }}>
          {/* 全网热点 */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <span>🔥</span> 全网热点
              </h2>
            </div>
            <HotTopicsPool topics={HOT_TOPICS} onGenerateIdea={handleGenerateIdea} />
          </section>

          {/* 节点日历 */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <span>📅</span> 节点日历
              </h2>
            </div>
            <CalendarNodes nodes={CALENDAR_NODES} onGenerateIdea={handleGenerateIdea} />
          </section>

          {/* 内容调节器 */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <span>⚖️</span> 内容平衡
              </h2>
            </div>
            <ContentBalancer accounts={CONTENT_BALANCES} onGenerateIdea={(accountId, recommendation) => handleGenerateIdea(recommendation)} />
          </section>
        </div>
      </div>

      {/* AI 生成弹窗 */}
      <AIGenerateModal isOpen={modalOpen} onClose={() => setModalOpen(false)} topic={currentTopic} />
    </div>
  )
}
