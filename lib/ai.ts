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
  // 获取相关的校本知识库内容
  const relevantKnowledge = getRelevantKnowledge(topic)
  const knowledgePrompt = formatKnowledgeForPrompt(relevantKnowledge)

  const systemPrompt = `你是南师大新媒体编辑。生成 4 个标题，JSON格式，无其他文字。

${knowledgePrompt}

格式：
[{"title":"标题","style":"类型","description":"简述","audience":"受众"}]

类型：情感共鸣型/荣耀触发型/悬念好奇型/信息实用型

要求：
1. 标题必须基于【校本资料库】的真实数据，引用具体荣誉、数据、特色
2. 确保信息准确性，不要编造不存在的内容
3. 可以引用具体排名、获奖、就业数据等`

  const userPrompt = `主题：${topic}`

  const response = await chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]) // 使用默认模型

  try {
    // 尝试从返回内容中提取 JSON
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const titles = JSON.parse(jsonMatch[0])
      // 添加唯一 ID
      return titles.map((title: any, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        ...title,
      }))
    }
  } catch (e) {
    console.error('Failed to parse AI response:', e)
  }

  throw new Error('Failed to parse titles from KIMI response')
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
 * 生成推荐主题
 */
export async function generateRecommendation(accountId: string, accountName: string): Promise<any> {
  // 加载校本知识库用于推荐参考
  const relevantKnowledge = getRelevantKnowledge('推荐主题')
  const knowledgePrompt = formatKnowledgeForPrompt(relevantKnowledge)

  const systemPrompt = `你是南京师范大学新媒体运营专家，负责为「${accountName}」公众号推荐选题。

${knowledgePrompt}

你需要根据以下信息生成一个推荐主题：
1. 当前时间节点（春季、招生季等）
2. 学校近期动态和热点
3. 用户关注点和互动偏好
4. 内容平衡性（避免重复类型）
5. 【重要】结合校本资料库的真实数据和特色

返回严格的 JSON 格式，不要有任何其他文字：
{
  "theme": "主题标题（格式：分类｜具体主题）",
  "description": "推荐理由（30字以内，可引用具体数据）",
  "weight": 权重值（5-10之间的整数）
}

示例：
{
  "theme": "春招季｜南师学子就业力",
  "description": "结合校历和就业数据，展现就业竞争力",
  "weight": 10
}`

  const userPrompt = `为公众号「${accountName}」生成一个新的推荐主题`

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
