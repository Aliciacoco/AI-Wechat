'use client'

import { X, FileText } from 'lucide-react'
import { useState } from 'react'
import { TOPIC_STRATEGY_PROMPT } from '@/lib/prompts'
import { tokens } from '@/lib/design-tokens'

// 独立的提示词按钮，可单独使用
export function PromptButton() {
  const [isPromptOpen, setIsPromptOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsPromptOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '0 10px',
          height: '34px',
          borderRadius: tokens.radius.button,
          border: `1px solid ${tokens.color.border}`,
          backgroundColor: 'transparent',
          color: tokens.color.text.tertiary,
          fontSize: '12px',
          fontFamily: tokens.typography.fontFamily.zh,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = tokens.color.accent
          e.currentTarget.style.color = tokens.color.accent
          e.currentTarget.style.backgroundColor = '#EBF4FF'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = tokens.color.border
          e.currentTarget.style.color = tokens.color.text.tertiary
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
        title="查看当前 AI 选题提示词"
      >
        <FileText size={12} />
        提示词
      </button>

      {isPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsPromptOpen(false)} />
          <div
            className="relative bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E5E5E5' }}
          >
            <div className="sticky top-0 bg-white px-6 py-4 flex items-center justify-between z-10" style={{ borderBottom: '1px solid #F2F2F2' }}>
              <div>
                <h3 className="text-base font-semibold" style={{ color: '#1D1D1F' }}>
                  当前 AI 选题提示词
                </h3>
                <p className="text-xs mt-0.5" style={{ color: '#86868B' }}>
                  这是 AI 生成选题时遵循的最高规范，实时生效
                </p>
              </div>
              <button
                onClick={() => setIsPromptOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: '#86868B' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F5F7' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#86868B', letterSpacing: '0.05em' }}>
                  ROLE · 角色设定
                </div>
                <div className="rounded-2xl p-4" style={{ backgroundColor: '#FBFBFD', border: '1px solid #E5E5E5' }}>
                  <p className="text-sm leading-relaxed" style={{ color: '#424245' }}>
                    {TOPIC_STRATEGY_PROMPT.role}
                  </p>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#86868B', letterSpacing: '0.05em' }}>
                  STRATEGY · {TOPIC_STRATEGY_PROMPT.framework.name}
                </div>
                <div className="space-y-2">
                  {TOPIC_STRATEGY_PROMPT.framework.dimensions.map((d, i) => (
                    <div key={d.key} className="rounded-2xl p-4" style={{ backgroundColor: '#FBFBFD', border: '1px solid #E5E5E5' }}>
                      <div className="text-sm font-semibold mb-1" style={{ color: '#1D1D1F' }}>
                        {i + 1}. {d.label}
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: '#424245' }}>{d.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#86868B', letterSpacing: '0.05em' }}>
                  CATEGORIES · 选题类型矩阵
                </div>
                <div className="space-y-2">
                  {TOPIC_STRATEGY_PROMPT.categories.map((cat) => (
                    <div key={cat.id} className="rounded-2xl p-4" style={{ backgroundColor: '#FBFBFD', border: '1px solid #E5E5E5' }}>
                      <div className="text-sm font-semibold mb-1" style={{ color: '#1D1D1F' }}>{cat.name}</div>
                      <p className="text-xs mb-1" style={{ color: '#424245' }}>
                        <span style={{ color: '#0071E3' }}>要求：</span>{cat.requirement}
                      </p>
                      <p className="text-xs" style={{ color: '#86868B' }}>
                        思考方向：{cat.direction}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#86868B', letterSpacing: '0.05em' }}>
                  CONSTRAINTS · 约束条件
                </div>
                <div className="rounded-2xl p-4" style={{ backgroundColor: '#FBFBFD', border: '1px solid #E5E5E5' }}>
                  <ul className="space-y-1.5">
                    {TOPIC_STRATEGY_PROMPT.constraints.map((c, i) => (
                      <li key={i} className="text-xs flex gap-2" style={{ color: '#424245' }}>
                        <span style={{ color: '#0071E3', flexShrink: 0 }}>·</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#86868B', letterSpacing: '0.05em' }}>
                  OUTPUT · 输出格式
                </div>
                <div className="rounded-2xl p-4 font-mono text-xs" style={{ backgroundColor: '#FBFBFD', border: '1px solid #E5E5E5', color: '#424245', whiteSpace: 'pre-wrap' }}>
                  {TOPIC_STRATEGY_PROMPT.outputFormat}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// 保留原组件（含问号+提示词两个按钮）供其他地方使用
export default function AlgorithmInfo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full transition-all"
        style={{
          backgroundColor: 'var(--background-secondary)',
          color: 'var(--foreground-tertiary)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--primary-light)'
          e.currentTarget.style.color = 'var(--primary)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--background-secondary)'
          e.currentTarget.style.color = 'var(--foreground-tertiary)'
        }}
        title="查看算法规则"
      >
        <X size={14} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div
            className="relative bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            style={{ boxShadow: 'var(--shadow-lg)' }}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                产品核心逻辑 & 提示词设计
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                style={{ color: 'var(--foreground-tertiary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--background-hover)' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <p style={{ fontSize: '13px', color: 'var(--foreground-secondary)' }}>算法规则详情</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

