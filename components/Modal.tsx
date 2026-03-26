'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'
import { tokens } from '@/lib/design-tokens'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeMap = { sm: '480px', md: '640px', lg: '800px', xl: '960px' }

export default function Modal({ isOpen, onClose, title, children, size = 'lg' }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
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
      <div
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
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
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: tokens.typography.fontFamily.zh,
        }}
      >
        {/* 头部 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: `1px solid ${tokens.color.divider}`, flexShrink: 0 }}>
          <h2 style={{ fontSize: '16px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.primary, margin: 0 }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose() }}
            style={{ width: '32px', height: '32px', borderRadius: tokens.radius.buttonSm, border: 'none', backgroundColor: 'transparent', color: tokens.color.text.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 0.15s' }}
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
      </div>
    </div>
  )
}
