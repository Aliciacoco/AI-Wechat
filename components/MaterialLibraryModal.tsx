'use client'

import { X, FileText, Trash2, File, Plus, ChevronRight, ArrowLeft } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { tokens } from '@/lib/design-tokens'
import { Button } from '@/components/ui'
import type { SchoolProfile } from '@/data/school-profiles'
import { NJNU_LEADERS } from '@/data/njnu-leaders'
import { SCHOOL_NAME, NJNU_DEPARTMENTS, CAMPUSES } from '@/data/njnu-names'
import { REQUIRED_TERMS, OUTDATED_TERMS, SENSITIVE_TOPICS } from '@/data/njnu-political-terms'
import { NUMERIC_RULES, TIME_RULES, PERSON_RULES, LOGIC_RULES } from '@/data/njnu-logic-rules'

// ── 预览内容生成 ────────────────────────────────────────────────

function buildLeadersPreview(): string {
  const lines = NJNU_LEADERS.map(l => `${l.title}：${l.name}`)
  return `南京师范大学现任领导名单\n（来源：南师大官网，2026年3月同步）\n\n${lines.join('\n')}`
}

function buildNamesPreview(): string {
  const deptLines = NJNU_DEPARTMENTS.map(d => {
    const wrong = d.wrongAlias?.length ? `  ✕ 误写：${d.wrongAlias.join('、')}` : ''
    return `• ${d.official}${wrong}`
  })
  return `学校名称\n全称：${SCHOOL_NAME.full}\n认可简称：${SCHOOL_NAME.approved.join('、')}\n禁止用法：${SCHOOL_NAME.forbidden.join('、')}\n英文：${SCHOOL_NAME.english}（${SCHOOL_NAME.englishAbbr}）\n\n校区\n${CAMPUSES.main.map(c => `• ${c.official}（${c.location}）`).join('\n')}\n\n二级学院官方名称\n${deptLines.join('\n')}`
}

function buildPoliticalPreview(): string {
  const required = REQUIRED_TERMS.map(t => `• ${t.correct}${t.forbidden?.length ? `\n  ✕ 禁用：${t.forbidden.join('、')}` : ''}${t.note ? `\n  说明：${t.note}` : ''}`).join('\n\n')
  const outdated = OUTDATED_TERMS.map(t => `• ${t.outdated} → ${t.replacedBy}${t.since ? `（${t.since}）` : ''}`).join('\n')
  const sensitive = SENSITIVE_TOPICS.map(s => `• ${s}`).join('\n')
  return `必须准确使用的术语\n\n${required}\n\n已过时/停用表述\n\n${outdated}\n\n宣传敏感事项\n\n${sensitive}`
}

function buildLogicPreview(): string {
  const sections = [
    { title: '数字/数据一致性', rules: NUMERIC_RULES },
    { title: '时间一致性', rules: TIME_RULES },
    { title: '人物信息一致性', rules: PERSON_RULES },
    { title: '逻辑关系', rules: LOGIC_RULES },
  ]
  return sections.map(s => `${s.title}\n${s.rules.map(r => `• ${r}`).join('\n')}`).join('\n\n')
}

// ── 文件类型定义 ─────────────────────────────────────────────────

interface MaterialFile {
  id: string
  name: string
  size: string
  type: string
  uploadDate: string
  reviewOnly?: boolean
  /** 所属学校，null = 通用 */
  schoolOnly?: string
  /** 预览内容（纯文本） */
  preview?: string
}

// ── 数据 ─────────────────────────────────────────────────────────

const REVIEW_FILES: MaterialFile[] = [
  // 南师大专属（领导、名称规范）
  {
    id: 'r1', name: '南师大现任领导名单.ts', size: '1.2 KB', type: 'ts',
    uploadDate: '2026-03-01', reviewOnly: true, schoolOnly: '南京师范大学',
    preview: buildLeadersPreview(),
  },
  {
    id: 'r2', name: '南师大官方名称规范.ts', size: '4.8 KB', type: 'ts',
    uploadDate: '2026-03-01', reviewOnly: true, schoolOnly: '南京师范大学',
    preview: buildNamesPreview(),
  },
  // 通用（时政术语、逻辑规则）
  {
    id: 'r3', name: '时政术语使用规范.ts', size: '2.1 KB', type: 'ts',
    uploadDate: '2026-03-01', reviewOnly: true,
    preview: buildPoliticalPreview(),
  },
  {
    id: 'r4', name: '逻辑一致性审核规则.ts', size: '1.4 KB', type: 'ts',
    uploadDate: '2026-03-01', reviewOnly: true,
    preview: buildLogicPreview(),
  },
]

const SCHOOL_FILES: Record<string, MaterialFile[]> = {
  '南京师范大学': [
    { id: '1', name: '2024年南京师范大学非江苏省招生计划表.pdf', size: '772 KB', type: 'pdf', uploadDate: '2024-03-19' },
    { id: '2', name: '2024年南京师范大学江苏省招生计划表.pdf', size: '784 KB', type: 'pdf', uploadDate: '2024-03-19' },
    { id: '3', name: '南京师范大学学校简介（数据截止0228）.docx', size: '17 KB', type: 'docx', uploadDate: '2024-03-19' },
    { id: '4', name: '南师大校史.md', size: '8 KB', type: 'md', uploadDate: '2024-03-19' },
    { id: '5', name: '南师大荣誉榜单.md', size: '12 KB', type: 'md', uploadDate: '2024-03-19' },
    { id: '6', name: '南师大院系名录.md', size: '15 KB', type: 'md', uploadDate: '2024-03-19' },
    { id: '7', name: '南师大常用金句集.md', size: '10 KB', type: 'md', uploadDate: '2024-03-19' },
    { id: '8', name: '南师大就业去向.md', size: '13 KB', type: 'md', uploadDate: '2024-03-19' },
    { id: '9', name: '南师大校园美景与节气表.md', size: '11 KB', type: 'md', uploadDate: '2024-03-19' },
  ],
}

const FILE_ICON_COLOR: Record<string, string> = {
  pdf: '#FF3B30',
  docx: '#0D99FF',
  md: '#34C759',
  ts: '#AF52DE',
}

// ── 主组件 ────────────────────────────────────────────────────────

interface MaterialLibraryModalProps {
  isOpen: boolean
  onClose: () => void
  currentSchool: SchoolProfile | null
}

export default function MaterialLibraryModal({ isOpen, onClose, currentSchool }: MaterialLibraryModalProps) {
  const [previewFile, setPreviewFile] = useState<MaterialFile | null>(null)

  const initialFiles = useMemo(() => {
    // 审核知识库：通用 + 当前学校专属
    const reviewFiles = REVIEW_FILES.filter(f =>
      !f.schoolOnly || f.schoolOnly === currentSchool?.name
    )
    const schoolFiles = currentSchool
      ? (SCHOOL_FILES[currentSchool.name] ?? [])
      : []
    return [...reviewFiles, ...schoolFiles]
  }, [currentSchool])

  const [files, setFiles] = useState<MaterialFile[]>(initialFiles)

  useEffect(() => {
    setFiles(initialFiles)
    setPreviewFile(null)
  }, [initialFiles])

  if (!isOpen) return null

  const handleDelete = (id: string) => {
    setFiles(files.filter(f => f.id !== id))
    if (previewFile?.id === id) setPreviewFile(null)
  }

  const title = currentSchool ? `${currentSchool.name} 资料库` : '资料库'
  const reviewFiles = files.filter(f => f.reviewOnly)
  const generalFiles = files.filter(f => !f.reviewOnly)

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
          maxWidth: previewFile ? '900px' : '680px',
          maxHeight: '82vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          fontFamily: tokens.typography.fontFamily.zh,
          transition: 'max-width 0.2s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: `1px solid ${tokens.color.divider}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {previewFile && (
              <button
                onClick={() => setPreviewFile(null)}
                style={{ width: '28px', height: '28px', borderRadius: tokens.radius.buttonSm, border: 'none', backgroundColor: tokens.color.base.gray, color: tokens.color.text.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <ArrowLeft size={14} />
              </button>
            )}
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: tokens.typography.weight.semibold, color: tokens.color.text.primary, margin: 0 }}>
                {previewFile ? previewFile.name : title}
              </h2>
              <p style={{ fontSize: '12px', color: tokens.color.text.tertiary, marginTop: '4px' }}>
                {previewFile ? '文件预览' : '上传学校相关资料，AI 将参考这些文件生成更精准的内容'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: tokens.radius.buttonSm, border: 'none', backgroundColor: 'transparent', color: tokens.color.text.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = tokens.color.base.gray }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* 主体：列表 + 预览双栏 */}
        <div style={{ flex: 1, overflowY: 'hidden', display: 'flex', minHeight: 0 }}>

          {/* 文件列表 */}
          <div style={{ flex: previewFile ? '0 0 300px' : '1', overflowY: 'auto', padding: '16px 24px', borderRight: previewFile ? `1px solid ${tokens.color.divider}` : 'none', transition: 'flex 0.2s' }}>
            {files.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <p style={{ fontSize: '13px', color: tokens.color.text.tertiary }}>暂无文件，请上传资料</p>
              </div>
            ) : (
              <div className="space-y-2">
                {/* 审核知识库 */}
                {reviewFiles.length > 0 && (
                  <>
                    <SectionLabel color="#AF52DE">审核知识库</SectionLabel>
                    {reviewFiles.map(file => (
                      <FileRow
                        key={file.id}
                        file={file}
                        isActive={previewFile?.id === file.id}
                        onPreview={setPreviewFile}
                        onDelete={handleDelete}
                      />
                    ))}
                  </>
                )}

                {/* 通用资料 */}
                {generalFiles.length > 0 && (
                  <>
                    <SectionLabel color={tokens.color.text.tertiary} style={{ marginTop: reviewFiles.length > 0 ? '14px' : '2px' }}>通用资料</SectionLabel>
                    {generalFiles.map(file => (
                      <FileRow
                        key={file.id}
                        file={file}
                        isActive={previewFile?.id === file.id}
                        onPreview={setPreviewFile}
                        onDelete={handleDelete}
                      />
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* 预览面板 */}
          {previewFile && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', minWidth: 0 }}>
              {previewFile.preview ? (
                <pre style={{
                  margin: 0,
                  fontSize: '12.5px',
                  lineHeight: '1.8',
                  color: tokens.color.text.secondary,
                  fontFamily: `'SF Mono', 'Fira Code', 'Menlo', monospace`,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {previewFile.preview}
                </pre>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
                  <FileText size={32} style={{ color: tokens.color.text.tertiary, opacity: 0.4 }} />
                  <p style={{ fontSize: '13px', color: tokens.color.text.tertiary, textAlign: 'center', lineHeight: '1.6' }}>
                    该文件暂无预览内容<br />请上传后查看
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 底部统计 */}
        <div style={{ padding: '12px 24px', borderTop: `1px solid ${tokens.color.divider}`, backgroundColor: tokens.color.base.gray, flexShrink: 0 }}>
          <p style={{ fontSize: '12px', color: tokens.color.text.tertiary }}>
            共 {files.length} 个文件 · AI 将在生成内容时自动参考这些资料
          </p>
        </div>

        {/* 上传 FAB（仅列表页显示） */}
        {!previewFile && (
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
        )}
      </div>
    </div>
  )
}

// ── 子组件 ─────────────────────────────────────────────────────────

function SectionLabel({ color, children, style }: { color: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ fontSize: '11px', fontWeight: tokens.typography.weight.medium, color, letterSpacing: '0.5px', marginBottom: '6px', marginTop: '2px', ...style }}>
      {children}
    </div>
  )
}

function FileRow({
  file, isActive, onPreview, onDelete,
}: {
  file: MaterialFile
  isActive: boolean
  onPreview: (f: MaterialFile) => void
  onDelete: (id: string) => void
}) {
  const iconColor = FILE_ICON_COLOR[file.type]
  const canPreview = !!file.preview

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 12px', borderRadius: tokens.radius.card,
        border: `1px solid ${isActive ? tokens.color.accent : tokens.color.border}`,
        backgroundColor: isActive ? '#EBF4FF' : 'transparent',
        transition: 'all 0.1s',
        cursor: canPreview ? 'pointer' : 'default',
      }}
      onClick={() => canPreview && onPreview(file)}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = tokens.color.base.gray }}
      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
        {iconColor
          ? <FileText size={16} style={{ color: iconColor, flexShrink: 0 }} />
          : <File size={16} style={{ color: tokens.color.text.tertiary, flexShrink: 0 }} />
        }
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <p style={{ fontSize: '13px', fontWeight: tokens.typography.weight.medium, color: isActive ? tokens.color.accent : tokens.color.text.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
              {file.name}
            </p>
            {file.reviewOnly && (
              <span style={{ fontSize: '10px', fontWeight: tokens.typography.weight.medium, color: '#AF52DE', backgroundColor: '#F5EEFF', padding: '1px 6px', borderRadius: '99px', flexShrink: 0 }}>
                审核
              </span>
            )}
            {file.schoolOnly && (
              <span style={{ fontSize: '10px', fontWeight: tokens.typography.weight.medium, color: tokens.color.accent, backgroundColor: '#EBF4FF', padding: '1px 6px', borderRadius: '99px', flexShrink: 0 }}>
                专属
              </span>
            )}
          </div>
          <p style={{ fontSize: '11px', color: tokens.color.text.tertiary, marginTop: '1px' }}>
            {file.size} · {file.uploadDate}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0, marginLeft: '6px' }}>
        {canPreview && (
          <span style={{ fontSize: '10px', color: isActive ? tokens.color.accent : tokens.color.text.tertiary, display: 'flex', alignItems: 'center' }}>
            <ChevronRight size={14} />
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(file.id) }}
          style={{ width: '28px', height: '28px', borderRadius: tokens.radius.buttonSm, border: 'none', backgroundColor: 'transparent', color: tokens.color.text.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#FF3B30'; e.currentTarget.style.backgroundColor = '#FFF2F1' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = tokens.color.text.tertiary; e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}
