import { NextRequest, NextResponse } from 'next/server'
import { generateTitles, searchHistoricalArticles, searchBenchmarkCases, generateRecommendation } from '@/lib/ai'

// 设置 API 路由的运行时配置
export const runtime = 'nodejs'
export const maxDuration = 60 // Vercel Pro: 最长60秒，免费版: 10秒

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    console.log('📥 Received request to /api/generate')

    const body = await request.json()
    const { topic, type, accountId, accountName } = body

    console.log('📋 Request params:', { topic, type, accountId, accountName })

    // 检查环境变量
    const aiProvider = process.env.AI_PROVIDER || 'kimi'
    const apiKeyName = aiProvider === 'deepseek' ? 'DEEPSEEK_API_KEY' : 'KIMI_API_KEY'
    const apiKey = aiProvider === 'deepseek' ? process.env.DEEPSEEK_API_KEY : process.env.KIMI_API_KEY

    if (!apiKey) {
      console.error(`❌ ${apiKeyName} not configured`)
      return NextResponse.json({
        success: false,
        error: `API Key 未配置，请在环境变量中设置 ${apiKeyName}`
      }, { status: 500 })
    }

    if (type === 'recommendation') {
      // 生成推荐主题
      if (!accountId || !accountName) {
        return NextResponse.json({ success: false, error: '缺少账号参数' }, { status: 400 })
      }
      console.log('🎯 Generating recommendation for:', accountName)
      const recommendation = await generateRecommendation(accountId, accountName)
      const duration = Date.now() - startTime
      console.log(`✅ Recommendation generated in ${duration}ms`)
      return NextResponse.json({ success: true, data: recommendation })
    }

    if (!topic) {
      return NextResponse.json({ success: false, error: '缺少主题参数' }, { status: 400 })
    }

    if (type === 'titles') {
      // 调用 KIMI API 生成标题
      console.log('📝 Generating titles for topic:', topic)
      const titles = await generateTitles(topic)
      const duration = Date.now() - startTime
      console.log(`✅ Titles generated in ${duration}ms`)
      return NextResponse.json({ success: true, data: titles })
    }

    if (type === 'historical') {
      // 调用 KIMI API 搜索历史文章
      console.log('🔍 Searching historical articles for:', topic)
      const articles = await searchHistoricalArticles(topic)
      const duration = Date.now() - startTime
      console.log(`✅ Historical articles found in ${duration}ms`)
      return NextResponse.json({ success: true, data: articles })
    }

    if (type === 'benchmark') {
      // 调用 KIMI API 搜索对标案例
      console.log('🎓 Searching benchmark cases for:', topic)
      const cases = await searchBenchmarkCases(topic)
      const duration = Date.now() - startTime
      console.log(`✅ Benchmark cases found in ${duration}ms`)
      return NextResponse.json({ success: true, data: cases })
    }

    return NextResponse.json({ success: false, error: '未知的类型参数' }, { status: 400 })
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`❌ Generate API error after ${duration}ms:`, error)

    // 详细的错误信息
    let errorMessage = '生成失败，请重试'

    if (error instanceof Error) {
      errorMessage = error.message

      // 特殊错误处理
      if (error.message.includes('timeout')) {
        errorMessage = 'API 请求超时，请稍后重试'
      } else if (error.message.includes('API key')) {
        errorMessage = 'API Key 配置错误，请检查环境变量'
      } else if (error.message.includes('rate limit') || error.message.includes('429')) {
        errorMessage = 'API 调用频率超限，请等待 1-2 分钟后重试'
      } else if (error.message.includes('overload') || error.message.includes('服务器负载过高')) {
        errorMessage = 'KIMI 服务器负载过高，请稍后（1-2分钟）再试'
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = '网络连接失败，请检查网络或稍后重试'
      }
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.stack : String(error) : undefined
    }, { status: 500 })
  }
}
