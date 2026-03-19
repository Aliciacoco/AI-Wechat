'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface TitleItem {
  title: string
  type: string
  appeal: '高' | '中' | '低'
  reason: string
}

interface Props { titles: TitleItem[] }

const typeColors: Record<string, string> = {
  '情感共鸣型': 'bg-pink-50 text-pink-600 border-pink-100',
  '荣耀触发型': 'bg-amber-50 text-amber-600 border-amber-100',
  '悬念好奇型': 'bg-purple-50 text-purple-600 border-purple-100',
  '信息实用型': 'bg-blue-50 text-blue-600 border-blue-100',
}

const appealDot: Record<string, string> = {
  '高': 'bg-green-500',
  '中': 'bg-amber-400',
  '低': 'bg-gray-300',
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
        <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:border-green-200 transition-colors group">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${typeColors[t.type] || 'bg-gray-50 text-gray-500 border-gray-100'}`}>
              {t.type}
            </span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className={`w-2 h-2 rounded-full ${appealDot[t.appeal] || 'bg-gray-300'}`} />
              <span className="text-xs text-gray-400">打开率预测 {t.appeal}</span>
            </div>
          </div>
          <div className="text-sm font-medium text-gray-800 leading-relaxed mb-2">{t.title}</div>
          <div className="text-xs text-gray-400 mb-3">{t.reason}</div>
          <button
            onClick={() => handleCopy(t.title, i)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-600 transition-colors"
          >
            {copied === i
              ? <><Check size={12} className="text-green-500" /><span className="text-green-500">已复制</span></>
              : <><Copy size={12} /><span>复制标题</span></>
            }
          </button>
        </div>
      ))}
    </div>
  )
}
