import { NextRequest, NextResponse } from 'next/server'
import { loadAccount, loadArticles, getTopTitles, findSimilarArticles, getCompetitorId, getSchoolName } from '@/lib/dataAnalysis'
import { buildScorePrompt } from '@/lib/prompts'
import { chat } from '@/lib/kimi'

export async function POST(req: NextRequest) {
  const { accountId, idea } = await req.json()
  if (!idea?.trim()) {
    return NextResponse.json({ error: '请输入选题想法' }, { status: 400 })
  }

  const resolvedId = accountId || 'njnu-main'
  const account = loadAccount(resolvedId)
  const articles = loadArticles(resolvedId)
  const topTitles = getTopTitles(articles, 20)
  const today = new Date().toISOString().split('T')[0]

  const selfBenchmarks = findSimilarArticles(idea, articles, getSchoolName(resolvedId), 5)
  const compId = getCompetitorId(resolvedId)
  const compArticles = loadArticles(compId)
  const compBenchmarks = findSimilarArticles(idea, compArticles, getSchoolName(compId), 5)
  const compSchool = getSchoolName(compId)

  const prompt = buildScorePrompt(account, idea, topTitles, today, selfBenchmarks, compBenchmarks, compSchool)
  const raw = await chat([{ role: 'user', content: prompt }], 'moonshot-v1-32k')

  try {
    const match = raw.match(/\{[\s\S]*\}/)
    const result = JSON.parse(match ? match[0] : raw)
    return NextResponse.json({ ...result, selfBenchmarks, competitorBenchmarks: compBenchmarks, competitorSchool: compSchool })
  } catch {
    return NextResponse.json({ error: 'AI 返回格式异常，请重试', raw }, { status: 500 })
  }
}
