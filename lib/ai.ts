import OpenAI from 'openai'
import { getRelevantKnowledge, formatKnowledgeForPrompt } from './knowledge-base'

// 检查 DeepSeek API Key
if (!process.env.DEEPSEEK_API_KEY) {
  console.error('❌ DEEPSEEK_API_KEY is not set in environment variables')
  throw new Error('请在环境变量中配置 DEEPSEEK_API_KEY')
}

// 初始化 DeepSeek 客户端
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
  timeout: 30000, // 30秒超时
  maxRetries: 0, // 关闭自动重试，我们手动控制
})

console.log('✅ 使用 AI 提供商: DeepSeek')

/**
 * 延迟函数（用于重试等待）
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function chat(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  model?: string
): Promise<string> {
  const maxRetries = 3
  let lastError: any
  const modelToUse = model || 'deepseek-chat'

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🤖 Calling DeepSeek API (attempt ${attempt}/${maxRetries}) with model:`, modelToUse)

      const res = await client.chat.completions.create({
        model: modelToUse,
        messages,
        temperature: 0.7
      })

      console.log(`✅ DeepSeek API response received`)
      return res.choices[0]?.message?.content || ''

    } catch (error: any) {
      lastError = error
      console.error(`❌ DeepSeek API error (attempt ${attempt}/${maxRetries}):`, error)

      // 检查是否是 429 错误（速率限制）
      const is429 = error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('overload')

      if (is429 && attempt < maxRetries) {
        // 指数退避：第1次等2秒，第2次等4秒，第3次等8秒
        const waitTime = Math.pow(2, attempt) * 1000
        console.log(`⏳ Rate limit hit, waiting ${waitTime/1000}s before retry...`)
        await delay(waitTime)
        continue
      }

      // 其他错误或已达到最大重试次数，直接抛出
      if (attempt === maxRetries) {
        break
      }

      // 非 429 错误，等待1秒后重试
      console.log('⏳ Waiting 1s before retry...')
      await delay(1000)
    }
  }

  // 所有重试都失败了
  if (lastError?.status === 429 || lastError?.message?.includes('overload')) {
    throw new Error('DeepSeek API 服务器负载过高，请稍后再试（1-2分钟后）')
  }

  throw lastError
}

export async function chatStream(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  model?: string
) {
  const modelToUse = model || 'deepseek-chat'
  return client.chat.completions.create({
    model: modelToUse,
    messages,
    temperature: 0.7,
    stream: true
  })
}

/**
 * 生成标题推荐（优化版 - 减少生成数量提升速度）
 */
export async function generateTitles(topic: string, accountType: string = '主号'): Promise<any[]> {
  // 只有当 topic 包含校史/荣誉/就业/美景等关键词时才注入知识库
  const KNOWLEDGE_KEYWORDS = ['校史', '荣誉', '排名', '就业', '招聘', '专业', '院系', '美景', '校园', '建校', '周年']
  const needsKnowledge = KNOWLEDGE_KEYWORDS.some(kw => topic.includes(kw))
  const knowledgePrompt = needsKnowledge ? formatKnowledgeForPrompt(getRelevantKnowledge(topic)) : ''

  const systemPrompt = `你是一位拥有10年经验的高校新媒体首席内容官，擅长策划"现象级"校园软文。你的核心信条是：内容要么"对用户有用"，要么"让用户动心"，要么"让用户会心一笑"。

你的任务是为【南京师范大学】公众号生成 4 个候选标题，JSON 格式，无其他文字。

核心框架："动心·有用·一笑" 三维框架
每个标题必须属于以下类型之一：情感共鸣型、荣耀触发型、悬念好奇型、信息实用型

${knowledgePrompt}

格式：
[{"title":"标题（不超过20字）","style":"类型","description":"一句话说明吸引力来源","audience":"目标读者"}]

【重要规则】
1. 用户给出的主题可能来自其他学校的文章标题，仅作为选题方法论和内容形式的参考
2. 所有生成的标题必须站在南师大编辑的视角，写南师大自己的内容
3. 标题中只能出现"南师大"、"南师"、"随园"等南师大专属词，绝对不能出现其他学校名称
4. 标题要年轻化、真诚，拒绝官腔套话
5. 如有知识库内容，可引用具体数据增强可信度`

  const userPrompt = `参考来源（可能来自其他学校，仅学习其选题方式）：${topic}

请以南师大编辑的视角，生成4个南师大自己的标题。`

  const response = await chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ])

  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const titles = JSON.parse(jsonMatch[0])
      return titles.map((title: any, index: number) => ({
        id: `ai-${crypto.randomUUID()}-${index}`,
        ...title,
      }))
    }
  } catch (e) {
    console.error('Failed to parse AI response:', e)
  }

  throw new Error('Failed to parse titles from AI response')
}

/**
 * 搜索历史本校文章
 */
export async function searchHistoricalArticles(topic: string): Promise<any[]> {
  // 获取相关的校本知识库内容
  const relevantKnowledge = getRelevantKnowledge(topic)
  const knowledgePrompt = formatKnowledgeForPrompt(relevantKnowledge)

  const systemPrompt = `你是南京师范大学的内容数据库助手。用户会提供一个主题，你需要模拟返回该主题相关的历史文章数据。

${knowledgePrompt}

返回严格的 JSON 格式，不要有任何其他文字：
[
  {
    "title": "文章标题",
    "publishDate": "发布日期（如：2024年3月20日）",
    "views": 阅读量数字,
    "likes": 点赞数,
    "url": "#",
    "cover": "https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png"
  }
]

要求返回 2-3 篇相关的本校历史文章。标题要真实、数据要合理，可以基于校本资料库的真实信息生成标题。`

  const userPrompt = `搜索主题「${topic}」的南师大历史文章`

  const response = await chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ])

  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const articles = JSON.parse(jsonMatch[0])
      return articles.map((article: any, index: number) => ({
        id: `hist-${Date.now()}-${index}`,
        ...article,
      }))
    }
  } catch (e) {
    console.error('Failed to parse historical articles:', e)
  }

  throw new Error('Failed to parse historical articles from KIMI response')
}

/**
 * 搜索名校对标案例
 */
export async function searchBenchmarkCases(topic: string): Promise<any[]> {
  const systemPrompt = `你是高校新媒体行业分析师。用户会提供一个主题，你需要返回该主题下名校（北大、清华、复旦、浙大等）的优秀案例。

返回严格的 JSON 格式，不要有任何其他文字：
[
  {
    "school": "学校名称",
    "title": "文章标题",
    "publishDate": "发布时间（如：2周前、3天前）",
    "views": 阅读量,
    "likes": 点赞数,
    "url": "#",
    "cover": "https://coco-default.oss-cn-shanghai.aliyuncs.com/picture.png",
    "isPopular": true
  }
]

要求返回 3 篇名校案例，前 2 篇标记为 isPopular: true。数据要真实合理，标题要有吸引力。`

  const userPrompt = `搜索主题「${topic}」下的名校对标案例`

  const response = await chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ])

  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const cases = JSON.parse(jsonMatch[0])
      return cases.map((caseItem: any, index: number) => ({
        id: `bench-${Date.now()}-${index}`,
        ...caseItem,
      }))
    }
  } catch (e) {
    console.error('Failed to parse benchmark cases:', e)
  }

  throw new Error('Failed to parse benchmark cases from KIMI response')
}

/**
 * 根据大纲生成正文
 */
export async function generateBody(title: string, outline: string): Promise<string> {
  const systemPrompt = `你是南京师范大学的资深新媒体编辑，擅长撰写高校公众号图文内容。
请根据用户提供的文章标题和大纲，生成一篇完整的正文。

要求：
1. 语言生动，有南师大特色，贴近学生读者
2. 段落清晰，结构与大纲对应
3. 总字数 600-900 字
4. 使用口语化但不失专业的表达
5. 结尾可加互动引导语（如：你怎么看？欢迎留言分享）`

  const userPrompt = `标题：${title}

大纲：
${outline}

请生成正文。`

  return await chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ])
}
export async function generateRecommendation(accountId: string, accountName: string): Promise<any> {
  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })

  const systemPrompt = `你是一位拥有10年经验的高校新媒体首席内容官，擅长策划"现象级"校园软文。你的核心信条是：内容要么"对用户有用"，要么"让用户动心"，要么"让用户会心一笑"。

今天是 ${today}。请根据当前时间节点，从以下选题矩阵中挑选最合适的一个方向，为「${accountName}」推荐一个具体选题：

- 新闻资讯类：新闻背后的普通人故事？数据对个体命运的改变？
- 招生宣传类：第一人称体验、宿舍/食堂的隐藏玩法、学长学姐的真实独白。
- 热点借势类：影视剧台词改编、网络挑战校园版、节气/节日的情感投射。
- 实用指南类：考研/考公/求职的至暗时刻如何度过？校园生活冷知识？
- 校园故事类：保安/宿管阿姨的故事、实验室的深夜灯光、一对情侣的奋斗史。

核心框架："动心·有用·一笑" 三维框架
- 让用户动心 (Emotional Resonance)：触发集体记忆、身份认同或情感共鸣
- 对用户有用 (Practical Utility)：解决具体痛点，提供稀缺信息或生存指南
- 让用户会心一笑 (Humor & Relatability)：用自嘲、梗文化或反差萌解构严肃话题

要求：
1. 推荐的选题要结合当前时间节点（月份、季节、近期热点）
2. 选题不能总是历史、周年纪念，要多样化
3. 优先选择对在校生有实际价值的内容

返回严格的 JSON 格式，不要有任何其他文字：
{
  "theme": "主题标题（格式：分类｜具体主题，不超过15字）",
  "description": "推荐理由（30字以内）",
  "weight": 权重值（5-10之间的整数）
}`

  const userPrompt = `今天是${today}，为「${accountName}」推荐一个今日选题方向`

  const response = await chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ])

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('Failed to parse recommendation:', e)
  }

  throw new Error('Failed to parse recommendation from AI response')
}
