import { NextRequest, NextResponse } from 'next/server'
import { generateTitles, searchHistoricalArticles, searchBenchmarkCases, generateRecommendation } from '@/lib/kimi'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, type, accountId, accountName } = body

    if (type === 'recommendation') {
      // 生成推荐主题
      if (!accountId || !accountName) {
        return NextResponse.json({ success: false, error: '缺少账号参数' }, { status: 400 })
      }
      const recommendation = await generateRecommendation(accountId, accountName)
      return NextResponse.json({ success: true, data: recommendation })
    }

    if (!topic) {
      return NextResponse.json({ success: false, error: '缺少主题参数' }, { status: 400 })
    }

    if (type === 'titles') {
      // 调用 KIMI API 生成标题
      const titles = await generateTitles(topic)
      return NextResponse.json({ success: true, data: titles })
    }

    if (type === 'historical') {
      // 调用 KIMI API 搜索历史文章
      const articles = await searchHistoricalArticles(topic)
      return NextResponse.json({ success: true, data: articles })
    }

    if (type === 'benchmark') {
      // 调用 KIMI API 搜索对标案例
      const cases = await searchBenchmarkCases(topic)
      return NextResponse.json({ success: true, data: cases })
    }

    return NextResponse.json({ success: false, error: '未知的类型参数' }, { status: 400 })
  } catch (error) {
    console.error('Generate API error:', error)
    const errorMessage = error instanceof Error ? error.message : '生成失败，请重试'
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
