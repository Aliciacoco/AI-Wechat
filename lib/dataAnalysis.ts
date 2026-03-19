import fs from 'fs'
import path from 'path'

export interface Article {
  accountId: string
  title: string
  publishDate: string
  readCount: number
  likeCount: number
}

export interface AccountProfile {
  id: string
  school: string
  name: string
  shortName: string
  type: string
  role: string
  positioning: {
    oneLiner: string
    primaryAudience: string[]
    secondaryAudience?: string[]
    coreKPI: string[]
    contentMission: string
  }
  contentDNA: {
    toneKeywords: string[]
    forbiddenStyle?: string[]
    mustHaveElements?: string[]
    signatureContent: string[]
  }
  brandAssets?: {
    landmarks: string[]
    culturalSymbols: string[]
    mascots: string[]
    brandColors: string[]
  }
  historicalInsights: {
    avgReadCount: number
    topContentTypes: string[]
    bestPublishTime?: string
    allTimeHigh: {
      title: string
      readCount: number
      date: string
      category: string
    }
    note?: string
  }
}

function dataPath(...parts: string[]) {
  return path.join(process.cwd(), 'data', ...parts)
}

function readJSON<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

export function loadAccount(accountId: string): AccountProfile {
  return readJSON<AccountProfile>(dataPath('accounts', `${accountId}.json`))
}

export function loadArticles(accountId: string): Article[] {
  const filePath = dataPath('articles', `${accountId}.json`)
  if (!fs.existsSync(filePath)) return []
  return readJSON<Article[]>(filePath)
}

export function loadAllAccounts(): AccountProfile[] {
  const ids = ['njnu-main', 'njnu-admissions', 'ecnu-main', 'ecnu-admissions']
  return ids.map(id => loadAccount(id))
}

// 按内容类型分类标题关键词
const CONTENT_TYPE_PATTERNS: Record<string, RegExp[]> = {
  '情感共鸣': [/浪漫|故事|青春|告别|再见|那年|记忆|心语|美好|遗憾|情|光|梦/],
  '荣耀展示': [/Nature|第一|全国|祝贺|获奖|入选|奖|冠军|最好|第.*名|榜|ESI/],
  '实用信息': [/指南|攻略|通知|须知|查收|公告|简章|分数|计划|日历|壁纸|月历/],
  '校园生活': [/食堂|宿舍|期末|开学|打卡|地标|校园|美食|运动|社团/],
  '人物故事': [/：|他|她|这位|这个|的故事|的路|从.*到/],
  '互动福利': [/红包|封面|表情包|福利|送你|互动|上新|月历|壁纸/],
  '招生信息': [/招生|报考|录取|志愿|分数线|简章|高考|综评|强基|专项/],
}

export function classifyTitle(title: string): string {
  for (const [type, patterns] of Object.entries(CONTENT_TYPE_PATTERNS)) {
    if (patterns.some(p => p.test(title))) return type
  }
  return '其他'
}

export interface InsightData {
  topByType: { type: string; count: number; avgRead: number }[]
  topArticles: Article[]
  readDistribution: { range: string; count: number }[]
  monthlyTrend: { month: string; avgRead: number; count: number }[]
  bestTimeHint: string
  totalArticles: number
  avgReadCount: number
  competitorInsight?: string
}

export function analyzeArticles(articles: Article[], competitorArticles?: Article[]): InsightData {
  if (articles.length === 0) {
    return {
      topByType: [], topArticles: [], readDistribution: [],
      monthlyTrend: [], bestTimeHint: '', totalArticles: 0, avgReadCount: 0
    }
  }

  // 按类型聚合
  const typeMap: Record<string, { total: number; count: number }> = {}
  articles.forEach(a => {
    const t = classifyTitle(a.title)
    if (!typeMap[t]) typeMap[t] = { total: 0, count: 0 }
    typeMap[t].total += a.readCount
    typeMap[t].count++
  })
  const topByType = Object.entries(typeMap)
    .map(([type, v]) => ({ type, count: v.count, avgRead: Math.round(v.total / v.count) }))
    .sort((a, b) => b.avgRead - a.avgRead)
    .slice(0, 5)

  // Top 文章
  const topArticles = [...articles]
    .sort((a, b) => b.readCount - a.readCount)
    .slice(0, 10)

  // 阅读量分布
  const ranges = [
    { range: '10万+', min: 100000, max: Infinity },
    { range: '5-10万', min: 50000, max: 100000 },
    { range: '2-5万', min: 20000, max: 50000 },
    { range: '1-2万', min: 10000, max: 20000 },
    { range: '5千-1万', min: 5000, max: 10000 },
    { range: '5千以下', min: 0, max: 5000 },
  ]
  const readDistribution = ranges.map(r => ({
    range: r.range,
    count: articles.filter(a => a.readCount >= r.min && a.readCount < r.max).length
  }))

  // 月度趋势
  const monthMap: Record<string, { total: number; count: number }> = {}
  articles.forEach(a => {
    const m = a.publishDate.slice(0, 7)
    if (!monthMap[m]) monthMap[m] = { total: 0, count: 0 }
    monthMap[m].total += a.readCount
    monthMap[m].count++
  })
  const monthlyTrend = Object.entries(monthMap)
    .map(([month, v]) => ({ month, avgRead: Math.round(v.total / v.count), count: v.count }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12)

  const avgReadCount = Math.round(articles.reduce((s, a) => s + a.readCount, 0) / articles.length)

  // 竞品洞察
  let competitorInsight: string | undefined
  if (competitorArticles && competitorArticles.length > 0) {
    const compAvg = Math.round(
      competitorArticles.reduce((s, a) => s + a.readCount, 0) / competitorArticles.length
    )
    const compTop = [...competitorArticles].sort((a, b) => b.readCount - a.readCount)[0]
    competitorInsight = `竞品平均阅读 ${compAvg.toLocaleString()}，最高单篇「${compTop.title}」达 ${compTop.readCount.toLocaleString()}`
  }

  return {
    topByType, topArticles, readDistribution, monthlyTrend,
    bestTimeHint: '根据历史数据：情感类文章周五晚8点发布效果最佳，实用信息类工作日早上7-8点更优',
    totalArticles: articles.length,
    avgReadCount,
    competitorInsight,
  }
}

// 获取 Top N 标题（给 Prompt 参考）
export function getTopTitles(articles: Article[], n = 30): string[] {
  return [...articles]
    .sort((a, b) => b.readCount - a.readCount)
    .slice(0, n)
    .map(a => `「${a.title}」(${(a.readCount / 10000).toFixed(1)}万)`)
}

// ─── 竞品对标相关 ──────────────────────────────────────────

export interface BenchmarkArticle {
  accountId: string
  school: string
  title: string
  publishDate: string
  readCount: number
  likeCount: number
  matchScore: number   // 与选题的关键词重合度（0-100）
}

/** 从文本中提取二元/三元关键词组 */
function extractKeywords(text: string): string[] {
  const clean = text.replace(/[，。！？、：；""''【】（）\s\r\n]/g, '')
  const grams = new Set<string>()
  for (let i = 0; i < clean.length - 1; i++) {
    grams.add(clean.slice(i, i + 2))
    if (i < clean.length - 2) grams.add(clean.slice(i, i + 3))
  }
  return [...grams]
}

/** 计算一条标题与关键词列表的重合分数（0-100） */
function scoreMatch(title: string, keywords: string[]): number {
  if (keywords.length === 0) return 0
  const hits = keywords.filter(k => title.includes(k)).length
  return Math.round((hits / Math.min(keywords.length, 20)) * 100)
}

/** 获取竞品账号 ID */
export function getCompetitorId(accountId: string): string {
  if (accountId === 'njnu-main') return 'ecnu-main'
  if (accountId === 'njnu-admissions') return 'ecnu-admissions'
  if (accountId === 'ecnu-main') return 'njnu-main'
  if (accountId === 'ecnu-admissions') return 'njnu-admissions'
  return 'ecnu-main'
}

/** 获取账号对应学校名 */
export function getSchoolName(accountId: string): string {
  const map: Record<string, string> = {
    'njnu-main': '南京师范大学',
    'njnu-admissions': '南京师范大学（招生）',
    'ecnu-main': '华东师范大学',
    'ecnu-admissions': '华东师范大学（招生）',
  }
  return map[accountId] || accountId
}

/**
 * 在 articles 中找与 idea 最相关的爆款文章
 * 策略：先按关键词重合度过滤，取 matchScore > 0 的按 readCount 排序；
 *       不够 n 条时，用阅读量最高的文章补齐（matchScore=0 标记为「泛参照」）
 */
export function findSimilarArticles(
  idea: string,
  articles: Article[],
  school: string,
  n = 5
): BenchmarkArticle[] {
  const keywords = extractKeywords(idea)

  const withScore: BenchmarkArticle[] = articles.map(a => ({
    ...a,
    school,
    matchScore: scoreMatch(a.title, keywords),
  }))

  // 有关联的文章，按 readCount 倒序
  const matched = withScore
    .filter(a => a.matchScore > 0)
    .sort((a, b) => b.readCount - a.readCount)
    .slice(0, n)

  if (matched.length >= n) return matched

  // 补齐：从未参与的高阅读文章里填充
  const matchedTitles = new Set(matched.map(a => a.title))
  const fallback = withScore
    .filter(a => !matchedTitles.has(a.title))
    .sort((a, b) => b.readCount - a.readCount)
    .slice(0, n - matched.length)

  return [...matched, ...fallback]
}
