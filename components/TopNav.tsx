'use client'

import { Database } from 'lucide-react'
import { useState } from 'react'
import MaterialLibraryModal from './MaterialLibraryModal'
import { tokens } from '@/lib/design-tokens'
import { useScene } from './SceneProvider'

const TABS = [
  { id: 'insight' as const, label: '洞察' },
  { id: 'topics' as const, label: '选题' },
  { id: 'creation' as const, label: '创作' },
]

export default function TopNav() {
  const [showMaterialLibrary, setShowMaterialLibrary] = useState(false)
  const { scene, setScene } = useScene()

  return (
    <>
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '56px',
          backgroundColor: tokens.color.base.white,
          borderBottom: `1px solid ${tokens.color.divider}`,
          boxShadow: tokens.shadow.diffuse,
          zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px',
          fontFamily: tokens.typography.fontFamily.zh,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: tokens.radius.buttonSm,
            backgroundColor: tokens.color.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: tokens.color.base.white, fontWeight: tokens.typography.weight.semibold, fontSize: '12px' }}>南师</span>
          </div>
          <span style={{ fontSize: '15px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.primary }}>
            高校公众号运营平台
          </span>
        </div>

        {/* 中央胶囊标签切换器 */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: tokens.color.base.gray,
            border: `1px solid ${tokens.color.divider}`,
            borderRadius: tokens.radius.button,
            padding: '3px',
            gap: '2px',
          }}
        >
          {TABS.map((tab) => {
            const isActive = scene === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setScene(tab.id)}
                style={{
                  padding: '5px 18px',
                  borderRadius: tokens.radius.button,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: isActive ? tokens.typography.weight.semibold : tokens.typography.weight.regular,
                  color: isActive ? tokens.color.base.white : tokens.color.text.tertiary,
                  backgroundColor: isActive ? tokens.color.accent : 'transparent',
                  boxShadow: isActive ? '0 1px 4px rgba(0,113,227,0.3)' : 'none',
                  transition: 'all 0.15s ease',
                  fontFamily: tokens.typography.fontFamily.zh,
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* 右侧按钮 */}
        <button
          onClick={() => setShowMaterialLibrary(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            height: '28px',
            padding: '0 12px',
            fontSize: '12px',
            fontWeight: tokens.typography.weight.medium,
            fontFamily: tokens.typography.fontFamily.zh,
            borderRadius: tokens.radius.button,
            border: `1px solid ${tokens.color.border}`,
            backgroundColor: 'transparent',
            color: tokens.color.text.secondary,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = tokens.color.text.tertiary
            e.currentTarget.style.color = tokens.color.text.primary
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = tokens.color.border
            e.currentTarget.style.color = tokens.color.text.secondary
          }}
        >
          <Database size={13} style={{ opacity: 0.7 }} />
          校本资料库
        </button>
      </header>

      <MaterialLibraryModal isOpen={showMaterialLibrary} onClose={() => setShowMaterialLibrary(false)} />
    </>
  )
}
