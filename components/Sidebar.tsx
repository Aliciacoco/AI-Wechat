'use client'

import { Home, FileText, Star } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { icon: Home, label: '首页', href: '/' },
  { icon: FileText, label: '选题', href: '/topics' },
  { icon: Star, label: '收藏夹', href: '/favorites' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-60 border-r bg-white flex flex-col" style={{ borderColor: 'var(--border)' }}>
      {/* 导航菜单 */}
      <nav className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-md transition-all"
                style={{
                  backgroundColor: isActive ? 'var(--background-hover)' : 'transparent',
                  color: isActive ? 'var(--foreground)' : 'var(--foreground-secondary)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--background-hover)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* 底部信息 */}
      <div className="p-4 border-t text-xs" style={{ borderColor: 'var(--border)', color: 'var(--foreground-tertiary)' }}>
        <p>南京师范大学</p>
        <p className="mt-1">公众号运营平台</p>
      </div>
    </aside>
  )
}
