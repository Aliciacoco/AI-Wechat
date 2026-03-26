'use client'

import Image from 'next/image'

interface School {
  id: string
  name: string
  shortName: string
  logo: string
  lastUpdate?: string
}

interface SchoolAvatarScrollProps {
  schools: School[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function SchoolAvatarScroll({
  schools,
  selectedId,
  onSelect,
}: SchoolAvatarScrollProps) {

  return (
    <div className="mb-6">
      <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
        {schools.map((school) => {
          const isSelected = selectedId === school.id

          return (
            <button
              key={school.id}
              onClick={() => onSelect(school.id)}
              className="flex flex-col items-center gap-2 flex-shrink-0 group"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all relative overflow-hidden"
                style={{
                  border: isSelected ? '2px solid var(--primary)' : '2px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                }}
              >
                {school.logo ? (
                  <Image
                    src={school.logo}
                    alt={school.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <span
                    className="text-lg font-semibold"
                    style={{ color: isSelected ? 'var(--primary)' : 'var(--foreground-secondary)' }}
                  >
                    {school.shortName}
                  </span>
                )}
                {isSelected && (
                  <div
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--primary)' }}
                  />
                )}
              </div>
              <span
                className="text-xs text-center max-w-[64px] truncate"
                style={{ color: isSelected ? 'var(--foreground)' : 'var(--foreground-tertiary)' }}
              >
                {school.name}
              </span>
              {school.lastUpdate && (
                <span
                  className="text-xs text-center"
                  style={{ color: 'var(--foreground-tertiary)' }}
                >
                  {school.lastUpdate}更新
                </span>
              )}
            </button>
          )
        })}
      </div>

    </div>
  )
}
