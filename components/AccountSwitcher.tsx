'use client'

import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { tokens } from '@/lib/design-tokens'
import { Divider } from '@/components/ui'

const ACCOUNTS = [
  { id: 'njnu-main', label: '南京师范大学', sub: '官方主号', role: 'own' },
  { id: 'njnu-admissions', label: '南师招生', sub: '招生专号', role: 'own' },
  { id: 'ecnu-main', label: '华东师范大学', sub: '竞品参考', role: 'competitor' },
  { id: 'ecnu-admissions', label: '华东师大本科招生', sub: '竞品参考', role: 'competitor' },
]

interface Props {
  accountId: string
  onChange: (id: string) => void
}

export default function AccountSwitcher({ accountId, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const current = ACCOUNTS.find(a => a.id === accountId) || ACCOUNTS[0]

  return (
    <div style={{ position: 'relative' }}>
      {/* 触发按钮 */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          backgroundColor: tokens.color.base.white,
          border: `1px solid ${tokens.color.border}`,
          borderRadius: tokens.radius.buttonSm,
          padding: '6px 12px',
          fontSize: '13px',
          fontFamily: tokens.typography.fontFamily.zh,
          cursor: 'pointer',
          boxShadow: tokens.shadow.diffuse,
          transition: 'border-color 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = tokens.color.accent }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = open ? tokens.color.accent : tokens.color.border }}
      >
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34C759', flexShrink: 0 }} />
        <span style={{ fontWeight: tokens.typography.weight.medium, color: tokens.color.text.primary }}>{current.label}</span>
        <span style={{ color: tokens.color.text.tertiary, fontSize: '12px' }}>{current.sub}</span>
        <ChevronDown size={13} style={{ color: tokens.color.text.tertiary, transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 20,
            backgroundColor: tokens.color.base.white,
            border: `1px solid ${tokens.color.border}`,
            borderRadius: tokens.radius.card,
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            minWidth: '220px',
            overflow: 'hidden',
          }}>
            <p style={{ padding: '8px 12px 4px', fontSize: '11px', color: tokens.color.text.tertiary, fontWeight: tokens.typography.weight.semibold, letterSpacing: tokens.typography.letterSpacing.label }}>
              我方账号
            </p>
            {ACCOUNTS.filter(a => a.role === 'own').map(a => (
              <button key={a.id} onClick={() => { onChange(a.id); setOpen(false) }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 12px', border: 'none', cursor: 'pointer', textAlign: 'left',
                  backgroundColor: accountId === a.id ? '#EBF4FF' : 'transparent',
                  transition: 'background-color 0.1s',
                  fontFamily: tokens.typography.fontFamily.zh,
                }}
                onMouseEnter={(e) => { if (accountId !== a.id) e.currentTarget.style.backgroundColor = tokens.color.base.gray }}
                onMouseLeave={(e) => { if (accountId !== a.id) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: tokens.typography.weight.medium, color: tokens.color.text.primary }}>{a.label}</p>
                  <p style={{ fontSize: '11px', color: tokens.color.text.tertiary }}>{a.sub}</p>
                </div>
                {accountId === a.id && <Check size={13} style={{ color: tokens.color.accent }} />}
              </button>
            ))}
            <Divider style={{ margin: '4px 0' }} />
            <p style={{ padding: '4px 12px', fontSize: '11px', color: tokens.color.text.tertiary, fontWeight: tokens.typography.weight.semibold, letterSpacing: tokens.typography.letterSpacing.label }}>
              竞品参考
            </p>
            {ACCOUNTS.filter(a => a.role === 'competitor').map(a => (
              <button key={a.id} onClick={() => { onChange(a.id); setOpen(false) }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 12px', border: 'none', cursor: 'pointer', textAlign: 'left',
                  backgroundColor: 'transparent', transition: 'background-color 0.1s',
                  fontFamily: tokens.typography.fontFamily.zh,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = tokens.color.base.gray }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', color: tokens.color.text.secondary }}>{a.label}</p>
                  <p style={{ fontSize: '11px', color: tokens.color.text.tertiary }}>{a.sub}</p>
                </div>
                {accountId === a.id && <Check size={13} style={{ color: tokens.color.accent }} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
