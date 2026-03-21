import { NextRequest, NextResponse } from 'next/server'
import { chat } from '@/lib/ai'

export const runtime = 'nodejs'
export const maxDuration = 60

interface ArticleInput {
  id: string
  title: string
  views: number
  likes: number
}

export async function POST(request: NextRequest) {
  try {
    const { articles }: { articles: ArticleInput[] } = await request.json()
    if (!articles?.length) {
      return NextResponse.json({ success: false, error: '缺少文章列表' }, { status: 400 })
    }

    // Use numeric index as the key to avoid AI misreading IDs
    const indexedArticles = articles.map((a, i) => ({ idx: i, ...a }))
    const idByIdx: Record<number, string> = {}
    indexedArticles.forEach(a => { idByIdx[a.idx] = a.id })

    const articleList = indexedArticles
      .map((a) => `[${a.idx}] 阅读${a.views} 点赞${a.likes} | ${a.title}`)
      .join('\n')

    const systemPrompt = `你是一位高校新媒体运营专家，擅长分析微信公众号文章的选题逻辑。
请从【选题维度】分析每篇文章为什么能获得高阅读量，不要分析文章内容或写作技巧。

分析角度（结合文章标题和阅读数据判断）：
- 信息刚需型：招生简章、分数线、招聘信息，读者主动搜索，不推自来
- 情感节点型：校庆周年、节气景色，调动校友/学生的归属感
- 群体共鸣型：榜样评选、学生故事，被提名者或相关群体主动传播
- 就业焦虑型：招聘、就业、考研，踩中持续痛点
- 娱乐扩散型：短剧、搞笑、反差内容，突破本校粉丝圈

要求：
- 每篇给出 3 条原因，每条 15-25 字，语气像同事说话
- 不说"传播力强""情感共鸣度高"这种空话
- 只说选题为什么好，不评价内容质量或标题写法

严格按如下 JSON 格式输出，key 是文章序号数字（就是输入里方括号里的数字），不要有任何额外文字：
{"0": ["原因1", "原因2", "原因3"], "1": [...], ...}`

    const userPrompt = `分析以下高校公众号文章的选题逻辑：\n\n${articleList}`

    const response = await chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ])

    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ success: false, error: '解析失败' }, { status: 500 })
    }

    const raw: Record<string, string[]> = JSON.parse(jsonMatch[0])

    // Remap numeric index keys back to article IDs
    const result: Record<string, string[]> = {}
    for (const [key, reasons] of Object.entries(raw)) {
      const idx = parseInt(key, 10)
      if (!isNaN(idx) && idByIdx[idx]) {
        result[idByIdx[idx]] = reasons
      }
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('analyze-articles error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '分析失败',
    }, { status: 500 })
  }
}
