import OpenAI from 'openai'

const kimi = new OpenAI({
  apiKey: process.env.KIMI_API_KEY || '',
  baseURL: 'https://api.moonshot.cn/v1',
})

export async function chat(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  model: 'moonshot-v1-8k' | 'moonshot-v1-32k' = 'moonshot-v1-8k'
): Promise<string> {
  const res = await kimi.chat.completions.create({ model, messages, temperature: 0.7 })
  return res.choices[0]?.message?.content || ''
}

export async function chatStream(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  model: 'moonshot-v1-8k' | 'moonshot-v1-32k' = 'moonshot-v1-8k'
) {
  return kimi.chat.completions.create({ model, messages, temperature: 0.7, stream: true })
}

/**
 * 生成标题推荐
 */
export async function generateTitles(topic: string, accountType: string = '主号'): Promise<any[]> {
  const systemPrompt = `你是一个专业的高校新媒体运营专家，擅长为南京师范大学官方公众号撰写吸引人的标题。

要求：
1. 生成 6 个不同风格的标题
2. 每个标题要有明确的风格标签（情感流/视觉流/文化流/互动流/记录流/紧迫流）
3. 标题要结合南师大特色（随园、师大文化等）
4. 每个标题附带简短描述和目标受众
5. 必须返回严格的 JSON 格式数组，不要有任何其他文字

格式示例：
[
  {
    "title": "标题内容",
    "style": "情感流",
    "description": "简短描述",
    "audience": "目标受众"
  }
]`

  const userPrompt = `请为以下主题生成 6 个标题：${topic}`

  const response = await chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ])

  try {
    // 尝试从返回内容中提取 JSON
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const titles = JSON.parse(jsonMatch[0])
      // 添加唯一 ID
      return titles.map((title: any, index: number) => ({
        id: `kimi-${Date.now()}-${index}`,
        ...title,
      }))
    }
  } catch (e) {
    console.error('Failed to parse KIMI response:', e)
  }

  throw new Error('Failed to parse titles from KIMI response')
}

/**
 * 搜索历史本校文章
 */
export async function searchHistoricalArticles(topic: string): Promise<any[]> {
  const systemPrompt = `你是南京师范大学的内容数据库助手。用户会提供一个主题，你需要模拟返回该主题相关的历史文章数据。

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

要求返回 2-3 篇相关的本校历史文章。标题要真实、数据要合理。`

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
  const systemPrompt = `你是南京师范大学新媒体运营专家，负责为「${accountName}」公众号推荐选题。

你需要根据以下信息生成一个推荐主题：
1. 当前时间节点（春季、招生季等）
2. 学校近期动态和热点
3. 用户关注点和互动偏好
4. 内容平衡性（避免重复类型）

返回严格的 JSON 格式，不要有任何其他文字：
{
  "theme": "主题标题（格式：分类｜具体主题）",
  "description": "推荐理由（30字以内）",
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

  throw new Error('Failed to parse recommendation from KIMI response')
}

export default kimi
