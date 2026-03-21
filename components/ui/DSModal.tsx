'use client'

import { X } from 'lucide-react'
import { tokens } from '@/lib/design-tokens'
import { ReactNode, useEffect } from 'react'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

interface DSModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  size?: ModalSize
  /** 底部操作区（可选） */
  footer?: ReactNode
}

const sizeMap: Record<ModalSize, string> = {
  sm: '480px',
  md: '640px',
  lg: '800px',
  xl: '960px',
}

/**
 * 设计规范弹窗组件
 * 遵循 AI专用设计规范：大圆角、极淡边框、弥散阴影、PingFang SC
 */
export default function DSModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
  footer,
}: DSModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* 遮罩 */}
      <div
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* 弹窗 */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          backgroundColor: tokens.color.base.white,
          borderRadius: tokens.radius.modal,
          border: `1px solid ${tokens.color.border}`,
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          maxWidth: sizeMap[size],
          width: 'calc(100% - 32px)',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: tokens.typography.fontFamily.zh,
        }}
      >
        {/* 头部 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '20px 24px 16px',
            borderBottom: `1px solid ${tokens.color.divider}`,
            flexShrink: 0,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '17px',
                fontWeight: tokens.typography.weight.semibold,
                color: tokens.color.text.primary,
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                style={{
                  fontSize: tokens.typography.size.label,
                  color: tokens.color.text.tertiary,
                  marginTop: '4px',
                  lineHeight: 1.4,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: tokens.radius.buttonSm,
              border: 'none',
              backgroundColor: 'transparent',
              color: tokens.color.text.tertiary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              marginLeft: '12px',
              marginTop: '-2px',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = tokens.color.base.gray }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* 内容区 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {children}
        </div>

        {/* 底部操作区（可选） */}
        {footer && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: `1px solid ${tokens.color.divider}`,
              flexShrink: 0,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
