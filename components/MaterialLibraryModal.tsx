'use client'

import { X, Upload, FileText, Trash2, File, Plus } from 'lucide-react'
import { useState } from 'react'

interface MaterialFile {
  id: string
  name: string
  size: string
  type: string
  uploadDate: string
}

// 初始文件列表 - 从校本资料库文件夹读取
const INITIAL_FILES: MaterialFile[] = [
  {
    id: '1',
    name: '2024年南京师范大学非江苏省招生计划表.pdf',
    size: '772 KB',
    type: 'pdf',
    uploadDate: '2024-03-19',
  },
  {
    id: '2',
    name: '2024年南京师范大学江苏省招生计划表.pdf',
    size: '784 KB',
    type: 'pdf',
    uploadDate: '2024-03-19',
  },
  {
    id: '3',
    name: '南京师范大学学校简介（数据截止0228）.docx',
    size: '17 KB',
    type: 'docx',
    uploadDate: '2024-03-19',
  },
  {
    id: '4',
    name: '南师大校史.md',
    size: '8 KB',
    type: 'md',
    uploadDate: '2024-03-19',
  },
  {
    id: '5',
    name: '南师大荣誉榜单.md',
    size: '12 KB',
    type: 'md',
    uploadDate: '2024-03-19',
  },
  {
    id: '6',
    name: '南师大院系名录.md',
    size: '15 KB',
    type: 'md',
    uploadDate: '2024-03-19',
  },
  {
    id: '7',
    name: '南师大常用金句集.md',
    size: '10 KB',
    type: 'md',
    uploadDate: '2024-03-19',
  },
  {
    id: '8',
    name: '南师大就业去向.md',
    size: '13 KB',
    type: 'md',
    uploadDate: '2024-03-19',
  },
  {
    id: '9',
    name: '南师大校园美景与节气表.md',
    size: '11 KB',
    type: 'md',
    uploadDate: '2024-03-19',
  },
]

interface MaterialLibraryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MaterialLibraryModal({ isOpen, onClose }: MaterialLibraryModalProps) {
  const [files, setFiles] = useState<MaterialFile[]>(INITIAL_FILES)

  if (!isOpen) return null

  const handleDelete = (id: string) => {
    setFiles(files.filter(f => f.id !== id))
  }

  const getFileIcon = (type: string) => {
    if (type === 'pdf') {
      return <FileText size={20} style={{ color: 'var(--danger)' }} />
    } else if (type === 'md') {
      return <FileText size={20} style={{ color: '#58cc02' }} />
    } else if (type === 'docx') {
      return <FileText size={20} style={{ color: '#2b579a' }} />
    }
    return <File size={20} style={{ color: 'var(--primary)' }} />
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col relative"
        style={{ boxShadow: 'var(--shadow-lg)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
              校本资料库
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--foreground-tertiary)' }}>
              上传学校相关资料，AI 将参考这些文件生成更精准的内容
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all hover:bg-gray-100"
          >
            <X size={20} style={{ color: 'var(--foreground-secondary)' }} />
          </button>
        </div>

        {/* 文件列表 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {files.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm" style={{ color: 'var(--foreground-tertiary)' }}>
                  暂无文件，请上传资料
                </p>
              </div>
            ) : (
              files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:bg-gray-50"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate" style={{ color: 'var(--foreground)' }}>
                        {file.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs" style={{ color: 'var(--foreground-tertiary)' }}>
                          {file.size}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--foreground-tertiary)' }}>
                          {file.uploadDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-2 rounded-lg transition-all hover:bg-red-50 ml-2"
                  >
                    <Trash2 size={18} style={{ color: 'var(--danger)' }} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 底部统计 */}
        <div className="p-6 border-t bg-gray-50" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--foreground-tertiary)' }}>
            共 {files.length} 个文件 · AI 将在生成内容时自动参考这些资料
          </p>
        </div>

        {/* 右下角上传按钮 */}
        <button
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center transition-all border-b-4 shadow-lg"
          style={{
            backgroundColor: 'var(--primary)',
            borderBottomColor: 'var(--primary-hover)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(88, 204, 2, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'
          }}
        >
          <Plus size={28} className="text-white" />
        </button>
      </div>
    </div>
  )
}
