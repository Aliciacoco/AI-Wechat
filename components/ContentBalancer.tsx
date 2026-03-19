'use client'

import { Sparkles, Loader2 } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

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
  recommendation: string // 推荐发布的类型
}

interface ContentBalancerProps {
  accounts: AccountBalance[]
  onGenerateIdea: (accountId: string, recommendation: string) => void
}

export default function ContentBalancer({ accounts, onGenerateIdea }: ContentBalancerProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

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
          className="bg-white rounded-lg border-2 p-4 transition-all hover:shadow-md group"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* 账号头部 */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden relative flex-shrink-0">
              {account.logo ? (
                <Image
                  src={account.logo}
                  alt={account.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}
                >
                  {account.name.slice(0, 2)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                {account.name}
              </h3>
              <p className="text-xs" style={{ color: 'var(--foreground-tertiary)' }}>
                近30天内容类型分布
              </p>
            </div>
          </div>

          {/* 内容类型条形图 */}
          <div className="space-y-2.5 mb-4">
            {account.contentTypes.map((type, index) => {
              const isLow = type.current < type.recommended
              const isHigh = type.current > type.recommended

              return (
                <div key={index}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium" style={{ color: 'var(--foreground-secondary)' }}>
                      {type.name}
                    </span>
                    <span
                      className="font-bold"
                      style={{
                        color: isLow ? '#ef4444' : isHigh ? '#f59e0b' : 'var(--primary)'
                      }}
                    >
                      {type.current}%
                    </span>
                  </div>
                  <div className="relative h-2 rounded-full" style={{ backgroundColor: 'var(--background-secondary)' }}>
                    <div
                      className="absolute top-0 left-0 h-full rounded-full transition-all"
                      style={{
                        width: `${type.current}%`,
                        backgroundColor: isLow ? '#ef4444' : isHigh ? '#fbbf24' : 'var(--primary)',
                      }}
                    />
                    {/* 目标线 */}
                    <div
                      className="absolute top-0 h-full w-0.5"
                      style={{
                        left: `${type.recommended}%`,
                        backgroundColor: 'var(--foreground-secondary)',
                        opacity: 0.5
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* 推荐建议 */}
          <div
            className="rounded-lg p-3 mb-3"
            style={{
              backgroundColor: 'var(--primary-light)',
              borderLeft: '3px solid var(--primary)'
            }}
          >
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--primary)' }}>
              📝 推荐发布类型
            </div>
            <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>
              {account.recommendation}
            </p>
          </div>

          {/* AI 生成按钮 */}
          <button
            onClick={() => handleGenerate(account.id, account.recommendation)}
            disabled={loadingId === account.id}
            className="w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border-b-4 opacity-0 group-hover:opacity-100"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'white',
              borderBottomColor: 'var(--primary-hover)'
            }}
            onMouseEnter={(e) => {
              if (loadingId !== account.id) {
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={(e) => {
              if (loadingId !== account.id) {
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
          >
            {loadingId === account.id ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                AI 标题
              </>
            )}
          </button>
        </div>
      ))}
    </div>
  )
}
