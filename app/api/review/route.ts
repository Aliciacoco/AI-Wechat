import { NextRequest, NextResponse } from 'next/server'
import { chat } from '@/lib/ai'
import { NJNU_LEADERS } from '@/data/njnu-leaders'
import { SCHOOL_NAME, NJNU_DEPARTMENTS } from '@/data/njnu-names'
import { REQUIRED_TERMS, OUTDATED_TERMS } from '@/data/njnu-political-terms'

export const runtime = 'nodejs'
export const maxDuration = 60

export interface ReviewIssue {
  dimension: 'calendar' | 'leaders' | 'political' | 'names' | 'logic'
  level: 'high' | 'medium' | 'low'
  quote: string        // 原文片段
  problem: string      // 问题说明
  suggestion: string   // 建议改法
}

export interface ReviewResult {
  overallLevel: 'high' | 'medium' | 'low' | 'pass'
  issues: ReviewIssue[]
  summary: string
}

function buildKnowledgeContext(): string {
  const leaders = NJNU_LEADERS.filter(l => l.name)
  const leaderStr = leaders.length > 0
    ? leaders.map(l => `${l.title}：${l.name}`).join('、')
    : '（领导名单待补充，如文中出现领导姓名请标记为"需人工核实"）'

  const deptStr = NJNU_DEPARTMENTS.map(d => {
    const wrong = d.wrongAlias?.length ? `（常见误写：${d.wrongAlias.join('/')}）` : ''
    return `${d.official}${wrong}`
  }).join('；')

  const forbiddenNames = SCHOOL_NAME.forbidden.join('、')

  const requiredTermStr = REQUIRED_TERMS.map(t =>
    `"${t.correct}"${t.forbidden?.length ? `（禁止简称为：${t.forbidden.join('/')}）` : ''}`
  ).join('；')

  const outdatedStr = OUTDATED_TERMS.map(t =>
    `"${t.outdated}"→应改为"${t.replacedBy}"`
  ).join('；')

  return `
【南京师范大学专有知识库】

1. 学校名称规范
- 全称：${SCHOOL_NAME.full}
- 官方认可简称（使用以下简称完全正确，不得标记为任何风险）：${SCHOOL_NAME.approved.join('、')}
- 禁止使用：${forbiddenNames}

2. 现任领导名单
${leaderStr}

3. 院系官方名称（部分）
${deptStr}

4. 时政术语规范
- 必须使用全称：${requiredTermStr}
- 过时表述：${outdatedStr}
`.trim()
}

const SYSTEM_PROMPT = `你是专为高校官方公众号设计的内容审核专家，负责在推文发布前识别潜在错误和风险。

${buildKnowledgeContext()}

---

请对用户提供的推文正文进行全面审核，检查以下五个维度：

1. **校历核查（calendar）**：文中涉及的时间、节点、活动日期是否有文章内部矛盾（例如同一活动前后日期不一致）。不得根据自身知识库判断某日期"不可能"或"不合常理"，只核查文章内部是否自洽。

2. **领导信息（leaders）**：涉及校领导的姓名、职务是否与知识库中的现任名单一致，职务表述是否规范。

3. **时政术语（political）**：只检查术语的措辞写法是否符合知识库中的规范（如禁用简称、过时表述）。不得判断某个会议是否已召开、是否真实存在——这类事实判断超出审核范围，一律跳过。

4. **专有名词（names）**：校名简称、院系名称是否使用官方表述，以知识库为准。

5. **逻辑一致性（logic）**：只检查文章内部同一事物的表述是否互相矛盾（如同一人物在同一文中被称为两个不同职务、同一活动出现两个不同日期）。不得用外部常识判断某种说法"不合逻辑"——跨年度回顾、行业惯例等均视为作者有意为之，不标记。

风险等级定义：
- high（高风险）：事实性错误、政治敏感、官方名称明显错误，必须修改
- medium（中风险）：表述不规范、可能引起误解，建议修改
- low（低风险）：细节瑕疵、措辞欠佳，可酌情修改

输出要求：
- 只输出发现的真实问题，没有问题的维度不要输出
- 每个问题必须引用原文片段（quote），不超过30字
- 如果文章整体无问题，issues 返回空数组
- 严格按如下 JSON 格式输出，不要有任何额外文字：

{
  "overallLevel": "high|medium|low|pass",
  "summary": "一句话总结审核结论，20字以内",
  "issues": [
    {
      "dimension": "calendar|leaders|political|names|logic",
      "level": "high|medium|low",
      "quote": "原文片段",
      "problem": "问题说明，25字以内",
      "suggestion": "建议改法，25字以内"
    }
  ]
}`

export async function POST(request: NextRequest) {
  try {
    const { content }: { content: string } = await request.json()
    if (!content?.trim()) {
      return NextResponse.json({ success: false, error: '请提供推文正文' }, { status: 400 })
    }

    const response = await chat([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `请审核以下推文：\n\n${content}` },
    ])

    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ success: false, error: '审核结果解析失败' }, { status: 500 })
    }

    const result: ReviewResult = JSON.parse(jsonMatch[0])
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('review error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '审核失败',
    }, { status: 500 })
  }
}
