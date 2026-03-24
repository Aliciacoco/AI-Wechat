/**
 * AI 灵感生成 —— 各入口提示词构建函数
 * 所有函数返回发给 DeepSeek 的完整用户消息文本
 */

import { TOPIC_STRATEGY_PROMPT_TEXT } from './prompts'
import type { CalendarNode } from '@/data/njnu-calendar'

const DEFAULT_SCHOOL = '南京师范大学（南师大）'

function getToday(): string {
  return new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

// ── 工具：附加最高规范 ──────────────────────────────────────────
function withFramework(body: string): string {
  return `${body}

---

请严格遵循以下【选题最高规范】进行创作：

${TOPIC_STRATEGY_PROMPT_TEXT}`
}

// ── 1. 全网热点 ─────────────────────────────────────────────────
interface HotTopic {
  title: string
  source?: string
  tags?: string[]
  heat?: number
}

export function buildHotTopicPrompt(hot: HotTopic, school = DEFAULT_SCHOOL): string {
  const today = getToday()
  const tags = hot.tags?.length ? `标签：${hot.tags.join('、')}` : ''
  const source = hot.source ? `来源平台：${hot.source}` : ''
  const heat = hot.heat != null ? `热度指数：${hot.heat}` : ''

  const body = `我是【${school}】官方微信公众号的内容编辑，当前日期：${today}。

全网正在热传一条内容，信息如下：
热点标题：「${hot.title}」
${source}
${tags}
${heat}

请借势这个热点，为【${school}】生成 3-5 个具体的选题方案。
要求：
1. 必须站在【${school}】的视角，写【${school}】自己的内容
2. 选题标题中只能出现本校相关词，不得出现其他学校名称
3. 结合热点背后的情绪/话题，找到与校园场景的自然关联点
4. 每个方案包含：标题、核心切入角度、目标受众、预期共鸣点`

  return withFramework(body)
}

// ── 2. 节点日历 ──────────────────────────────────────────────────
export function buildCalendarNodePrompt(node: CalendarNode, school = DEFAULT_SCHOOL): string {
  const today = getToday()
  const daysInfo = node.daysLeft != null ? `（距今约 ${node.daysLeft} 天）` : ''
  const topicsHint = node.topics.length
    ? `\n可参考的选题方向（仅供启发，不必照搬）：\n${node.topics.map(t => `- ${t}`).join('\n')}`
    : ''

  const body = `我是【${school}】官方微信公众号的内容编辑，当前日期：${today}。

即将到来的重要节点信息如下：
节点名称：「${node.title}」
节点日期：${node.date}${daysInfo}
节点类型：${nodeTypeLabel(node.type)}
节点说明：${node.description}
${topicsHint}

请结合这个节点，为【${school}】生成 3-5 个具体的选题方案。
要求：
1. 必须站在【${school}】的视角，写【${school}】自己的内容
2. 紧扣节点的时间感和情感意义，避免通稿式套话
3. 每个方案包含：标题、核心切入角度、目标受众、预期共鸣点`

  return withFramework(body)
}

function nodeTypeLabel(type: string): string {
  const map: Record<string, string> = {
    festival: '传统节日/法定假日',
    school: '学校专属事件',
    season: '节气/季节性内容',
    recruit: '高招招生节点',
    youth: '青年文化/学子活动',
  }
  return map[type] ?? type
}

// ── 3. 内容平衡 ──────────────────────────────────────────────────
interface ContentType {
  name: string
  current: number      // 当前占比 %
  recommended: number  // 推荐占比 %
}

interface ContentBalanceItem {
  name: string         // 账号名
  contentTypes: ContentType[]
  recommendation: string  // 最缺口类型说明
}

export function buildContentBalancePrompt(account: ContentBalanceItem, school = DEFAULT_SCHOOL): string {
  const today = getToday()
  const deficit = account.contentTypes
    .map(c => ({ ...c, gap: c.recommended - c.current }))
    .sort((a, b) => b.gap - a.gap)

  const deficitLines = deficit
    .map(c => `- ${c.name}：当前 ${c.current}%，推荐 ${c.recommended}%，${c.gap > 0 ? `缺口 +${c.gap}%` : `过剩 ${c.gap}%`}`)
    .join('\n')

  const body = `我是【${school}】「${account.name}」官方微信公众号的内容编辑，当前日期：${today}。

当前账号内容类型占比分析：
${deficitLines}

内容平衡建议：${account.recommendation}

请针对内容缺口最大的类型，为【${school}】「${account.name}」生成 3-5 个具体的选题方案，帮助补足内容结构短板。
要求：
1. 优先围绕「${account.recommendation}」方向展开
2. 必须站在【${school}】的视角，结合本校特色
3. 每个方案包含：标题、核心切入角度、目标受众、预期共鸣点`

  return withFramework(body)
}

// ── 4. 今日最推荐 ────────────────────────────────────────────────
export function buildTodayRecommendPrompt(
  upcomingNodes: CalendarNode[],
  contentBalances: ContentBalanceItem[],
  school = DEFAULT_SCHOOL
): string {
  const today = getToday()
  const nodesText = upcomingNodes.slice(0, 3).length
    ? upcomingNodes.slice(0, 3).map(n =>
        `- 「${n.title}」（${n.date}，距今约 ${n.daysLeft ?? '?'} 天）：${n.description}`
      ).join('\n')
    : '（暂无近期节点）'

  const balanceText = contentBalances.map(acc => {
    const top = [...acc.contentTypes].sort((a, b) => (b.recommended - b.current) - (a.recommended - a.current))[0]
    return `- 「${acc.name}」最缺：${top?.name}（当前 ${top?.current}%，推荐 ${top?.recommended}%）`
  }).join('\n')

  const body = `我是【${school}】官方微信公众号的内容编辑，今天是 ${today}。

请综合以下信息，为我推荐今日最值得策划的选题方向，并给出 3-5 个具体方案：

【近期重要节点】
${nodesText}

【内容结构缺口】
${balanceText}

要求：
1. 优先选择时效性最强、情感共鸣最大的方向
2. 结合内容缺口，补足账号内容结构
3. 必须站在【${school}】的视角，写【${school}】自己的内容
4. 每个方案包含：标题、核心切入角度、目标受众、推荐理由`

  return withFramework(body)
}

// ── 5. 洞察场域 —— 参考他校文章 ────────────────────────────────
export function buildInsightReferencePrompt(
  refSchool: string,
  refTitle: string,
  school = DEFAULT_SCHOOL
): string {
  const today = getToday()
  const body = `我是【${school}】官方微信公众号的内容编辑，当前日期：${today}。

我在竞品分析中注意到一篇优秀文章，希望学习其选题思路：
参考学校：${refSchool}
参考标题：「${refTitle}」

请仅学习这篇文章的【选题角度、内容形式、情感切入方式】，
以【${school}】的视角，生成 3-5 个【${school}】自己的选题方案。

严格要求：
1. 所有标题和内容只能出现"南师大"、"南师"、"随园"等本校相关词
2. 绝对不能出现「${refSchool}」或其他任何学校名称
3. 每个方案包含：标题、核心切入角度、目标受众、与参考文章的差异化点`

  return withFramework(body)
}

// ── 6. 搜索框直接搜索 ────────────────────────────────────────────
export function buildSearchPrompt(query: string, school = DEFAULT_SCHOOL): string {
  const today = getToday()
  const body = `我是【${school}】官方微信公众号的内容编辑，当前日期：${today}。

我正在围绕以下主题/关键词策划选题：
「${query}」

请为【${school}】生成 3-5 个具体的选题方案。
要求：
1. 必须站在【${school}】的视角，写【${school}】自己的内容
2. 标题中只能出现本校相关词，不得出现其他学校名称
3. 每个方案包含：标题、核心切入角度、目标受众、预期共鸣点`

  return withFramework(body)
}
