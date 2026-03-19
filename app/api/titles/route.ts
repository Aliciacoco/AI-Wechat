import { NextRequest, NextResponse } from 'next/server'
import { loadAccount, loadArticles, getTopTitles } from '@/lib/dataAnalysis'
import { buildTitlesPrompt } from '@/lib/prompts'
import { chat } from '@/lib/ai'

export async function POST(req: NextRequest) {
  const { accountId, topic } = await req.json()
  if (!topic?.trim()) {
    return NextResponse.json({ error: '请提供选题方向' }, { status: 400 })
  }

  const account = loadAccount(accountId || 'njnu-main')
  const articles = loadArticles(accountId || 'njnu-main')
  const topTitles = getTopTitles(articles, 15)

  const prompt = buildTitlesPrompt(account, topic, topTitles)
  const raw = await chat([{ role: 'user', content: prompt }], 'moonshot-v1-8k')

  try {
    const match = raw.match(/\[[\s\S]*\]/)
    const result = JSON.parse(match ? match[0] : raw)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'AI 返回格式异常，请重试', raw }, { status: 500 })
  }
}
