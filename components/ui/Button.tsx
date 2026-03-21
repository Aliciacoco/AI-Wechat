'use client'

import { tokens } from '@/lib/design-tokens'
import { CSSProperties, MouseEvent, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  style?: CSSProperties
  title?: string
}

const sizeMap: Record<ButtonSize, { height: string; padding: string; fontSize: string }> = {
  sm: { height: '28px', padding: '0 12px', fontSize: '12px' },
  md: { height: '36px', padding: '0 16px', fontSize: '14px' },
  lg: { height: '44px', padding: '0 24px', fontSize: '16px' },
}

const variantMap: Record<ButtonVariant, { base: CSSProperties; hover: CSSProperties }> = {
  primary: {
    base: {
      backgroundColor: tokens.color.accent,
      color: tokens.color.base.white,
      border: 'none',
    },
    hover: {
      backgroundColor: '#0062C4',
    },
  },
  ghost: {
    base: {
      backgroundColor: tokens.color.base.gray,
      color: tokens.color.text.secondary,
      border: 'none',
    },
    hover: {
      backgroundColor: '#EFEFEF',
    },
  },
  danger: {
    base: {
      backgroundColor: tokens.color.base.gray,
      color: '#FF3B30',
      border: 'none',
    },
    hover: {
      backgroundColor: '#FFF2F1',
    },
  },
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  style,
  title,
}: ButtonProps) {
  const v = variantMap[variant]
  const s = sizeMap[size]

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        height: s.height,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: tokens.typography.weight.medium,
        fontFamily: tokens.typography.fontFamily.zh,
        borderRadius: tokens.radius.button,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'background-color 0.15s, opacity 0.15s',
        whiteSpace: 'nowrap',
        ...v.base,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) Object.assign(e.currentTarget.style, v.hover)
      }}
      onMouseLeave={(e) => {
        if (!disabled) Object.assign(e.currentTarget.style, v.base)
      }}
    >
      {children}
    </button>
  )
}
