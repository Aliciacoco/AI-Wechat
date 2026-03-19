'use client'

import { Database } from 'lucide-react'
import { useState } from 'react'
import MaterialLibraryModal from './MaterialLibraryModal'

export default function TopNav() {
  const [showMaterialLibrary, setShowMaterialLibrary] = useState(false)

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 h-14 bg-white border-b z-50 flex items-center justify-between px-6"
        style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}
      >
        {/* 左侧 Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary)' }}>
            <span className="text-white font-bold text-sm">南师</span>
          </div>
          <span className="font-bold text-base" style={{ color: 'var(--foreground)' }}>
            高校公众号运营平台
          </span>
        </div>

        {/* 右侧按钮 */}
        <button
          onClick={() => setShowMaterialLibrary(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all border-b-4"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            borderBottomColor: 'var(--primary-hover)',
            boxShadow: 'var(--shadow-sm)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = 'var(--shadow-md)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
          }}
        >
          <Database size={18} />
          <span className="font-bold text-sm">校本资料库</span>
        </button>
      </header>

      {/* 资料库弹窗 */}
      <MaterialLibraryModal
        isOpen={showMaterialLibrary}
        onClose={() => setShowMaterialLibrary(false)}
      />
    </>
  )
}
