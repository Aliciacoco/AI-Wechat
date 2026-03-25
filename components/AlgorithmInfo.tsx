'use client'

import { X, FileText } from 'lucide-react'
import { useState } from 'react'
import { tokens } from '@/lib/design-tokens'
import {
  CONTENT_TYPE_LABELS,
  WRITING_STYLE_LABELS,
  NODE_TYPE_CONTENT_SUGGESTIONS,
  STYLE_DESCRIPTIONS,
  NODE_TONE_CONSTRAINTS,
  type ContentType,
} from '@/lib/prompt-builder'
import { SCHOOL_PROFILES } from '@/data/school-profiles'
import { RECRUIT_NODES, FESTIVAL_NODES, CAMPUS_NODES } from '@/data/njnu-calendar'

// ── Tab 定义 ──────────────────────────────────────────────────

const TABS = [
  { key: 'overview',     label: '总体逻辑' },
  { key: 'school',       label: '学校维度' },
  { key: 'node',         label: '节点维度' },
  { key: 'contentType',  label: '文章类型' },
  { key: 'style',        label: '写手风格' },
  { key: 'constraint',   label: '节气约束' },
] as const

type TabKey = typeof TABS[number]['key']

// ── PromptButton ──────────────────────────────────────────────

export function PromptButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('overview')

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '0 10px', height: '34px',
          borderRadius: tokens.radius.button,
          border: `1px solid ${tokens.color.border}`,
          backgroundColor: 'transparent',
          color: tokens.color.text.tertiary,
          fontSize: '12px',
          fontFamily: tokens.typography.fontFamily.zh,
          cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = tokens.color.accent; e.currentTarget.style.color = tokens.color.accent; e.currentTarget.style.backgroundColor = '#EBF4FF' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = tokens.color.border; e.currentTarget.style.color = tokens.color.text.tertiary; e.currentTarget.style.backgroundColor = 'transparent' }}
      >
        <FileText size={12} />
        提示词文档
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setIsOpen(false)} />
          <div style={{
            position: 'relative',
            backgroundColor: tokens.color.base.white,
            borderRadius: tokens.radius.modal,
            border: `1px solid ${tokens.color.border}`,
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            width: 'calc(100% - 32px)',
            maxWidth: '780px',
            maxHeight: '85vh',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: tokens.typography.fontFamily.zh,
          }}>
            {/* 头部 */}
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${tokens.color.divider}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: tokens.color.text.primary, margin: 0 }}>提示词文档</p>
                <p style={{ fontSize: '12px', color: tokens.color.text.tertiary, margin: '2px 0 0' }}>产品所有提示词逻辑与内容，供业务人员查阅</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{ width: '28px', height: '28px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: tokens.color.text.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = tokens.color.base.gray }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Tab 栏 */}
            <div style={{ display: 'flex', gap: '2px', padding: '10px 20px', borderBottom: `1px solid ${tokens.color.divider}`, flexShrink: 0, overflowX: 'auto' }}>
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '5px 14px', borderRadius: '99px',
                    border: `1px solid ${activeTab === tab.key ? tokens.color.accent : 'transparent'}`,
                    backgroundColor: activeTab === tab.key ? '#EBF4FF' : 'transparent',
                    color: activeTab === tab.key ? tokens.color.accent : tokens.color.text.secondary,
                    fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap',
                    fontFamily: tokens.typography.fontFamily.zh,
                    transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => { if (activeTab !== tab.key) e.currentTarget.style.backgroundColor = tokens.color.base.gray }}
                  onMouseLeave={e => { if (activeTab !== tab.key) e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 内容 */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {activeTab === 'overview' && <TabOverview />}
              {activeTab === 'school' && <TabSchool />}
              {activeTab === 'node' && <TabNode />}
              {activeTab === 'contentType' && <TabContentType />}
              {activeTab === 'style' && <TabStyle />}
              {activeTab === 'constraint' && <TabConstraint />}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Tab 内容组件 ──────────────────────────────────────────────

function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <p style={{ fontSize: '11px', fontWeight: 600, color: tokens.color.text.tertiary, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>{title}</p>
      {children}
    </div>
  )
}

function CodeBlock({ text }: { text: string }) {
  return (
    <pre style={{
      fontSize: '12px', color: tokens.color.text.secondary,
      lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
      backgroundColor: tokens.color.base.gray,
      border: `1px solid ${tokens.color.divider}`,
      borderRadius: '10px', padding: '14px 16px', margin: 0,
      fontFamily: tokens.typography.fontFamily.zh,
    }}>
      {text.trim()}
    </pre>
  )
}

function TabOverview() {
  return (
    <>
      <DocSection title="提示词拼接结构">
        <CodeBlock text={`每次 AI 生成 = ① 学校数据块 + ② 任务描述 + ③ HMS规范底座

① 学校数据块（选中学校时自动注入）
   学校定位、宣传重点/禁区、校园标志性元素
   招生数据、王牌专业、就业亮点

② 任务描述（根据触发入口不同而变化）
   节点卡片直接点击  → 节点信息 + 节点类型
   搜索框自由文本    → 用户输入的关键词
   全网热点          → 热点标题 + 来源 + 标签
   洞察参考他校      → 参考学校 + 参考标题

③ HMS规范底座（所有入口共用）
   HMS三维驱动模型
   五类选题矩阵（新闻软化/招生种草/热点借势/实用指南/校园故事）
   标题创作要求（长短错落、句式多变）
   创作红线`} />
      </DocSection>

      <DocSection title="两条路径">
        <CodeBlock text={`路径一：有配置面板（学校 + 节点 + 文章类型 + 写手风格 四项全选）
   SuperSearch 选好四项 → buildPromptByTable()
   按节点类型路由到三张专用表：
     招生节点  → 高考生/家长受众，不涉及考研
     节气节日  → 节气情感共鸣 + 节点语气约束
     校园节点  → 在校生/校友，校园归属感
   比路径二多：写手风格描述 + 节点强绑定要求 + 语气约束

路径二：直接触发（无需配置，适合快速探索）
   节点卡片点击  → buildNodeQuickPrompt()
   搜索框输入    → buildFreeSearchPrompt()
   全网热点      → buildHotTopicPrompt()
   洞察参考他校  → buildInsightReferencePrompt()`} />
      </DocSection>

      <DocSection title="HMS 三维驱动模型（所有场景共用）">
        <CodeBlock text={`H（Heart）动心  — 连接情感，触发身份认同或集体记忆
M（Mind）有用   — 解决问题，提供具象、稀缺、可操作的信息
S（Smile）会心  — 创造愉悦，运用幽默、反差、梗文化

原则：每个选题有且仅有一个核心驱动维度，禁止拼盘`} />
      </DocSection>

      <DocSection title="标题创作要求（新增）">
        <CodeBlock text={`标题必须长短错落、句式多变：
- 短标题（6-10字）：一句话点破核心
- 中标题（11-16字）：有情境感
- 疑问/祈使句：制造对话感
- 口语化短句：像朋友说话
禁止：所有标题都用"xxx，xxx"或"xxx：xxx"切割句式`} />
      </DocSection>
    </>
  )
}

function TabSchool() {
  return (
    <>
      {SCHOOL_PROFILES.map(school => (
        <DocSection key={school.name} title={`${school.name}（${school.tier} · ${school.feature}）`}>
          <CodeBlock text={`定位：${school.positioning}

宣传重点（按优先级）：
${school.promotionFocus.map((f, i) => `${i + 1}. ${f}`).join('\n')}

宣传禁区：
${school.promotionAvoid.map(a => `- ${a}`).join('\n')}

推荐写手风格：${school.recommendedStyles.join('、')}
互斥节点：${school.incompatibleNodeIds?.length ? school.incompatibleNodeIds.join('、') : '无'}

王牌专业：
${school.flagshipMajors.map(m => `- ${m.name}：${m.highlight}`).join('\n')}

就业亮点：${school.employmentHighlight}
校园标志：${school.campusSymbols.join('、')}`} />
        </DocSection>
      ))}
    </>
  )
}

function TabNode() {
  const sections = [
    { label: '招生节点', nodes: RECRUIT_NODES },
    { label: '传统节气/节日', nodes: FESTIVAL_NODES },
    { label: '校园节点', nodes: CAMPUS_NODES },
  ]
  return (
    <>
      {sections.map(sec => (
        <DocSection key={sec.label} title={sec.label}>
          {sec.nodes.map(node => (
            <div key={node.id} style={{ marginBottom: '10px', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${tokens.color.divider}`, backgroundColor: tokens.color.base.gray }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: tokens.color.text.primary, margin: '0 0 4px' }}>{node.title} <span style={{ fontSize: '11px', fontWeight: 400, color: tokens.color.text.tertiary }}>（{node.date}）</span></p>
              <p style={{ fontSize: '12px', color: tokens.color.text.secondary, margin: '0 0 4px', lineHeight: 1.6 }}>{node.description}</p>
              <p style={{ fontSize: '11px', color: tokens.color.text.tertiary, margin: 0 }}>策划方向：{node.topics.join('、')}</p>
            </div>
          ))}
        </DocSection>
      ))}
    </>
  )
}

function TabContentType() {
  const allTypes = Object.keys(CONTENT_TYPE_LABELS) as ContentType[]
  return (
    <>
      <DocSection title="文章类型列表">
        {allTypes.map(type => (
          <div key={type} style={{ marginBottom: '8px', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${tokens.color.divider}`, backgroundColor: tokens.color.base.gray }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: tokens.color.text.primary, margin: '0 0 4px' }}>{CONTENT_TYPE_LABELS[type]}</p>
            <p style={{ fontSize: '11px', color: tokens.color.text.tertiary, margin: 0 }}>
              适用节点类型：{
                (Object.entries(NODE_TYPE_CONTENT_SUGGESTIONS) as [string, ContentType[]][])
                  .filter(([, types]) => types.includes(type))
                  .map(([nodeType]) => nodeType)
                  .join('、') || '通用'
              }
            </p>
          </div>
        ))}
      </DocSection>
    </>
  )
}

function TabStyle() {
  return (
    <>
      {(Object.entries(STYLE_DESCRIPTIONS) as [string, string][]).map(([key, desc]) => (
        <DocSection key={key} title={WRITING_STYLE_LABELS[key as keyof typeof WRITING_STYLE_LABELS] ?? key}>
          <CodeBlock text={desc} />
        </DocSection>
      ))}
    </>
  )
}

function TabConstraint() {
  const hasConstraints = Object.keys(NODE_TONE_CONSTRAINTS).length > 0
  return (
    <>
      <DocSection title="节点语气约束规则">
        {hasConstraints ? (
          (Object.entries(NODE_TONE_CONSTRAINTS) as [string, string][]).map(([nodeId, constraint]) => (
            <div key={nodeId} style={{ marginBottom: '12px' }}>
              <CodeBlock text={constraint} />
            </div>
          ))
        ) : (
          <p style={{ fontSize: '13px', color: tokens.color.text.tertiary }}>暂无约束规则</p>
        )}
      </DocSection>
      <DocSection title="互斥规则说明">
        <CodeBlock text={`学校与节点互斥：选定学校后，不适用的节点变灰不可选

民办本科（如金陵科技）互斥：
  - 强基计划招生简章（mar-qiangji）
  - 强基/专项录取·入学须知（aug-admission2）
  - 保研·升学季（nov-postgraduate）

普通本科·医科（如南京医科大）互斥：
  - 强基计划招生简章（mar-qiangji）
  - 强基/专项录取·入学须知（aug-admission2）

985 / 211 院校：无互斥节点`} />
      </DocSection>
    </>
  )
}

// ── 保留原默认导出（兼容其他引用）────────────────────────────

export default function AlgorithmInfo() {
  return null
}
