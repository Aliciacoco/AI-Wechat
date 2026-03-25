'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { Flame } from 'lucide-react'
import OutlineSidebar from '@/components/OutlineSidebar'
import ArticleWaterfall, { type ArticleCard } from '@/components/ArticleWaterfall'
import SchoolBenchmark from '@/components/SchoolBenchmark'
import AIGenerateModal from '@/components/AIGenerateModal'
import { tokens } from '@/lib/design-tokens'
import { Divider } from '@/components/ui'
import { SCHOOLS, BENCHMARK_ARTICLES, FOLLOWED_SCHOOLS_ARTICLES, OUR_SCHOOL_ARTICLES } from '@/data/schools'
import { SCHOOL_PROFILES } from '@/data/school-profiles'
import { articleAnalysisCache } from '@/lib/article-analysis-cache'
import { buildInsightReferencePrompt } from '@/lib/prompt-builder'
import { useScene } from '@/components/SceneProvider'

// 关注高校（固定）
const FOLLOWED_SCHOOLS = [
  { id: 'ecnu', name: SCHOOLS['华东师大'].name, shortName: SCHOOLS['华东师大'].shortName, logo: SCHOOLS['华东师大'].logo },
  { id: 'bnu', name: SCHOOLS['北京师大'].name, shortName: SCHOOLS['北京师大'].shortName, logo: SCHOOLS['北京师大'].logo },
  { id: 'nanjing', name: SCHOOLS['南京大学'].name, shortName: SCHOOLS['南京大学'].shortName, logo: SCHOOLS['南京大学'].logo },
  { id: 'suzhou', name: SCHOOLS['苏州大学'].name, shortName: SCHOOLS['苏州大学'].shortName, logo: SCHOOLS['苏州大学'].logo },
]

const FOLLOWED_ARTICLES_MAP: Record<string, ArticleCard[]> = {
  'ecnu': FOLLOWED_SCHOOLS_ARTICLES.find(s => s.school === '华东师大')?.articles.map(a => ({
    id: a.id, cover: a.cover, title: a.title, publishTime: a.date, views: a.views, likes: a.likes, url: a.url,
  })) || [],
  'bnu': FOLLOWED_SCHOOLS_ARTICLES.find(s => s.school === '北京师大')?.articles.map(a => ({
    id: a.id, cover: a.cover, title: a.title, publishTime: a.date, views: a.views, likes: a.likes, url: a.url,
  })) || [],
  'nanjing': FOLLOWED_SCHOOLS_ARTICLES.find(s => s.school === '南京大学')?.articles.map(a => ({
    id: a.id, cover: a.cover, title: a.title, publishTime: a.date, views: a.views, likes: a.likes, url: a.url,
  })) || [],
  'suzhou': FOLLOWED_SCHOOLS_ARTICLES.find(s => s.school === '苏州大学')?.articles.map(a => ({
    id: a.id, cover: a.cover, title: a.title, publishTime: a.date, views: a.views, likes: a.likes, url: a.url,
  })) || [],
}

const FOLLOWED_IDS = new Set(FOLLOWED_SCHOOLS.map(s => s.id))

// ── Avatar 按钮 ────────────────────────────────────────────────
interface AvatarBtnProps {
  id: string
  name: string
  shortName: string
  logo: string
  selected: boolean
  onClick: () => void
}

function AvatarBtn({ id, name, shortName, logo, selected, onClick }: AvatarBtnProps) {
  return (
    <button
      onClick={onClick}
      title={name}
      style={{
        flexShrink: 0,
        background: 'none',
        border: 'none',
        padding: '4px 2px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        lineHeight: 0,
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          overflow: 'hidden',
          position: 'relative',
          outline: selected
            ? `2.5px solid ${tokens.color.accent}`
            : `1.5px solid ${tokens.color.border}`,
          outlineOffset: '2px',
          transition: 'outline-color 0.15s',
        }}
      >
        {logo ? (
          <Image src={logo} alt={name} fill sizes="40px" className="object-cover" />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: tokens.color.base.gray,
            fontSize: '11px', fontWeight: tokens.typography.weight.semibold,
            color: tokens.color.text.secondary,
          }}>
            {shortName.slice(0, 2)}
          </div>
        )}
      </div>
      <span style={{
        fontSize: '10px',
        fontWeight: selected ? tokens.typography.weight.semibold : tokens.typography.weight.regular,
        color: selected ? tokens.color.accent : tokens.color.text.tertiary,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        transition: 'color 0.15s',
      }}>
        {shortName}
      </span>
    </button>
  )
}

// ── 导航栏 ─────────────────────────────────────────────────────
interface OurSchoolEntry {
  id: string
  name: string
  shortName: string
  logo: string
}

interface BenchmarkNavProps {
  selectedId: string
  onSelect: (id: string) => void
  ourSchools: OurSchoolEntry[]
}

function BenchmarkNav({ selectedId, onSelect, ourSchools }: BenchmarkNavProps) {
  return (
    <div>
      {/* Dock 容器 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        backgroundColor: '#F2F4F7',
        borderRadius: tokens.radius.buttonSm,
        padding: '6px 10px',
      }}>
        {/* 左侧：推荐 + 关注高校头像 */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '6px',
          flex: 1,
          minWidth: 0,
        }}>
          {/* 推荐火焰按钮 */}
          <button
            onClick={() => onSelect('benchmark')}
            title="推荐"
            style={{
              flexShrink: 0,
              width: '46px',
              height: '62px',
              borderRadius: tokens.radius.buttonSm,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              transition: 'all 0.15s',
              backgroundColor: selectedId === 'benchmark' ? '#FFF3E0' : 'transparent',
              outline: selectedId === 'benchmark' ? '2px solid #FF9800' : `1.5px solid ${tokens.color.border}`,
              outlineOffset: '0px',
            }}
          >
            <Flame
              size={20}
              style={{
                color: selectedId === 'benchmark' ? '#F57C00' : tokens.color.text.tertiary,
                fill: selectedId === 'benchmark' ? '#FFCC80' : 'none',
                transition: 'all 0.15s',
              }}
            />
            <span style={{
              fontSize: '10px',
              fontWeight: selectedId === 'benchmark' ? tokens.typography.weight.semibold : tokens.typography.weight.regular,
              color: selectedId === 'benchmark' ? '#F57C00' : tokens.color.text.tertiary,
              lineHeight: 1,
            }}>推荐</span>
          </button>

          {/* 竖分割线 */}
          <div style={{
            width: '1px',
            height: '40px',
            backgroundColor: tokens.color.divider,
            flexShrink: 0,
            alignSelf: 'center',
          }} />

          {/* 关注高校头像横向滚动区 */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '2px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            flex: 1,
            minWidth: 0,
            padding: '0 2px',
          }}>
            {FOLLOWED_SCHOOLS.map(school => (
              <AvatarBtn
                key={school.id}
                {...school}
                selected={selectedId === school.id}
                onClick={() => onSelect(school.id)}
              />
            ))}
            {/* 添加关注 */}
            <button
              title="添加关注高校"
              style={{
                flexShrink: 0,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: `1.5px dashed ${tokens.color.border}`,
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 300,
                color: tokens.color.text.tertiary,
                opacity: 0.5,
                transition: 'opacity 0.15s',
                marginBottom: '18px',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.5' }}
            >
              +
            </button>
          </div>
        </div>

        {/* 右侧：本校账号头像（仅在有账号时显示） */}
        {ourSchools.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '2px',
          flexShrink: 0,
        }}>
          {/* 竖分割线 */}
          <div style={{
            width: '1px',
            height: '40px',
            backgroundColor: tokens.color.divider,
            marginRight: '4px',
            alignSelf: 'center',
          }} />
          {ourSchools.map(school => (
            <AvatarBtn
              key={school.id}
              {...school}
              selected={selectedId === school.id}
              onClick={() => onSelect(school.id)}
            />
          ))}
        </div>
        )}
      </div>
      <Divider style={{ marginTop: '16px' }} />
    </div>
  )
}

// ── 主场域 ─────────────────────────────────────────────────────
type Step = 'idle' | 'scoring' | 'scored' | 'generating' | 'done'

export default function InsightScene() {
  // 统一用 selectedId 驱动：'benchmark' | school-id
  const [selectedId, setSelectedId] = useState<string>('benchmark')

  const [topicIdea, setTopicIdea] = useState('')
  const [step, setStep] = useState<Step>('idle')
  const [scoreData, setScoreData] = useState<Record<string, unknown> | null>(null)
  const [titles, setTitles] = useState<unknown[]>([])
  const [error, setError] = useState('')

  const [showAIModal, setShowAIModal] = useState(false)
  const [aiModalPrompt, setAIModalPrompt] = useState('')
  const [aiModalDisplay, setAIModalDisplay] = useState('')

  // 当前学校上下文
  const { currentSchool } = useScene()

  // 本校账号：无学校时为空；有学校时取该学校的账号
  const ourSchools = useMemo(() => {
    if (!currentSchool) return []
    return currentSchool.accounts.map(account => {
        const schoolInfo = SCHOOLS[account.schoolKey]
        if (!schoolInfo) return null
        return {
          id: account.id,
          name: schoolInfo.name,
          shortName: schoolInfo.shortName,
          logo: schoolInfo.logo,
        }
      }).filter(Boolean) as { id: string; name: string; shortName: string; logo: string }[]
  }, [currentSchool])

  // 本校文章 Map：无学校时为空
  const ourSchoolArticlesMap = useMemo<Record<string, ArticleCard[]>>(() => {
    if (!currentSchool) return {}
    const map: Record<string, ArticleCard[]> = {}
    for (const account of currentSchool.accounts) {
      const schoolArticleData = OUR_SCHOOL_ARTICLES.find(s => s.school === account.schoolKey)
      map[account.id] = schoolArticleData?.articles.map(a => ({
        id: a.id, cover: a.cover, title: a.title, publishTime: a.date, views: a.views, likes: a.likes, url: a.url,
      })) || []
    }
    return map
  }, [currentSchool])

  const ourIds = useMemo(() => new Set(ourSchools.map(s => s.id)), [ourSchools])

  function openInsightModal(refSchool: string, refTitle: string) {
    setAIModalPrompt(buildInsightReferencePrompt(refSchool, refTitle, currentSchool))
    setAIModalDisplay(`参考「${refSchool}」· ${refTitle.slice(0, 15)}${refTitle.length > 15 ? '…' : ''}`)
    setShowAIModal(true)
  }

  // AI分析缓存 — 触发一次批量请求，结果缓存7天
  const [analysisCache, setAnalysisCache] = useState<Map<string, string[]>>(
    () => new Map(articleAnalysisCache.entries())
  )

  useEffect(() => {
    const allArticles = [
      ...BENCHMARK_ARTICLES.flatMap(s => s.articles.map(a => ({ id: `bench:${a.id}`, title: a.title, views: a.views, likes: a.likes }))),
      ...FOLLOWED_SCHOOLS_ARTICLES.flatMap(s => s.articles.map(a => ({ id: `followed:${a.id}`, title: a.title, views: a.views, likes: a.likes }))),
      ...OUR_SCHOOL_ARTICLES.flatMap(s => s.articles.map(a => ({ id: `our:${a.id}`, title: a.title, views: a.views, likes: a.likes }))),
    ]
    articleAnalysisCache.load(allArticles).then(() => {
      setAnalysisCache(new Map(articleAnalysisCache.entries()))
    })
  }, [])

  const showSidebar = step === 'scored' || step === 'generating' || step === 'done'

  const getCurrentArticles = (): ArticleCard[] => {
    if (FOLLOWED_IDS.has(selectedId)) return FOLLOWED_ARTICLES_MAP[selectedId] || []
    if (ourIds.has(selectedId)) return ourSchoolArticlesMap[selectedId] || []
    return []
  }

  const isBenchmark = selectedId === 'benchmark'
  const isFollowed = FOLLOWED_IDS.has(selectedId)
  const isOurSchool = ourIds.has(selectedId)

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-8" style={{ paddingLeft: '80px', paddingRight: '80px' }}>
        <div className={`flex gap-6 items-start ${showSidebar ? '' : 'justify-center'}`}>

          <main className="space-y-6 min-w-0 flex-1">
            <section>
              <div
                className="bg-white rounded-xl border p-6"
                style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}
              >
                <BenchmarkNav selectedId={selectedId} onSelect={setSelectedId} ourSchools={ourSchools} />

                <div className="mt-6">
                  {/* 标杆案例 */}
                  {isBenchmark && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {BENCHMARK_ARTICLES.map((schoolData) => (
                        <SchoolBenchmark
                          key={schoolData.school}
                          school={schoolData.school}
                          logo={SCHOOLS[schoolData.school as keyof typeof SCHOOLS]?.logo || ''}
                          articles={schoolData.articles}
                          analysisCache={new Map(schoolData.articles.map(a => [a.id, analysisCache.get(`bench:${a.id}`) ?? []]))}
                          onGenerateIdea={(title) => {
                            openInsightModal(schoolData.school, title)
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* 关注高校 or 本校账号 */}
                  {(isFollowed || isOurSchool) && (() => {
                    const articles = getCurrentArticles()
                    const prefix = isFollowed ? 'followed' : 'our'
                    const prefixedCache = new Map(articles.map(a => [a.id, analysisCache.get(`${prefix}:${a.id}`) ?? []]))
                    const schoolName = isFollowed
                      ? (FOLLOWED_SCHOOLS.find(s => s.id === selectedId)?.name ?? selectedId)
                      : (ourSchools.find(s => s.id === selectedId)?.name ?? selectedId)
                    return (
                      <ArticleWaterfall
                        articles={articles}
                        showHighViewsTag={true}
                        analysisCache={prefixedCache}
                        onGenerateIdea={(title) => {
                          openInsightModal(schoolName, title)
                        }}
                      />
                    )
                  })()}
                </div>
              </div>
            </section>

            <div className="h-12" />
          </main>

          {showSidebar && (
            <aside className="w-64 flex-shrink-0 sticky top-20">
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: 'var(--foreground-tertiary)' }}
              >
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

      <AIGenerateModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        initialPrompt={aiModalPrompt}
        displayTopic={aiModalDisplay}
      />
    </div>
  )
}
