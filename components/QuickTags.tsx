'use client'

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
    <div className="flex flex-wrap gap-2 mb-8 justify-center">
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onSelectTag(tag)}
          className="px-4 py-2 rounded-full text-sm transition-all border"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--background)',
            color: 'var(--foreground-secondary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)'
            e.currentTarget.style.color = 'var(--primary)'
            e.currentTarget.style.backgroundColor = 'var(--primary-light)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--foreground-secondary)'
            e.currentTarget.style.backgroundColor = 'var(--background)'
          }}
        >
          {tag.icon && <span className="mr-1">{tag.icon}</span>}
          {tag.label}
        </button>
      ))}
    </div>
  )
}
