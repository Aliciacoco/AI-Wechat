'use client'

import { tokens } from '@/lib/design-tokens'

interface QuickTag {
  id: string
  label: string
  icon?: string
}

interface QuickTagsProps {
  tags: QuickTag[]
  onSelectTag: (tag: QuickTag) => void
}

export default function QuickTags({ tags, onSelectTag }: QuickTagsProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px', justifyContent: 'center' }}>
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onSelectTag(tag)}
          style={{
            padding: '6px 16px',
            borderRadius: tokens.radius.button,
            border: `1px solid ${tokens.color.border}`,
            backgroundColor: tokens.color.base.white,
            color: tokens.color.text.secondary,
            fontSize: '13px',
            fontFamily: tokens.typography.fontFamily.zh,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = tokens.color.accent
            e.currentTarget.style.color = tokens.color.accent
            e.currentTarget.style.backgroundColor = '#EBF4FF'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = tokens.color.border
            e.currentTarget.style.color = tokens.color.text.secondary
            e.currentTarget.style.backgroundColor = tokens.color.base.white
          }}
        >
          {tag.icon && <span style={{ marginRight: '4px' }}>{tag.icon}</span>}
          {tag.label}
        </button>
      ))}
    </div>
  )
}
