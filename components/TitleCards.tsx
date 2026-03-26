'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { tokens } from '@/lib/design-tokens'

interface TitleItem {
  title: string
  type: string
  appeal: '高' | '中' | '低'
  reason: string
}

interface Props { titles: TitleItem[] }

const TYPE_VARIANT: Record<string, 'default' | 'accent' | 'warning' | 'danger'> = {
  '情感共鸣型': 'danger',
  '荣耀触发型': 'warning',
  '悬念好奇型': 'default',
  '信息实用型': 'accent',
}

const APPEAL_COLOR: Record<string, string> = {
  '高': '#34C759',
  '中': '#F59E0B',
  '低': tokens.color.text.tertiary,
}

export default function TitleCards({ titles }: Props) {
  const [copied, setCopied] = useState<number | null>(null)

  const handleCopy = (text: string, i: number) => {
    navigator.clipboard.writeText(text)
    setCopied(i)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {titles.map((t, i) => (
        <Card key={i} style={{ padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
            <Badge variant={TYPE_VARIANT[t.type] ?? 'default'} style={{ fontSize: '11px' }}>{t.type}</Badge>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: APPEAL_COLOR[t.appeal] ?? tokens.color.text.tertiary }} />
              <span style={{ fontSize: '11px', color: tokens.color.text.tertiary }}>打开率预测 {t.appeal}</span>
            </div>
          </div>
          <p style={{ fontSize: '13px', fontWeight: tokens.typography.weight.medium, color: tokens.color.text.primary, lineHeight: 1.6, marginBottom: '6px' }}>
            {t.title}
          </p>
          <p style={{ fontSize: '11px', color: tokens.color.text.tertiary, marginBottom: '10px' }}>{t.reason}</p>
          <button
            onClick={() => handleCopy(t.title, i)}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: 0,
              color: copied === i ? '#065F46' : tokens.color.text.tertiary,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => { if (copied !== i) e.currentTarget.style.color = tokens.color.accent }}
            onMouseLeave={(e) => { if (copied !== i) e.currentTarget.style.color = tokens.color.text.tertiary }}
          >
            {copied === i
              ? <><Check size={12} /><span>已复制</span></>
              : <><Copy size={12} /><span>复制标题</span></>
            }
          </button>
        </Card>
      ))}
    </div>
  )
}
