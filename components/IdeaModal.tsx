'use client'

import { X, Star, ChevronRight, TrendingUp, History, Lightbulb } from 'lucide-react'
import { useState } from 'react'
import { tokens } from '@/lib/design-tokens'
import { Card, Badge, Button, Divider } from '@/components/ui'

export default function IdeaModal({ idea, onClose, onCollect }: any) {
  const [step, setStep] = useState(1)

  const TITLES = [
    '这就是南师大的秋天吗？美哭了！',
    '如果你来随园，我一定带你看银杏',
    '全省高校都在看：南师大这组图绝了',
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}>
      <div style={{
        backgroundColor: tokens.color.base.white,
        borderRadius: tokens.radius.modal,
        border: `1px solid ${tokens.color.border}`,
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
        width: 'calc(100% - 32px)',
        maxWidth: '640px',
        maxHeight: '80vh',
        display: 'flex', flexDirection: 'column',
        fontFamily: tokens.typography.fontFamily.zh,
      }}>
        {/* 头部 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${tokens.color.divider}`, backgroundColor: tokens.color.base.gray, borderRadius: `${tokens.radius.modal} ${tokens.radius.modal} 0 0` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Badge style={{ backgroundColor: '#1D1D1F', color: '#fff', fontSize: '10px', letterSpacing: tokens.typography.letterSpacing.label }}>AI GENERATED</Badge>
            <span style={{ fontSize: '13px', fontWeight: tokens.typography.weight.medium, color: tokens.color.text.primary }}>
              灵感生成：{idea || '新选题'}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ width: '28px', height: '28px', borderRadius: tokens.radius.buttonSm, border: 'none', backgroundColor: 'transparent', color: tokens.color.text.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = tokens.color.border }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* 主体 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 第一层：建议标题 */}
          <section>
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.tertiary, letterSpacing: tokens.typography.letterSpacing.label, marginBottom: '12px' }}>
              <Lightbulb size={13} /> 1. 建议标题
            </p>
            <div className="space-y-2">
              {TITLES.map((title, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: tokens.radius.card, border: `1px solid ${tokens.color.border}`, transition: 'background-color 0.1s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = tokens.color.base.gray }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <span style={{ fontSize: '13px', color: tokens.color.text.primary }}>{title}</span>
                  <button
                    onClick={() => onCollect(title)}
                    style={{ padding: '4px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: tokens.color.text.tertiary, transition: 'color 0.15s', flexShrink: 0 }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#F59E0B' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = tokens.color.text.tertiary }}
                  >
                    <Star size={15} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* 第二层：本校历史 */}
          <section>
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.tertiary, letterSpacing: tokens.typography.letterSpacing.label, marginBottom: '12px' }}>
              <History size={13} /> 2. 本校历史同类参考
            </p>
            <Card style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: tokens.color.base.gray }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: tokens.typography.weight.medium, color: tokens.color.text.primary }}>2025年11月：随园秋色摄影集</p>
                <p style={{ fontSize: '11px', color: tokens.color.text.tertiary, marginTop: '3px' }}>当时表现：2.4万阅读 · 892点赞</p>
              </div>
              <ChevronRight size={15} style={{ color: tokens.color.text.tertiary }} />
            </Card>
          </section>

          <Divider />

          {/* 第三层：名校爆款 */}
          <section>
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.tertiary, letterSpacing: tokens.typography.letterSpacing.label, marginBottom: '12px' }}>
              <TrendingUp size={13} /> 3. 名校爆款借鉴
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Card style={{ padding: '12px' }}>
                <Badge variant="accent" style={{ fontSize: '10px', marginBottom: '6px' }}>北京大学</Badge>
                <p style={{ fontSize: '12px', color: tokens.color.text.secondary, lineHeight: 1.5 }}>未名湖畔，这组深秋大片走红...</p>
              </Card>
              <Card style={{ padding: '12px' }}>
                <Badge variant="danger" style={{ fontSize: '10px', marginBottom: '6px' }}>华东师大</Badge>
                <p style={{ fontSize: '12px', color: tokens.color.text.secondary, lineHeight: 1.5 }}>师大秋日：关于红色砖墙的记忆</p>
              </Card>
            </div>
          </section>
        </div>

        {/* 底部 */}
        <div style={{ padding: '12px 20px', borderTop: `1px solid ${tokens.color.divider}`, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="primary" size="md" onClick={onClose}>
            完成并存为草稿
          </Button>
        </div>
      </div>
    </div>
  )
}
