import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req: NextRequest) {
  const accountType = req.nextUrl.searchParams.get('type') || 'main'
  const filePath = path.join(process.cwd(), 'data', 'mock', 'hotTopics.json')
  const allTopics = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  const accountId = req.nextUrl.searchParams.get('accountId') || 'njnu-main'

  // 为每个热点附加当前账号的推荐角度
  const topics = allTopics.map((t: Record<string, unknown>) => ({
    id: t.id,
    keyword: t.keyword,
    heat: t.heat,
    trend: t.trend,
    source: t.source,
    suggestedAngle: (t.angles as Record<string, string>)[accountId] || (t.angles as Record<string, string>)['njnu-main'],
  }))

  return NextResponse.json(topics)
}
