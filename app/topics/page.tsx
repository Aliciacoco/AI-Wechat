'use client'

import { useState } from 'react'
import SuperSearch from '@/components/SuperSearch'
import QuickTags from '@/components/QuickTags'
import HotTopicsPool from '@/components/HotTopicsPool'
import CalendarNodes from '@/components/CalendarNodes'
import ContentBalancer from '@/components/ContentBalancer'
import AIGenerateModal from '@/components/AIGenerateModal'
import AlgorithmInfo from '@/components/AlgorithmInfo'

// 快捷标签数据
const QUICK_TAGS = [
  { id: 'graduation', label: '毕业季', icon: '🎓' },
  { id: 'campus', label: '随园美景', icon: '🌸' },
  { id: 'admission', label: '招生宣传', icon: '📢' },
  { id: 'research', label: '科研成果', icon: '🔬' },
  { id: 'activity', label: '校园活动', icon: '🎉' },
]

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

// 节点日历数据
const CALENDAR_NODES = [
  {
    id: '1',
    date: '3月20日',
    title: '春分',
    type: 'season' as const,
    description: '春分时节，随园草长莺飞，可结合校园春景和学生活动策划内容',
    daysLeft: 5,
  },
  {
    id: '2',
    date: '3月25日',
    title: '南京师范大学校庆日',
    type: 'school' as const,
    description: '建校周年纪念，可策划校友回忆、校史故事、师生祝福等系列内容',
    daysLeft: 10,
  },
  {
    id: '3',
    date: '4月5日',
    title: '清明节',
    type: 'festival' as const,
    description: '传统节日，可结合缅怀先贤、校史人物、踏青活动等主题',
    daysLeft: 21,
  },
  {
    id: '4',
    date: '5月4日',
    title: '五四青年节',
    type: 'festival' as const,
    description: '青年节日，可策划学生风采、青年力量、校园创新等内容',
    daysLeft: 50,
  },
]

// 内容平衡数据 - 按账号展示
const CONTENT_BALANCES = [
  {
    id: 'njnu-main',
    name: '南京师范大学',
    logo: '/schools/南京师大.jpg',
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
    logo: '/schools/南师招生.jpg',
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

export default function TopicsPage() {
  const [searchResults, setSearchResults] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentTopic, setCurrentTopic] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (query: string) => {
    console.log('搜索查询:', query)
    setSearchResults(query)
    setIsSearching(true)

    try {
      // 调用 API 获取推荐
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: query, type: 'titles' })
      })

      const result = await response.json()

      if (result.success) {
        // 打开弹窗
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

  const handleTagSelect = (tag: { id: string; label: string }) => {
    console.log('选择标签:', tag)
    setSearchResults(tag.label)
    // 选择标签也触发搜索
    handleSearch(tag.label)
  }

  const handleGenerateIdea = async (item: any) => {
    console.log('生成灵感:', item)
    // 提取主题
    let topic = ''
    if (item.title) {
      topic = item.title
    } else if (item.category) {
      topic = item.category
    } else if (typeof item === 'string') {
      // 从内容平衡传来的推荐
      topic = item
    } else {
      topic = '随机选题'
    }

    // 设置主题并打开弹窗
    setCurrentTopic(topic)

    // 延迟一小段时间，让用户感觉正在处理
    await new Promise(resolve => setTimeout(resolve, 300))

    setModalOpen(true)
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* 页面标题和算法信息 */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
            🎯 选题灵感
          </h1>
          <AlgorithmInfo />
        </div>

        {/* 超级搜索框 */}
        <SuperSearch onSearch={handleSearch} />

        {/* 快捷标签 */}
        <QuickTags tags={QUICK_TAGS} onSelectTag={handleTagSelect} />

        {/* 搜索结果提示 */}
        {searchResults && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--primary-light)', borderLeft: '3px solid var(--primary)' }}>
            <p className="text-sm" style={{ color: 'var(--foreground)' }}>
              正在为您分析「<strong>{searchResults}</strong>」相关选题...
            </p>
          </div>
        )}

        {/* 灵感池 - 三栏并排布局 */}
        <div className="grid grid-cols-3 gap-6">
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

