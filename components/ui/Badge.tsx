'use client'

import { tokens } from '@/lib/design-tokens'
import { CSSProperties, ReactNode } from 'react'

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
  style?: CSSProperties
}

const variantStyles: Record<BadgeVariant, CSSProperties> = {
  default: {
    backgroundColor: tokens.color.base.gray,
    color: tokens.color.text.tertiary,
  },
  accent: {
    backgroundColor: '#EBF4FF',
    color: tokens.color.accent,
  },
  success: {
    backgroundColor: '#E5F8E5',
    color: '#1A7F1A',
  },
  warning: {
    backgroundColor: '#FFF8E1',
    color: '#B45309',
  },
  danger: {
    backgroundColor: '#FFF2F1',
    color: '#FF3B30',
  },
}

export default function Badge({
  children,
  variant = 'default',
  className = '',
  style,
}: BadgeProps) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: '20px',
        padding: '0 8px',
        fontSize: tokens.typography.size.label,
        fontWeight: tokens.typography.weight.medium,
        borderRadius: tokens.radius.button,
        whiteSpace: 'nowrap',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </span>
  )
}
