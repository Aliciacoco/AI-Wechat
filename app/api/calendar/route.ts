import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req: NextRequest) {
  const accountId = req.nextUrl.searchParams.get('accountId') || 'njnu-main'
  const accountType = accountId.includes('admissions') ? 'admissions' : 'main'

  const filePath = path.join(process.cwd(), 'data', 'mock', 'calendar.json')
  const calendar = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

  const events = calendar[accountType] || calendar['main']
  const today = new Date()

  const enriched = events.map((e: Record<string, unknown>) => {
    const eventDate = new Date(e.date as string)
    const diffMs = eventDate.getTime() - today.getTime()
    const daysAhead = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    return { ...e, daysAhead }
  }).sort((a: { daysAhead: number }, b: { daysAhead: number }) => {
    // 已过的节点排到最后
    if (a.daysAhead < 0 && b.daysAhead >= 0) return 1
    if (b.daysAhead < 0 && a.daysAhead >= 0) return -1
    return a.daysAhead - b.daysAhead
  })

  return NextResponse.json(enriched)
}
