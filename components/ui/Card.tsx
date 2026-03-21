'use client'

import { tokens } from '@/lib/design-tokens'
import { CSSProperties, ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  /** 是否使用大圆角 (24px)，默认 20px */
  large?: boolean
  /** 是否带边框，默认带 */
  bordered?: boolean
  /** 是否带弥散阴影，默认不带 */
  shadow?: boolean
  className?: string
  style?: CSSProperties
  onClick?: () => void
}

export default function Card({
  children,
  large = false,
  bordered = true,
  shadow = false,
  className = '',
  style,
  onClick,
}: CardProps) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        backgroundColor: tokens.color.base.white,
        borderRadius: large ? tokens.radius.cardLg : tokens.radius.card,
        border: bordered ? `1px solid ${tokens.color.border}` : 'none',
        boxShadow: shadow ? tokens.shadow.diffuse : tokens.shadow.none,
        cursor: onClick ? 'pointer' : undefined,
        transition: onClick ? 'box-shadow 0.15s' : undefined,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = shadow ? tokens.shadow.diffuse : tokens.shadow.none
        }
      }}
    >
      {children}
    </div>
  )
}
