'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, CalendarDays, BarChart2 } from 'lucide-react'
import SuperSearch from '@/components/SuperSearch'
import HotTopicsPool from '@/components/HotTopicsPool'
import CalendarNodes from '@/components/CalendarNodes'
import ContentBalancer from '@/components/ContentBalancer'
import AIGenerateModal from '@/components/AIGenerateModal'
import { PromptButton } from '@/components/AlgorithmInfo'
import { NJNU_CALENDAR_NODES, getUpcomingNodes } from '@/data/njnu-calendar'
import {
  buildHotTopicPrompt,
  buildCalendarNodePrompt,
  buildContentBalancePrompt,
  buildTodayRecommendPrompt,
  buildSearchPrompt,
} from '@/lib/inspire-prompts'

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

// 节点日历数据在模块级不计算（避免 SSR/client 不一致），移入组件 state

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
  const [modalOpen, setModalOpen] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [displayTopic, setDisplayTopic] = useState('')
  const [isLoadingRecommend, setIsLoadingRecommend] = useState(false)
  // 客户端计算，避免 SSR/hydration 不一致
  const [calendarNodes, setCalendarNodes] = useState<ReturnType<typeof getUpcomingNodes>>([])
  useEffect(() => {
    setCalendarNodes(getUpcomingNodes(NJNU_CALENDAR_NODES))
  }, [])

  function openModal(prompt: string, label: string) {
    setCurrentPrompt(prompt)
    setDisplayTopic(label)
    setModalOpen(true)
  }

  const handleSearch = (query: string) => {
    openModal(buildSearchPrompt(query), query)
  }

  const handleGenerateIdea = (item: any) => {
    // 全网热点：item 有 title/source/tags/heat
    if (item.source !== undefined) {
      openModal(buildHotTopicPrompt(item), `热点：${item.title}`)
      return
    }
    // 节点日历：item 有 type/topics/description（CalendarNode）
    if (item.type !== undefined && item.topics !== undefined) {
      openModal(buildCalendarNodePrompt(item), `节点：${item.title}`)
      return
    }
    // fallback
    openModal(buildSearchPrompt(typeof item === 'string' ? item : item.title || ''), item.title || item)
  }

  const handleContentBalanceIdea = (accountId: string, recommendation: string) => {
    const account = CONTENT_BALANCES.find(a => a.id === accountId)
    if (!account) return
    openModal(buildContentBalancePrompt(account), `内容平衡：${account.name}`)
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
            onTodayRecommend={() => {
              const prompt = buildTodayRecommendPrompt(calendarNodes, CONTENT_BALANCES)
              openModal(prompt, '今日最推荐')
            }}
          />
        </div>

        {/* 灵感池 - 三栏并排布局 */}
        <div className="grid grid-cols-3 gap-6" style={{ padding: '0 8px' }}>
          {/* 全网热点 */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={15} color="#86868B" />
              </div>
              <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>全网热点</h2>
            </div>
            <HotTopicsPool topics={HOT_TOPICS} onGenerateIdea={handleGenerateIdea} />
          </section>

          {/* 节点日历 */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarDays size={15} color="#86868B" />
              </div>
              <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>节点日历</h2>
            </div>
            <CalendarNodes nodes={calendarNodes} onGenerateIdea={handleGenerateIdea} />
          </section>

          {/* 内容平衡 */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart2 size={15} color="#86868B" />
              </div>
              <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>内容平衡</h2>
            </div>
            <ContentBalancer accounts={CONTENT_BALANCES} onGenerateIdea={handleContentBalanceIdea} />
          </section>
        </div>
      </div>

      {/* AI 灵感全屏页 */}
      <AIGenerateModal isOpen={modalOpen} onClose={() => setModalOpen(false)} initialPrompt={currentPrompt} displayTopic={displayTopic} />
    </div>
  )
}
