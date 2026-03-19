'use client'

import { useState } from 'react'
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import AccountSwitcher from '@/components/AccountSwitcher'
import InsightCards from '@/components/InsightCards'
import HotTopics from '@/components/HotTopics'
import CalendarPanel from '@/components/CalendarPanel'
import ScoreResult from '@/components/ScoreResult'
import TitleCards from '@/components/TitleCards'
import OutlineSidebar from '@/components/OutlineSidebar'
import TabSwitch from '@/components/TabSwitch'
import AIBrief from '@/components/AIBrief'
import SchoolAvatarScroll from '@/components/SchoolAvatarScroll'
import ArticleWaterfall, { type ArticleCard } from '@/components/ArticleWaterfall'
import SchoolBenchmark from '@/components/SchoolBenchmark'
import AIGenerateModal from '@/components/AIGenerateModal'
import { SCHOOLS, BENCHMARK_ARTICLES, FOLLOWED_SCHOOLS_ARTICLES, OUR_SCHOOL_ARTICLES } from '@/data/schools'

// 三维对标的 Tab 数据
const BENCHMARK_TABS = [
  { id: 'ourschool', label: '本校账号' },
  { id: 'followed', label: '关注高校' },
  { id: 'benchmark', label: '标杆案例' },
]

// 关注高校数据 - 使用真实数据
const FOLLOWED_SCHOOLS = [
  { id: 'ecnu', name: SCHOOLS['华东师大'].name, shortName: SCHOOLS['华东师大'].shortName, logo: SCHOOLS['华东师大'].logo },
  { id: 'bnu', name: SCHOOLS['北京师大'].name, shortName: SCHOOLS['北京师大'].shortName, logo: SCHOOLS['北京师大'].logo },
  { id: 'nanjing', name: SCHOOLS['南京大学'].name, shortName: SCHOOLS['南京大学'].shortName, logo: SCHOOLS['南京大学'].logo },
  { id: 'suzhou', name: SCHOOLS['苏州大学'].name, shortName: SCHOOLS['苏州大学'].shortName, logo: SCHOOLS['苏州大学'].logo },
]

// 本校账号数据
const OUR_SCHOOLS = [
  { id: 'njnu-main', name: SCHOOLS['南京师大'].name, shortName: SCHOOLS['南京师大'].shortName, logo: SCHOOLS['南京师大'].logo, lastUpdate: '2天前' },
  { id: 'njnu-zs', name: SCHOOLS['南师招生'].name, shortName: SCHOOLS['南师招生'].shortName, logo: SCHOOLS['南师招生'].logo, lastUpdate: '5天前' },
]

// 将关注高校文章数据映射到对应的 id
const FOLLOWED_ARTICLES_MAP: Record<string, ArticleCard[]> = {
  'ecnu': FOLLOWED_SCHOOLS_ARTICLES.find(s => s.school === '华东师大')?.articles.map(a => ({
    id: a.id,
    cover: a.cover,
    title: a.title,
    publishTime: a.date,
    views: a.views,
    likes: a.likes,
    url: a.url,
  })) || [],
  'bnu': FOLLOWED_SCHOOLS_ARTICLES.find(s => s.school === '北京师大')?.articles.map(a => ({
    id: a.id,
    cover: a.cover,
    title: a.title,
    publishTime: a.date,
    views: a.views,
    likes: a.likes,
    url: a.url,
  })) || [],
  'nanjing': FOLLOWED_SCHOOLS_ARTICLES.find(s => s.school === '南京大学')?.articles.map(a => ({
    id: a.id,
    cover: a.cover,
    title: a.title,
    publishTime: a.date,
    views: a.views,
    likes: a.likes,
    url: a.url,
  })) || [],
  'suzhou': FOLLOWED_SCHOOLS_ARTICLES.find(s => s.school === '苏州大学')?.articles.map(a => ({
    id: a.id,
    cover: a.cover,
    title: a.title,
    publishTime: a.date,
    views: a.views,
    likes: a.likes,
    url: a.url,
  })) || [],
}

// 本校账号文章数据映射
const OUR_SCHOOL_ARTICLES_MAP: Record<string, ArticleCard[]> = {
  'njnu-main': OUR_SCHOOL_ARTICLES.find(s => s.school === '南京师大')?.articles.map(a => ({
    id: a.id,
    cover: a.cover,
    title: a.title,
    publishTime: a.date,
    views: a.views,
    likes: a.likes,
    url: a.url,
  })) || [],
  'njnu-zs': OUR_SCHOOL_ARTICLES.find(s => s.school === '南师招生')?.articles.map(a => ({
    id: a.id,
    cover: a.cover,
    title: a.title,
    publishTime: a.date,
    views: a.views,
    likes: a.likes,
    url: a.url,
  })) || [],
}

// AI 简报内容 - 每个账号有多个推荐主题,带权重
const AI_BRIEFS = {
  ourschool: [
    {
      accountId: 'njnu-main',
      recommendations: [
        {
          theme: '春招季｜南师学子就业力',
          description: '结合校历和就业数据,展现就业竞争力',
          weight: 10, // 高权重 - 当前热点
        },
        {
          theme: '樱花季｜随园春色美如画',
          description: '结合春季校园美景,展现校园文化底蕴',
          weight: 8,
        },
        {
          theme: '科研突破｜南师团队最新成果',
          description: '展示学术实力,提升学校影响力',
          weight: 6,
        },
        {
          theme: '校友风采｜毕业生职场故事',
          description: '通过校友故事增强在校生自豪感',
          weight: 7,
        },
        {
          theme: '开学季｜新生适应指南',
          description: '实用攻略类内容,高互动性',
          weight: 5,
        },
      ],
    },
    {
      accountId: 'njnu-zs',
      recommendations: [
        {
          theme: '2026招生｜你的梦想从这里起航',
          description: '基于近期咨询热点,制作招生宣传内容',
          weight: 10,
        },
        {
          theme: '专业解读｜这些王牌专业你了解吗',
          description: '深度解析优势专业,吸引高质量生源',
          weight: 8,
        },
        {
          theme: '校园探秘｜带你看不一样的南师',
          description: '以学生视角展现校园生活',
          weight: 7,
        },
        {
          theme: '奖学金政策｜最高可达XX万',
          description: '突出利好政策,增强吸引力',
          weight: 6,
        },
        {
          theme: '学长学姐有话说｜选择南师不后悔',
          description: '真实故事增强可信度',
          weight: 5,
        },
      ],
    },
  ],
  followed: {
    text: '🔥 关注高校近期热点:',
    theme: '校园春景+招生宣传',
    description: '华东师大、北师大等多所高校都在发春日校园美景,建议抄作业「春日限定｜xx大学的浪漫春天」',
  },
  benchmark: {
    text: '💡 推荐主题:',
    theme: '开学季｜新生适应指南',
    description: '使用【数字+信息量】方法:「开学第一周,这10个小技巧能帮你少踩坑!」',
  },
}

type Step = 'idle' | 'scoring' | 'scored' | 'generating' | 'done'

export default function Home() {
  const [accountId, setAccountId] = useState('njnu-main')
  const [topicIdea, setTopicIdea] = useState('')
  const [step, setStep] = useState<Step>('idle')
  const [scoreData, setScoreData] = useState<Record<string, unknown> | null>(null)
  const [titles, setTitles] = useState<unknown[]>([])
  const [error, setError] = useState('')

  const [showHot, setShowHot] = useState(true)
  const [showCal, setShowCal] = useState(false)

  // 三维对标状态
  const [activeTab, setActiveTab] = useState<'followed' | 'benchmark' | 'ourschool'>('ourschool')
  const [selectedSchool, setSelectedSchool] = useState<string | null>('njnu-main')

  // AI灵感生成弹窗状态
  const [showAIModal, setShowAIModal] = useState(false)
  const [aiModalTopic, setAIModalTopic] = useState('')

  // 本校账号推荐主题的当前索引 - 使用 Map 存储每个账号的当前推荐索引
  const [recommendationIndices, setRecommendationIndices] = useState<Record<string, number>>(() => {
    // 初始化时为每个账号选择一个基于权重的随机推荐
    const initialIndices: Record<string, number> = {}
    AI_BRIEFS.ourschool.forEach(account => {
      initialIndices[account.accountId] = weightedRandomIndex(account.recommendations)
    })
    return initialIndices
  })

  // 动态推荐主题缓存 - 存储 AI 生成的推荐
  const [dynamicRecommendations, setDynamicRecommendations] = useState<Record<string, any>>({})

  // 换一条按钮的加载状态
  const [changingRecommendation, setChangingRecommendation] = useState<string | null>(null)

  const showSidebar = step === 'scored' || step === 'generating' || step === 'done'

  // 权重随机选择函数
  function weightedRandomIndex(items: Array<{ weight: number }>): number {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
    let random = Math.random() * totalWeight

    for (let i = 0; i < items.length; i++) {
      random -= items[i].weight
      if (random <= 0) {
        return i
      }
    }
    return 0 // fallback
  }

  // 处理"换一条"推荐 - 调用 API 生成新推荐
  const handleChangeRecommendation = async (accountId: string) => {
    const account = AI_BRIEFS.ourschool.find(a => a.accountId === accountId)
    if (!account) return

    // 设置加载状态
    setChangingRecommendation(accountId)

    try {
      // 调用 API 生成新推荐
      const schoolInfo = OUR_SCHOOLS.find(s => s.id === accountId)
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'recommendation',
          accountId: accountId,
          accountName: schoolInfo?.name || '南京师范大学',
        }),
      })

      const data = await response.json()

      if (data.success && data.data) {
        // 将新生成的推荐存储到动态推荐缓存
        setDynamicRecommendations(prev => ({
          ...prev,
          [accountId]: data.data,
        }))
      } else {
        // API 失败时回退到本地权重随机选择
        console.error('Failed to generate recommendation:', data.error)
        fallbackToLocalRecommendation(account, accountId)
      }
    } catch (error) {
      console.error('Error calling recommendation API:', error)
      // 网络错误时回退到本地权重随机选择
      fallbackToLocalRecommendation(account, accountId)
    } finally {
      setChangingRecommendation(null)
    }
  }

  // 回退到本地权重随机选择
  const fallbackToLocalRecommendation = (account: any, accountId: string) => {
    const currentIndex = recommendationIndices[accountId] || 0
    let newIndex: number

    if (account.recommendations.length <= 1) {
      return
    }

    do {
      newIndex = weightedRandomIndex(account.recommendations)
    } while (newIndex === currentIndex && account.recommendations.length > 1)

    setRecommendationIndices(prev => ({
      ...prev,
      [accountId]: newIndex
    }))

    // 清除该账号的动态推荐
    setDynamicRecommendations(prev => {
      const newRecs = { ...prev }
      delete newRecs[accountId]
      return newRecs
    })
  }

  // 构建适配 SchoolAvatarScroll 的 recommendations 数据
  const getRecommendationsForScroll = () => {
    return AI_BRIEFS.ourschool.map(account => {
      // 优先使用动态生成的推荐
      if (dynamicRecommendations[account.accountId]) {
        return {
          accountId: account.accountId,
          theme: dynamicRecommendations[account.accountId].theme,
          description: dynamicRecommendations[account.accountId].description,
        }
      }

      // 否则使用预设推荐
      const index = recommendationIndices[account.accountId] || 0
      const recommendation = account.recommendations[index]
      return {
        accountId: account.accountId,
        theme: recommendation.theme,
        description: recommendation.description,
      }
    })
  }

  // 获取当前显示的文章列表
  const getCurrentArticles = (): ArticleCard[] => {
    if (activeTab === 'followed' && selectedSchool) {
      return FOLLOWED_ARTICLES_MAP[selectedSchool] || []
    } else if (activeTab === 'ourschool' && selectedSchool) {
      return OUR_SCHOOL_ARTICLES_MAP[selectedSchool] || []
    }
    return []
  }

  const handleAccountChange = (id: string) => {
    setAccountId(id)
    setStep('idle')
    setScoreData(null)
    setTitles([])
    setError('')
  }

  const handleScore = async () => {
    if (!topicIdea.trim()) return
    setStep('scoring')
    setError('')
    setScoreData(null)
    setTitles([])
    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, idea: topicIdea })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setScoreData(data)
      setStep('scored')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '请求失败，请重试')
      setStep('idle')
    }
  }

  const handleGenerateTitles = async () => {
    setStep('generating')
    try {
      const res = await fetch('/api/titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, topic: topicIdea })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setTitles(Array.isArray(data) ? data : [])
      setStep('done')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '请求失败，请重试')
      setStep('scored')
    }
  }

  const handleSelectTopic = (idea: string) => {
    setTopicIdea(idea)
    setStep('idle')
    setScoreData(null)
    setTitles([])
    setTimeout(() => {
      document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  // 处理AI简报点击
  const handleAIBriefClick = (topic?: string) => {
    let brief
    if (activeTab === 'ourschool' && topic) {
      setAIModalTopic(topic)
    } else if (activeTab === 'followed') {
      brief = AI_BRIEFS.followed
      setAIModalTopic(brief.theme)
    } else if (activeTab === 'benchmark') {
      brief = AI_BRIEFS.benchmark
      setAIModalTopic(brief.theme)
    }
    setShowAIModal(true)
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className={`flex gap-6 items-start ${showSidebar ? '' : 'justify-center'}`}>

          {/* 主内容区 */}
          <main className={`space-y-6 min-w-0 flex-1`}>

            {/* 三维对标体系 */}
            <section>
              <div className="bg-white rounded-lg border p-6" style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                {/* Tab 切换 */}
                <TabSwitch
                  tabs={BENCHMARK_TABS}
                  activeTab={activeTab}
                  onChange={(id) => {
                    setActiveTab(id as typeof activeTab)
                    // 切换 tab 时重置选中的学校
                    if (id === 'ourschool') {
                      setSelectedSchool('njnu-main')
                    } else if (id === 'followed') {
                      setSelectedSchool('ecnu')
                    } else {
                      setSelectedSchool(null)
                    }
                  }}
                />

                <div className="mt-6">
                  {/* 本校账号维度 */}
                  {activeTab === 'ourschool' && (
                    <>
                      <SchoolAvatarScroll
                        schools={OUR_SCHOOLS}
                        selectedId={selectedSchool}
                        onSelect={setSelectedSchool}
                        recommendations={getRecommendationsForScroll()}
                        onRecommendationClick={handleAIBriefClick}
                        onChangeRecommendation={handleChangeRecommendation}
                        changingRecommendationId={changingRecommendation}
                      />
                      <ArticleWaterfall articles={getCurrentArticles()} />
                    </>
                  )}

                  {/* 关注高校维度 */}
                  {activeTab === 'followed' && (
                    <>
                      <SchoolAvatarScroll
                        schools={FOLLOWED_SCHOOLS}
                        selectedId={selectedSchool}
                        onSelect={setSelectedSchool}
                      />
                      <ArticleWaterfall articles={getCurrentArticles()} showHighViewsTag={true} />
                    </>
                  )}

                  {/* 标杆案例维度 */}
                  {activeTab === 'benchmark' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {BENCHMARK_ARTICLES.map((schoolData) => (
                          <SchoolBenchmark
                            key={schoolData.school}
                            school={schoolData.school}
                            logo={SCHOOLS[schoolData.school as keyof typeof SCHOOLS]?.logo || ''}
                            articles={schoolData.articles}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>

            <div className="h-12" />
          </main>

          {/* 右侧侧边栏：大纲 + 意向图 + 标题预览 */}
          {showSidebar && (
            <aside className="w-64 flex-shrink-0 sticky top-20">
              <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--foreground-tertiary)' }}>
                文案预览
              </div>
              <OutlineSidebar
                topic={topicIdea}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                titles={titles as any[]}
                generating={step === 'generating'}
              />
            </aside>
          )}

        </div>
      </div>

      {/* AI灵感生成弹窗 */}
      <AIGenerateModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        topic={aiModalTopic}
      />
    </div>
  )
}
