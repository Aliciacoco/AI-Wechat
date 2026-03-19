'use client'

interface TabSwitchProps {
  tabs: { id: string; label: string }[]
  activeTab: string
  onChange: (id: string) => void
}

export default function TabSwitch({ tabs, activeTab, onChange }: TabSwitchProps) {
  return (
    <div className="flex gap-2 border-b pb-0" style={{ borderColor: 'var(--border)' }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="px-4 py-2.5 text-sm font-medium transition-all relative"
            style={{
              color: isActive ? 'var(--foreground)' : 'var(--foreground-secondary)',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--foreground)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--foreground-secondary)'
              }
            }}
          >
            {tab.label}
            {isActive && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: 'var(--primary)' }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
