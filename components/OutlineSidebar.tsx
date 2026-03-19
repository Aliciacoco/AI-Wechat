'use client'

import { FileText, ImageIcon, Sparkles } from 'lucide-react'

interface TitleItem {
  title: string
  type: string
  appeal: string
}

interface Props {
  topic: string
  titles: TitleItem[]
  generating: boolean
}

const OUTLINE_ITEMS = [
  '引言 · 场景设定',
  '核心内容 · 主体展开',
  '数据 / 故事 · 支撑论点',
  '情感升华 · 共鸣收尾',
  '行动引导 · 互动召唤',
]

const INTENT_PHOTOS = [
  { label: '校园风景', from: 'from-green-100', to: 'to-emerald-50' },
  { label: '学生活动', from: 'from-sky-100', to: 'to-blue-50' },
  { label: '建筑人文', from: 'from-amber-100', to: 'to-orange-50' },
]

export default function OutlineSidebar({ topic, titles, generating }: Props) {
  return (
    <div className="space-y-3">
      {/* 文案大纲 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <FileText size={13} className="text-green-600" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">文案大纲</span>
        </div>
        <div className="space-y-2">
          {OUTLINE_ITEMS.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-50 text-green-600 text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                {i + 1}
              </span>
              <span className={`text-xs text-gray-600 ${generating ? 'animate-pulse' : ''}`}>{item}</span>
            </div>
          ))}
        </div>
        {topic && (
          <div className="mt-3 pt-3 border-t border-gray-50 text-[10px] text-gray-400 leading-relaxed">
            基于：{topic.length > 24 ? topic.slice(0, 24) + '…' : topic}
          </div>
        )}
      </div>

      {/* 意向配图 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <ImageIcon size={13} className="text-blue-500" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">意向配图</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {INTENT_PHOTOS.map((photo, i) => (
            <div
              key={i}
              className={`relative rounded-lg overflow-hidden h-[72px] bg-gradient-to-br ${photo.from} ${photo.to}`}
            >
              <div className="absolute inset-0 bg-black/45 flex flex-col justify-between p-1.5">
                <span className="self-end bg-white/20 rounded px-1 text-white text-[9px]">
                  {photo.label}
                </span>
                <span className="text-white text-[8px] leading-tight font-medium">
                  [意向图：建议替换为最新实拍]
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-[10px] text-gray-400">已从历史库自动匹配 · 建议上传实拍替换</div>
      </div>

      {/* 候选标题预览 */}
      {titles.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles size={13} className="text-amber-500" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              候选标题 · {titles.length} 个
            </span>
          </div>
          <div className="space-y-2">
            {titles.slice(0, 5).map((t, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded bg-gray-50 text-gray-400 text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-xs text-gray-700 leading-relaxed">{t.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
