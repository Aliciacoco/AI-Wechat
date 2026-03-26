'use client'

import { Home, FileText, Star } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { tokens } from '@/lib/design-tokens'
import { Divider } from '@/components/ui'

const navItems = [
  { icon: Home, label: '首页', href: '/' },
  { icon: FileText, label: '选题', href: '/topics' },
  { icon: Star, label: '收藏夹', href: '/favorites' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      position: 'fixed', left: 0, top: '56px',
      height: 'calc(100vh - 56px)', width: '220px',
      borderRight: `1px solid ${tokens.color.divider}`,
      backgroundColor: tokens.color.base.white,
      display: 'flex', flexDirection: 'column',
      fontFamily: tokens.typography.fontFamily.zh,
    }}>
      <nav style={{ flex: 1, padding: '12px 8px' }}>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 12px', borderRadius: tokens.radius.buttonSm,
                  textDecoration: 'none',
                  backgroundColor: isActive ? '#EBF4FF' : 'transparent',
                  color: isActive ? tokens.color.accent : tokens.color.text.secondary,
                  transition: 'background-color 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = tokens.color.base.gray; e.currentTarget.style.color = tokens.color.text.primary } }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = tokens.color.text.secondary } }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontWeight: isActive ? tokens.typography.weight.semibold : tokens.typography.weight.regular }}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      <Divider />
      <div style={{ padding: '14px 16px' }}>
        <p style={{ fontSize: '11px', color: tokens.color.text.tertiary }}>南京师范大学</p>
        <p style={{ fontSize: '11px', color: tokens.color.text.tertiary, marginTop: '2px' }}>公众号运营平台</p>
      </div>
    </aside>
  )
}
