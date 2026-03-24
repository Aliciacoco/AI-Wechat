'use client'

import { X, FileText, Trash2, File, Plus } from 'lucide-react'
import { useState } from 'react'
import { tokens } from '@/lib/design-tokens'
import { Button, Divider } from '@/components/ui'

interface MaterialFile {
  id: string
  name: string
  size: string
  type: string
  uploadDate: string
}

const INITIAL_FILES: MaterialFile[] = [
  { id: '1', name: '2024年南京师范大学非江苏省招生计划表.pdf', size: '772 KB', type: 'pdf', uploadDate: '2024-03-19' },
  { id: '2', name: '2024年南京师范大学江苏省招生计划表.pdf', size: '784 KB', type: 'pdf', uploadDate: '2024-03-19' },
  { id: '3', name: '南京师范大学学校简介（数据截止0228）.docx', size: '17 KB', type: 'docx', uploadDate: '2024-03-19' },
  { id: '4', name: '南师大校史.md', size: '8 KB', type: 'md', uploadDate: '2024-03-19' },
  { id: '5', name: '南师大荣誉榜单.md', size: '12 KB', type: 'md', uploadDate: '2024-03-19' },
  { id: '6', name: '南师大院系名录.md', size: '15 KB', type: 'md', uploadDate: '2024-03-19' },
  { id: '7', name: '南师大常用金句集.md', size: '10 KB', type: 'md', uploadDate: '2024-03-19' },
  { id: '8', name: '南师大就业去向.md', size: '13 KB', type: 'md', uploadDate: '2024-03-19' },
  { id: '9', name: '南师大校园美景与节气表.md', size: '11 KB', type: 'md', uploadDate: '2024-03-19' },
]

const FILE_ICON_COLOR: Record<string, string> = {
  pdf: '#FF3B30',
  docx: '#0D99FF',
  md: '#34C759',
}

interface MaterialLibraryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MaterialLibraryModal({ isOpen, onClose }: MaterialLibraryModalProps) {
  const [files, setFiles] = useState<MaterialFile[]>(INITIAL_FILES)

  if (!isOpen) return null

  const handleDelete = (id: string) => setFiles(files.filter(f => f.id !== id))

  return (
    <div
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: tokens.color.base.white,
          borderRadius: tokens.radius.modal,
          border: `1px solid ${tokens.color.border}`,
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          width: 'calc(100% - 32px)',
          maxWidth: '680px',
          maxHeight: '82vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          fontFamily: tokens.typography.fontFamily.zh,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: `1px solid ${tokens.color.divider}` }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.primary, margin: 0 }}>校本资料库</h2>
            <p style={{ fontSize: '12px', color: tokens.color.text.tertiary, marginTop: '4px' }}>上传学校相关资料，AI 将参考这些文件生成更精准的内容</p>
          </div>
          <button
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: tokens.radius.buttonSm, border: 'none', backgroundColor: 'transparent', color: tokens.color.text.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = tokens.color.base.gray }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* 文件列表 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {files.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ fontSize: '13px', color: tokens.color.text.tertiary }}>暂无文件，请上传资料</p>
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: tokens.radius.card,
                    border: `1px solid ${tokens.color.border}`,
                    transition: 'background-color 0.1s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = tokens.color.base.gray }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    {file.type === 'pdf' || file.type === 'docx' || file.type === 'md'
                      ? <FileText size={18} style={{ color: FILE_ICON_COLOR[file.type], flexShrink: 0 }} />
                      : <File size={18} style={{ color: tokens.color.text.tertiary, flexShrink: 0 }} />
                    }
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: tokens.typography.weight.medium, color: tokens.color.text.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {file.name}
                      </p>
                      <p style={{ fontSize: '11px', color: tokens.color.text.tertiary, marginTop: '2px' }}>
                        {file.size} · {file.uploadDate}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(file.id)}
                    style={{ width: '30px', height: '30px', borderRadius: tokens.radius.buttonSm, border: 'none', backgroundColor: 'transparent', color: tokens.color.text.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s', marginLeft: '8px', flexShrink: 0 }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#FF3B30'; e.currentTarget.style.backgroundColor = '#FFF2F1' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = tokens.color.text.tertiary; e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部统计 */}
        <div style={{ padding: '12px 24px', borderTop: `1px solid ${tokens.color.divider}`, backgroundColor: tokens.color.base.gray }}>
          <p style={{ fontSize: '12px', color: tokens.color.text.tertiary }}>
            共 {files.length} 个文件 · AI 将在生成内容时自动参考这些资料
          </p>
        </div>

        {/* 右下角上传 FAB */}
        <Button
          variant="primary"
          style={{
            position: 'absolute', bottom: '20px', right: '20px',
            width: '48px', height: '48px', padding: 0,
            borderRadius: '50%',
            boxShadow: '0 4px 12px rgba(0,113,227,0.3)',
          }}
        >
          <Plus size={22} />
        </Button>
      </div>
    </div>
  )
}
