'use client'

import { Eye, ThumbsUp, Sparkles } from 'lucide-react'
import { useState, useRef } from 'react'
import { Card } from '@/components/ui'
import { tokens } from '@/lib/design-tokens'

export interface ArticleCard {
  id: string
  cover: string
  title: string
  publishTime: string
  views: number
  likes: number
  url: string
  school?: string
  showHighViews?: boolean
}

interface ArticleWaterfallProps {
  articles: ArticleCard[]
  loading?: boolean
  showHighViewsTag?: boolean
  onGenerateIdea?: (title: string) => void
  analysisCache?: Map<string, string[]>
}

function formatNumber(num: number): string {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

// Fallback static analysis (used only if AI cache is empty)
function getStaticReasons(article: ArticleCard): string[] {
  const reasons: string[] = []
  const t = article.title
  const likeRate = article.views > 0 ? article.likes / article.views : 0

  if (/招生简章|招生政策|录取|招生计划/.test(t)) {
    reasons.push('招生简章是高考季的刚需，考生和家长主动搜索，不推自来')
    reasons.push('这类内容靠信息价值带量，跟标题写不写得好没太大关系')
  }
  if (/分数线|复试线|成绩|调剂/.test(t))
    reasons.push('分数线是考研党最焦虑那几天必须看的，传播几乎是被动的')
  if (/招聘|就业|岗位|求职/.test(t)) {
    reasons.push('就业信息是在校生的真实痛点，有用的会主动转给同学')
    reasons.push('大四、研究生有强烈的信息获取动机，这类选题传播效率高')
  }
  if (/专业|学科|王牌|优势专业/.test(t)) {
    reasons.push('专业介绍是考生填志愿前的必读，高考季流量稳定')
    reasons.push('在校生也爱转自己专业的内容，有自发传播动力')
  }
  if (/榜样|十佳|风采|评选|获奖|表彰/.test(t)) {
    reasons.push('荣誉评选类内容，被提名者主动转发，带来第一波真实流量')
    reasons.push('同龄人的故事比官方成就报道更容易扩散，共鸣感强')
  }
  if (/周年|生日|校庆|纪念|诞辰/.test(t)) {
    reasons.push('周年纪念是校友的情感节点，离校越久的人反而越容易被触动')
    reasons.push('天然覆盖在校生、毕业生、家长三类群体，受众面宽')
  }
  if (/玉兰|梅|银杏|樱花|风景|美景|春日|秋日/.test(t)) {
    reasons.push('校园景色不需要强迫读者，看到好看的本能就发朋友圈')
    reasons.push('节气+景色是高校公号的经典公式，情绪价值高，传播成本低')
  }
  if (/考研|硕士|研究生/.test(t))
    reasons.push('考研信息辐射全国备考群体，不只是本校学生，自然搜索流量大')
  if (/故事|她|他|这位|校友/.test(t))
    reasons.push('人物选题精准触发代入感，读者转发是因为被打动，不是因为学校牛')
  if (/短剧|上新/.test(t))
    reasons.push('"短剧"形式本身带好奇心，粉丝会当种草内容转给外校朋友')

  if (reasons.length < 2) {
    if (article.views >= 30000) reasons.push(`${(article.views / 10000).toFixed(0)}w+ 阅读说明选题破出了本校粉丝圈`)
    else reasons.push('破万说明选题方向对了，覆盖到了主动搜索的外部流量')
  }
  if (likeRate >= 0.04 && reasons.length < 4)
    reasons.push('点赞率高，读者不只是路过，真的觉得有共鸣或有用')

  const fallbacks = [
    '选题切入的是读者生活里正在发生的事',
    '发布时间节点准，流量自然来',
  ]
  while (reasons.length < 3) {
    const fb = fallbacks.shift()
    if (fb) reasons.push(fb)
    else break
  }
  return reasons.slice(0, 4)
}

// Derive a short label (≤6 chars) that describes the topic formula
function getTagLabel(article: ArticleCard, cachedReasons?: string[] | null): string {
  const t = article.title
  // Priority: use first cached reason's key phrase if available
  if (cachedReasons?.length) {
    const first = cachedReasons[0]
    if (/招生简章|招生政策|录取/.test(first)) return '招生刚需'
    if (/分数线|复试/.test(first)) return '分数刚需'
    if (/招聘|就业/.test(first)) return '就业焦虑'
    if (/专业|学科/.test(first)) return '专业种草'
    if (/榜样|评选|表彰/.test(first)) return '荣誉传播'
    if (/周年|校庆|纪念/.test(first)) return '情感节点'
    if (/景色|朋友圈|节气/.test(first)) return '景色出圈'
    if (/考研|硕士/.test(first)) return '考研焦虑'
    if (/短剧|形式/.test(first)) return '形式创新'
    if (/故事|代入/.test(first)) return '人物故事'
  }
  // Fallback: infer from title
  if (/招生简章|招生政策|录取/.test(t)) return '招生刚需'
  if (/分数线|复试/.test(t)) return '分数刚需'
  if (/招聘|就业|岗位/.test(t)) return '就业焦虑'
  if (/专业|学科|王牌/.test(t)) return '专业种草'
  if (/榜样|十佳|风采|评选/.test(t)) return '荣誉传播'
  if (/周年|生日|校庆|纪念/.test(t)) return '情感节点'
  if (/玉兰|梅|银杏|樱花|美景|春日/.test(t)) return '景色出圈'
  if (/考研|硕士|研究生/.test(t)) return '考研焦虑'
  if (/短剧|上新/.test(t)) return '形式创新'
  if (/故事|她|他|校友/.test(t)) return '人物故事'
  if (article.views >= 50000) return '破圈爆款'
  return '选题踩准'
}

interface AnalysisTagProps {
  article: ArticleCard
  onGenerateIdea?: (title: string) => void
  cachedReasons?: string[] | null
}

function AnalysisTag({ article, onGenerateIdea, cachedReasons }: AnalysisTagProps) {
  const [visible, setVisible] = useState(false)
  const reasons = cachedReasons?.length ? cachedReasons : getStaticReasons(article)
  const label = getTagLabel(article, cachedReasons)

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '3px',
        padding: '2px 7px',
        borderRadius: tokens.radius.button,
        backgroundColor: '#FFF3E0',
        border: '1px solid #FFD180',
        color: '#E65100',
        fontSize: '11px',
        fontWeight: tokens.typography.weight.semibold,
        cursor: 'default',
        userSelect: 'none',
      }}>
        {label}
      </div>

      {visible && (
        <>
          {/* 透明桥接层，填充标签和弹窗之间的间隙，防止鼠标移动时触发 onMouseLeave */}
          <div style={{
            position: 'absolute',
            bottom: '100%',
            right: 0,
            width: '100%',
            height: '8px',
          }} />
          <div
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              right: 0,
              width: '230px',
              backgroundColor: tokens.color.base.white,
              border: `1px solid ${tokens.color.border}`,
              borderRadius: tokens.radius.buttonSm,
              boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
              padding: '12px',
              zIndex: 100,
              fontFamily: tokens.typography.fontFamily.zh,
            }}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
          >
          <p style={{ fontSize: '11px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.tertiary, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            为什么这篇能破万
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {reasons.map((r, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12px', color: tokens.color.text.secondary, lineHeight: 1.5 }}>
                <span style={{ color: '#F57C00', flexShrink: 0, fontWeight: tokens.typography.weight.semibold }}>·</span>
                {r}
              </li>
            ))}
          </ul>
          {onGenerateIdea && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onGenerateIdea(article.title)
              }}
              style={{
                marginTop: '10px',
                width: '100%',
                height: '28px',
                borderRadius: tokens.radius.button,
                border: 'none',
                backgroundColor: tokens.color.accent,
                color: tokens.color.base.white,
                fontSize: '12px',
                fontWeight: tokens.typography.weight.medium,
                fontFamily: tokens.typography.fontFamily.zh,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0062C4' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = tokens.color.accent }}
            >
              <Sparkles size={11} />
              参考生成选题
            </button>
          )}
        </div>
        </>
      )}
    </div>
  )
}

export default function ArticleWaterfall({
  articles,
  loading = false,
  showHighViewsTag = false,
  onGenerateIdea,
  analysisCache,
}: ArticleWaterfallProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} style={{ padding: '14px', display: 'flex', gap: '12px' }}>
            <div className="animate-pulse flex gap-3 w-full">
              <div style={{ flex: 1 }} className="space-y-2">
                <div className="h-4 rounded-lg w-3/4" style={{ backgroundColor: tokens.color.base.gray }} />
                <div className="h-3 rounded-lg w-1/2" style={{ backgroundColor: tokens.color.base.gray }} />
                <div className="h-3 rounded-lg w-1/3" style={{ backgroundColor: tokens.color.base.gray }} />
              </div>
              <div style={{ width: '112px', height: '80px', borderRadius: tokens.radius.buttonSm, backgroundColor: tokens.color.base.gray, flexShrink: 0 }} />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <Card style={{ padding: '48px 32px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: tokens.color.text.tertiary }}>暂无数据</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {articles.map((article) => {
        const hasHighViews = showHighViewsTag && article.views >= 10000
        return (
          <div key={article.id} style={{ position: 'relative' }}>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', textDecoration: 'none' }}
            >
              <Card style={{ padding: '14px', display: 'flex', gap: '12px', transition: 'box-shadow 0.15s' }} shadow>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                  <p className="line-clamp-2" style={{ fontSize: '14px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.primary, lineHeight: 1.5, marginBottom: '8px' }}>
                    {article.title}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: tokens.color.text.tertiary }}>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: '3px',
                      color: article.views >= 10000 ? '#F57C00' : tokens.color.text.tertiary,
                      fontWeight: article.views >= 10000 ? tokens.typography.weight.semibold : tokens.typography.weight.regular,
                    }}><Eye size={11} />{formatNumber(article.views)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><ThumbsUp size={11} />{formatNumber(article.likes)}</span>
                    <span>{article.publishTime}</span>
                    {hasHighViews && (
                      <div onClick={(e) => e.preventDefault()}>
                        <AnalysisTag
                          article={article}
                          onGenerateIdea={onGenerateIdea}
                          cachedReasons={analysisCache?.get(article.id)}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ width: '112px', height: '80px', flexShrink: 0, overflow: 'hidden', borderRadius: tokens.radius.buttonSm, backgroundColor: tokens.color.base.gray }}>
                  <img src={article.cover} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </Card>
            </a>
          </div>
        )
      })}
    </div>
  )
}
