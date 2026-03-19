import { NextRequest, NextResponse } from 'next/server'
import { loadArticles, analyzeArticles } from '@/lib/dataAnalysis'

export async function GET(req: NextRequest) {
  const accountId = req.nextUrl.searchParams.get('accountId') || 'njnu-main'
  const articles = loadArticles(accountId)

  // 竞品：主号对比主号，招生号对比招生号
  const compId = accountId.startsWith('njnu')
    ? accountId.replace('njnu', 'ecnu')
    : null
  const compArticles = compId ? loadArticles(compId) : undefined

  const insight = analyzeArticles(articles, compArticles)
  return NextResponse.json(insight)
}
