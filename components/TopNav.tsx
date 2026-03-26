'use client'

import { Database, ChevronDown, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import MaterialLibraryModal from './MaterialLibraryModal'
import { tokens } from '@/lib/design-tokens'
import { useScene } from './SceneProvider'
import { SCHOOL_PROFILES } from '@/data/school-profiles'
import type { SchoolProfile } from '@/data/school-profiles'

const TABS = [
  { id: 'insight' as const, label: '洞察' },
  { id: 'topics' as const, label: '选题' },
  { id: 'creation' as const, label: '创作' },
  { id: 'review' as const, label: '审核' },
]

export default function TopNav() {
  const [showMaterialLibrary, setShowMaterialLibrary] = useState(false)
  const [schoolDropdownOpen, setSchoolDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { scene, setScene, currentSchool, setCurrentSchool } = useScene()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSchoolDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const schoolLabel = currentSchool ? currentSchool.name : '全部学校'

  return (
    <>
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '68px',
          backgroundColor: tokens.color.base.white,
          borderBottom: `1px solid ${tokens.color.divider}`,
          boxShadow: tokens.shadow.diffuse,
          zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px',
          fontFamily: tokens.typography.fontFamily.zh,
        }}
      >
        {/* 左侧：Logo + 产品名 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: tokens.radius.buttonSm,
            backgroundColor: tokens.color.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: tokens.color.base.white, fontWeight: tokens.typography.weight.semibold, fontSize: '12px', letterSpacing: '-0.5px' }}>360</span>
          </div>
          <span style={{ fontSize: '15px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.primary }}>
            高校公众号运营平台
          </span>
        </div>

        {/* 中央胶囊标签切换器 */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: tokens.color.base.gray,
            border: `1px solid ${tokens.color.divider}`,
            borderRadius: tokens.radius.button,
            padding: '3px',
            gap: '2px',
          }}
        >
          {TABS.map((tab) => {
            const isActive = scene === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setScene(tab.id)}
                style={{
                  padding: '8px 20px',
                  borderRadius: tokens.radius.button,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: isActive ? tokens.typography.weight.semibold : tokens.typography.weight.regular,
                  color: isActive ? tokens.color.base.white : tokens.color.text.tertiary,
                  backgroundColor: isActive ? tokens.color.accent : 'transparent',
                  boxShadow: isActive ? '0 1px 4px rgba(0,113,227,0.3)' : 'none',
                  transition: 'all 0.15s ease',
                  fontFamily: tokens.typography.fontFamily.zh,
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* 右侧：学校选择器 + 资料库图标 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

          {/* 学校选择器 */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setSchoolDropdownOpen(v => !v)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                height: '36px', padding: '0 12px',
                fontSize: '13px', fontWeight: tokens.typography.weight.medium,
                fontFamily: tokens.typography.fontFamily.zh,
                borderRadius: tokens.radius.button,
                border: `1px solid ${schoolDropdownOpen ? tokens.color.accent : tokens.color.border}`,
                backgroundColor: schoolDropdownOpen ? '#EBF4FF' : 'transparent',
                color: schoolDropdownOpen ? tokens.color.accent : tokens.color.text.secondary,
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {schoolLabel}
              <ChevronDown size={12} style={{ opacity: 0.6, transform: schoolDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>

            {schoolDropdownOpen && (
              <div style={{
                position: 'absolute', top: '42px', right: 0, zIndex: 100,
                backgroundColor: tokens.color.base.white,
                border: `1px solid ${tokens.color.border}`,
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                minWidth: '160px',
                padding: '6px',
              }}>
                <SchoolOption
                  label="全部学校"
                  description="所有学校数据"
                  isSelected={currentSchool === null}
                  onClick={() => { setCurrentSchool(null); setSchoolDropdownOpen(false) }}
                />
                <div style={{ height: '1px', backgroundColor: tokens.color.divider, margin: '4px 0' }} />
                {SCHOOL_PROFILES.map(school => (
                  <SchoolOption
                    key={school.name}
                    label={school.name}
                    description={school.tier === '985' ? '985工程' : school.tier === '211' ? '211工程' : school.tier === 'private' ? '民办本科' : '普通本科'}
                    isSelected={currentSchool?.name === school.name}
                    onClick={() => { setCurrentSchool(school); setSchoolDropdownOpen(false) }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 资料库图标按钮 */}
          <button
            onClick={() => setShowMaterialLibrary(true)}
            title="资料库"
            style={{
              width: '36px', height: '36px',
              borderRadius: tokens.radius.button,
              border: `1px solid ${tokens.color.border}`,
              backgroundColor: 'transparent',
              color: tokens.color.text.secondary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.15s, color 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = tokens.color.text.tertiary
              e.currentTarget.style.color = tokens.color.text.primary
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = tokens.color.border
              e.currentTarget.style.color = tokens.color.text.secondary
            }}
          >
            <Database size={15} />
          </button>
        </div>
      </header>

      <MaterialLibraryModal isOpen={showMaterialLibrary} onClose={() => setShowMaterialLibrary(false)} currentSchool={currentSchool} />
    </>
  )
}

function SchoolOption({
  label, description, isSelected, onClick,
}: {
  label: string
  description: string
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F5F5F7' }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', padding: '8px 10px',
        borderRadius: '8px', border: 'none', cursor: 'pointer',
        backgroundColor: 'transparent',
        textAlign: 'left', gap: '12px',
        fontFamily: 'inherit',
        transition: 'background-color 0.1s',
      }}
    >
      <div>
        <div style={{ fontSize: '13px', fontWeight: isSelected ? 600 : 400, color: isSelected ? tokens.color.accent : tokens.color.text.primary, lineHeight: 1.3 }}>{label}</div>
        <div style={{ fontSize: '11px', color: tokens.color.text.tertiary, marginTop: '1px' }}>{description}</div>
      </div>
      {isSelected && <Check size={13} color={tokens.color.accent} style={{ flexShrink: 0 }} />}
    </button>
  )
}
