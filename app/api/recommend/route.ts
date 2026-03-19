import { NextRequest, NextResponse } from 'next/server'
import { loadAccount, loadArticles, getTopTitles } from '@/lib/dataAnalysis'
import { buildRecommendPrompt } from '@/lib/prompts'
import { chat } from '@/lib/ai'

export async function POST(req: NextRequest) {
  const { accountId, keyword } = await req.json()
  if (!keyword?.trim()) {
    return NextResponse.json({ error: '请提供热点关键词' }, { status: 400 })
  }

  const account = loadAccount(accountId || 'njnu-main')
  const articles = loadArticles(accountId || 'njnu-main')
  const topTitles = getTopTitles(articles, 20)
  const today = new Date().toISOString().split('T')[0]

  const prompt = buildRecommendPrompt(account, keyword, topTitles, today)
  const raw = await chat([{ role: 'user', content: prompt }]) // 使用默认模型（根据 AI_PROVIDER 自动选择）

  try {
    const match = raw.match(/\[[\s\S]*\]/)
    const result = JSON.parse(match ? match[0] : raw)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'AI 返回格式异常，请重试', raw }, { status: 500 })
  }
}
