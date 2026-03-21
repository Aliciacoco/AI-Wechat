'use client'

import { Sparkles, Loader2 } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui'
import { tokens } from '@/lib/design-tokens'

interface ContentType {
  name: string
  current: number
  recommended: number
}

interface AccountBalance {
  id: string
  name: string
  logo: string
  contentTypes: ContentType[]
  recommendation: string
}

interface ContentBalancerProps {
  accounts: AccountBalance[]
  onGenerateIdea: (accountId: string, recommendation: string) => void
}

export default function ContentBalancer({ accounts, onGenerateIdea }: ContentBalancerProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handleGenerate = async (accountId: string, recommendation: string) => {
    setLoadingId(accountId)
    await onGenerateIdea(accountId, recommendation)
    setLoadingId(null)
  }

  return (
    <div className="space-y-3">
      {accounts.map((account) => (
        <div
          key={account.id}
          onMouseEnter={() => setHoveredId(account.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <Card style={{ padding: '16px' }}>
          {/* 账号头部 */}
          <div className="flex items-center gap-3 mb-4">
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
              {account.logo ? (
                <Image src={account.logo} alt={account.name} fill className="object-cover" />
              ) : (
                <div
                  style={{
                    width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: tokens.typography.weight.semibold,
                    backgroundColor: tokens.color.base.gray, color: tokens.color.text.tertiary,
                  }}
                >
                  {account.name.slice(0, 2)}
                </div>
              )}
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.primary }}>
                {account.name}
              </p>
              <p style={{ fontSize: '11px', color: tokens.color.text.tertiary, marginTop: '2px' }}>
                近30天内容类型分布
              </p>
            </div>
          </div>

          {/* 内容类型条形图 */}
          <div className="space-y-2.5 mb-4">
            {account.contentTypes.map((type, index) => {
              const isLow = type.current < type.recommended
              const isHigh = type.current > type.recommended
              const barColor = isLow ? '#FF3B30' : isHigh ? '#F59E0B' : tokens.color.accent

              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontSize: '12px', fontWeight: tokens.typography.weight.medium, color: tokens.color.text.secondary }}>
                      {type.name}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: tokens.typography.weight.semibold, color: barColor }}>
                      {type.current}%
                    </span>
                  </div>
                  <div style={{ position: 'relative', height: '6px', borderRadius: '99px', backgroundColor: tokens.color.base.gray }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: '99px', width: `${type.current}%`, backgroundColor: barColor, transition: 'width 0.3s' }} />
                    <div style={{ position: 'absolute', top: 0, height: '100%', width: '1.5px', left: `${type.recommended}%`, backgroundColor: tokens.color.text.tertiary, opacity: 0.4 }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* 推荐建议 */}
          <div
            style={{
              borderRadius: tokens.radius.buttonSm,
              padding: '10px 12px',
              marginBottom: '12px',
              backgroundColor: tokens.color.base.gray,
              borderLeft: `3px solid ${tokens.color.border}`,
            }}
          >
            <p style={{ fontSize: '11px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.tertiary, marginBottom: '3px' }}>
              推荐发布类型
            </p>
            <p style={{ fontSize: '13px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.secondary }}>
              {account.recommendation}
            </p>
          </div>

          {/* 生成按钮 - 悬停时展示 */}
          <div
            style={{
              overflow: 'hidden',
              maxHeight: hoveredId === account.id ? '40px' : '0',
              opacity: hoveredId === account.id ? 1 : 0,
              transition: 'max-height 0.2s ease, opacity 0.15s ease',
            }}
          >
            <button
              disabled={loadingId === account.id}
              onClick={() => handleGenerate(account.id, account.recommendation)}
              style={{
                width: '100%',
                height: '30px',
                borderRadius: tokens.radius.buttonSm,
                border: 'none',
                backgroundColor: tokens.color.accent,
                color: tokens.color.base.white,
                fontSize: '12px',
                fontWeight: tokens.typography.weight.medium,
                fontFamily: tokens.typography.fontFamily.zh,
                cursor: loadingId === account.id ? 'not-allowed' : 'pointer',
                opacity: loadingId === account.id ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
              }}
            >
              {loadingId === account.id ? (
                <><Loader2 size={12} className="animate-spin" />生成中...</>
              ) : (
                <><Sparkles size={12} />生成选题</>
              )}
            </button>
          </div>
        </Card>
        </div>
      ))}
    </div>
  )
}
