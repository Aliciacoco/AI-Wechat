'use client'

import { tokens } from '@/lib/design-tokens'
import { Divider } from '@/components/ui'

interface TabSwitchProps {
  tabs: { id: string; label: string }[]
  activeTab: string
  onChange: (id: string) => void
}

export default function TabSwitch({ tabs, activeTab, onChange }: TabSwitchProps) {
  return (
    <div>
      <div style={{ display: 'flex', gap: '4px' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: isActive ? tokens.typography.weight.semibold : tokens.typography.weight.regular,
                color: isActive ? tokens.color.text.primary : tokens.color.text.tertiary,
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                position: 'relative',
                transition: 'color 0.15s',
                fontFamily: tokens.typography.fontFamily.zh,
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = tokens.color.text.secondary }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = tokens.color.text.tertiary }}
            >
              {tab.label}
              {isActive && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: '2px', borderRadius: '1px',
                  backgroundColor: tokens.color.accent,
                }} />
              )}
            </button>
          )
        })}
      </div>
      <Divider />
    </div>
  )
}
