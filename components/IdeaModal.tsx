'use client'

import { X, Star, ChevronRight, TrendingUp, History, Lightbulb } from 'lucide-react'
import { useState } from 'react'

export default function IdeaModal({ idea, onClose, onCollect }: any) {
  const [step, setStep] = useState(1)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EDEDED] flex justify-between items-center bg-[#F7F7F5]">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#AC202D] text-white text-[10px] rounded font-bold">AI GENERATED</span>
            <span className="text-[14px] font-medium text-[#37352F]">灵感生成：{idea || '新选题'}</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* 弹窗主体内容 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* 第一层：AI 标题 */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-[#9B9A97] text-[12px] font-bold uppercase tracking-wider">
              <Lightbulb size={14} /> 1. 建议标题 (5-8个)
            </div>
            <div className="space-y-2">
              {['这就是南师大的秋天吗？美哭了！', '如果你来随园，我一定带你看银杏', '全省高校都在看：南师大这组图绝了'].map((title, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-[#EDEDED] rounded-lg hover:bg-[#F7F7F5] group transition-colors">
                  <span className="text-[14px] text-[#37352F]">{title}</span>
                  <button 
                    onClick={() => onCollect(title)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-yellow-500 transition-all"
                  >
                    <Star size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 第二层：本校历史对比 */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-[#9B9A97] text-[12px] font-bold uppercase tracking-wider">
              <History size={14} /> 2. 本校历史同类参考
            </div>
            <div className="bg-[#F7F7F5] rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[13px] font-medium">2025年11月：随园秋色摄影集</div>
                <div className="text-[11px] text-[#9B9A97] mt-1">当时表现：2.4万阅读 · 892点赞</div>
              </div>
              <ChevronRight size={16} className="text-[#9B9A97]" />
            </div>
          </section>

          {/* 第三层：名校爆款 */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-[#9B9A97] text-[12px] font-bold uppercase tracking-wider">
              <TrendingUp size={14} /> 3. 名校爆款借鉴 (双一流)
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-[#EDEDED] rounded-lg">
                <div className="text-[10px] text-blue-600 font-bold mb-1">北京大学</div>
                <div className="text-[12px] leading-tight">未名湖畔，这组深秋大片走红...</div>
              </div>
              <div className="p-3 border border-[#EDEDED] rounded-lg">
                <div className="text-[10px] text-red-600 font-bold mb-1">华东师大</div>
                <div className="text-[12px] leading-tight">师大秋日：关于红色砖墙的记忆</div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EDEDED] flex justify-end bg-white">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-[#37352F] text-white rounded-md text-[14px] font-medium hover:bg-black transition-colors"
          >
            完成并存为草稿
          </button>
        </div>
      </div>
    </div>
  )
}