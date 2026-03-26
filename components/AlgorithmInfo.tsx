'use client'

import { X, FileText } from 'lucide-react'
import { useState } from 'react'
import { tokens } from '@/lib/design-tokens'
import {
  CONTENT_TYPE_LABELS,
  CONTENT_TYPE_INSTRUCTIONS,
  WRITING_STYLE_LABELS,
  NODE_TYPE_CONTENT_SUGGESTIONS,
  STYLE_DESCRIPTIONS,
  type ContentType,
} from '@/lib/prompt-builder'
import { SCHOOL_PROFILES } from '@/data/school-profiles'
import { RECRUIT_NODES, FESTIVAL_NODES, CAMPUS_NODES } from '@/data/njnu-calendar'

// ── Tab 定义 ──────────────────────────────────────────────────

const TABS = [
  { key: 'overview',     label: '总体逻辑' },
  { key: 'role',         label: '① 角色声明' },
  { key: 'school',       label: '② 学校数据块' },
  { key: 'node',         label: '③ 节点/任务描述' },
  { key: 'contentType',  label: '④ 文章类型' },
  { key: 'style',        label: '⑤ 写手风格' },
  { key: 'hms',          label: '⑥ HMS规范底座' },
  { key: 'output',       label: '⑦ 输出格式' },
  { key: 'redline',      label: '⑧ 创作红线' },
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
              {activeTab === 'overview'     && <TabOverview />}
              {activeTab === 'role'         && <TabRole />}
              {activeTab === 'school'       && <TabSchool />}
              {activeTab === 'node'         && <TabNode />}
              {activeTab === 'contentType'  && <TabContentType />}
              {activeTab === 'style'        && <TabStyle />}
              {activeTab === 'hms'          && <TabHMS />}
              {activeTab === 'output'       && <TabOutput />}
              {activeTab === 'redline'      && <TabRedline />}
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
        <CodeBlock text={`每次 AI 生成 = ① 角色声明 + ② 学校数据块 + ③ 节点/任务描述 + ④ 文章类型指令 + ⑤ 写手风格 + ⑥ HMS规范底座 + ⑦ 输出格式 + ⑧ 创作红线

① 角色声明（所有入口共用同一条）
② 学校数据块（选中学校时自动注入完整内容：定位/宣传重点/禁区/标志元素/招生数据/王牌专业）
③ 节点/任务描述（根据触发入口不同而变化）
   节点配置面板   → 节点信息 + 节点类型专用块 + 节点强绑定要求
   节点卡片点击   → 节点信息 + 节点类型专用块 + 节点强绑定要求（无文章类型/写手风格）
   搜索框自由文本 → 用户输入的关键词
   全网热点       → 热点标题 + 来源 + 标签
   洞察参考他校   → 参考学校 + 参考标题
④ 文章类型专属指令（按选定类型注入，共8种：报考攻略/专业介绍/校园生活/新闻软化/故事共情/节气内容/热点借势/实用指南）
⑤ 写手风格描述（仅配置面板路径注入，共5种风格）
⑥ HMS规范底座（所有入口共用：HMS三维驱动力定义 + 标题创作要求）
⑦ 输出格式（所有入口统一：5-8条表格）
⑧ 创作红线（通用红线 + 各入口追加红线）`} />
      </DocSection>

      <DocSection title="两条路径">
        <CodeBlock text={`路径一：有配置面板（学校 + 节点 + 文章类型 + 写手风格 四项全选）
   SuperSearch 选好四项 → buildPromptByTable()
   按节点类型路由到三张专用函数：
     招生节点  → buildRecruitPrompt()  · 高考生/家长受众，不涉及考研
     节气节日  → buildFestivalPrompt() · 节气情感共鸣 + 节气语气约束
     校园节点  → buildCampusPrompt()   · 在校生/校友，校园归属感
   比路径二多：文章类型指令 + 写手风格描述 + 节点强绑定要求

路径二：直接触发（无需配置，适合快速探索）
   节点卡片点击  → buildNodeQuickPrompt()       · 按节点类型路由，有节点强绑定，无文章类型/写手风格
   搜索框输入    → buildFreeSearchPrompt()
   全网热点      → buildHotTopicPrompt()
   洞察参考他校  → buildInsightReferencePrompt()`} />
      </DocSection>
    </>
  )
}

// ── 提示词内容 Tab ────────────────────────────────────────────
// 展示每个板块的具体指令文本

function PromptLabel({ text }: { text: string }) {
  return (
    <div style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '6px',
      backgroundColor: '#EBF4FF',
      color: tokens.color.accent,
      fontSize: '11px',
      fontWeight: 600,
      marginBottom: '8px',
    }}>
      {text}
    </div>
  )
}

function TabRole() {
  return (
    <>
      <DocSection title="角色声明（所有入口共用同一条）">
        <CodeBlock text={`"## 角色与使命
你是一位拥有10年经验的高校新媒体首席内容官，擅长策划"现象级"校园软文。你深谙大学生、校友及家长的阅读心理，能够将枯燥的新闻资讯转化为具有情感温度、实用价值或幽默趣味的爆款内容。你的核心信条是：内容要么"对用户有用"，要么"让用户动心"，要么"让用户会心一笑"。"`} />
      </DocSection>
    </>
  )
}

function TabHMS() {
  return (
    <>
      <DocSection title="HMS 规范底座（所有入口共用）">
        <CodeBlock text={`"## HMS三维驱动模型
在构思选题时，必须严格遵循以下三个维度之一作为核心驱动力：

1. **让用户动心 (Emotional Resonance)**：触发集体记忆、身份认同或情感共鸣（如：乡愁、成长焦虑、师生情、校园独家记忆）。
2. **对用户有用 (Practical Utility)**：解决具体痛点，提供稀缺信息或生存指南（如：避坑指南、办事流程、升学就业干货）。
3. **让用户会心一笑 (Humor & Relatability)**：用自嘲、梗文化或反差萌解构严肃话题，拉近与年轻人的距离。

**重要原则**：拒绝拼盘（焦点只能一个）；拒绝套路（严禁套用固定模板）；逻辑自洽（情感升华需有合理依据）。

## 标题创作要求
- 标题必须符合微信生态，避免标题党，但要有点击欲（可使用疑问句、对话体、反差感）。
- 语气要年轻化、真诚，拒绝官腔。
- 必须结合当前的时间背景（如：AI普及后的学习变化、后疫情时代的社交习惯等）。
- 至少有一个选题采用强互动风格：用学生真实自称、反问、或"你 vs 我"的对话结构制造代入感，但句式必须原创，禁止套用已有爆款标题的固定格式（如"Are you X？I'm X"句型）。
- **句式强制多样**：8条方案中必须覆盖以下4种类型，每种至少1条：
  ①纯短句（10字以内，不含标点分割符）
  ②疑问句（以问号结尾）
  ③场景/细节切入句（从与节点直接相关的真实画面或具体动作开头，无冒号/逗号分割结构；禁止用与节点无关的泛化意象硬拼凑"X次""X年"等数字）
  ④人称自白体（以"我""你""我们"等人称开头）
- **禁止**：超过半数标题使用"X：X"或"X，X"的冒号/逗号分割结构；禁止标题中出现无意义的破折号连接；禁止复用节点数字衍生出无关量词（如节点是"高考倒计时200天"，禁止标题出现"200份""200个""200位"等与天数无关的变体）。`} />
      </DocSection>
    </>
  )
}

function TabOutput() {
  return (
    <>
      <DocSection title="输出格式（所有入口统一）">
        <PromptLabel text="所有入口共用，5-8 条" />
        <CodeBlock text={`"## 输出格式
请以表格形式输出 5-8 个选题方案，确保覆盖至少 3 种不同的 HMS 类型：

| 选题类别 | 建议标题（长短不一，句式各异） | 核心驱动 (H/M/S) | 内容切入角度（一句话故事线） | 预期传播点（用户为何转发） |
| :--- | :--- | :--- | :--- | :--- |"`} />
      </DocSection>
    </>
  )
}

function TabRedline() {
  return (
    <>
      <DocSection title="创作红线（通用 + 各入口追加）">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <PromptLabel text="通用红线（所有入口）" />
            <CodeBlock text={`"## 创作红线
- 禁止使用任何固定标题句式模板
- 禁止生成笼统、可被任意高校套用的选题
- 每个选题必须体现**{{学校名}}**的专属细节或IP
- 追求极致具体：人物、地点、时间都要落到实处"`} />
          </div>
          <div>
            <PromptLabel text="招生节点追加" />
            <CodeBlock text={`"- 不得出现考研、保研相关内容（受众是高考生/家长，非在校生）"`} />
          </div>
          <div>
            <PromptLabel text="节气/节日追加" />
            <CodeBlock text={`"- 禁止生成通用节日祝福文案，必须结合**{{学校名}}**的校园场景
- 严格遵守节点语气约束（如有）"`} />
          </div>
          <div>
            <PromptLabel text="热点借势追加" />
            <CodeBlock text={`"- 关联要巧妙自然，避免'尬蹭'"`} />
          </div>
          <div>
            <PromptLabel text="参考他校追加" />
            <CodeBlock text={`"- 绝对不能出现「{{参考学校名}}」或其他任何学校名称
- 每个方案需注明与参考文章的差异化点"`} />
          </div>
        </div>
      </DocSection>
    </>
  )
}

function TabSchool() {
  const tierLabel = (tier: string) =>
    tier === '985' ? '985工程' : tier === '211' ? '211工程' : tier === 'private' ? '民办本科' : tier === 'normal' ? '普通本科' : '高职专科'
  const featureLabel = (f: string) =>
    f === 'liberal-arts' ? '文科/师范' : f === 'engineering' ? '工科' : f === 'medical' ? '医科' : '综合'

  return (
    <>
      {SCHOOL_PROFILES.map(school => (
        <DocSection key={school.name} title={`${school.name}（${tierLabel(school.tier)} · ${featureLabel(school.feature)}）`}>
          <CodeBlock text={`## 学校背景
**学校**：${school.name}（${tierLabel(school.tier)}·${featureLabel(school.feature)}类）
**定位**：${school.positioning}

**本次宣传重点**（按优先级）：
${school.promotionFocus.map((f, i) => `${i + 1}. ${f}`).join('\n')}

**宣传禁区**（以下方向不适合该学校主打）：
${school.promotionAvoid.map(a => `- ${a}`).join('\n')}

**校园标志性元素**：${school.campusSymbols.join('、')}

## 可参考的学校数据
- 在校本科生规模：${school.admissionData.undergraduateCount}
- 主要生源省份：${school.admissionData.mainSourceProvinces.join('、')}
- 录取分数参考：${school.admissionData.scoreRange}${school.admissionData.postgraduateRate ? `\n- 深造/升学率：${school.admissionData.postgraduateRate}` : ''}
- 就业亮点：${school.employmentHighlight}

## 王牌专业数据
${school.flagshipMajors.map(m => `- **${m.name}**：${m.highlight}`).join('\n')}`} />
        </DocSection>
      ))}
    </>
  )
}

function TabNode() {
  const sections = [
    { label: '入口A：招生节点（buildRecruitPrompt）', nodes: RECRUIT_NODES },
    { label: '入口B：节气/节日节点（buildFestivalPrompt）', nodes: FESTIVAL_NODES },
    { label: '入口C：校园节点（buildCampusPrompt）', nodes: CAMPUS_NODES },
  ]
  return (
    <>
      <DocSection title="配置面板路径（入口A/B/C）">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <PromptLabel text="入口A：招生节点（buildRecruitPrompt）" />
            <CodeBlock text={`"## 当前招生节点
**节点**：{{节点标题}}（{{日期}}）
**说明**：{{节点背景描述}}
**可策划方向**：{{方向1}}、{{方向2}}、{{方向3}}
{{特别提示：如有学校专属提示则追加}}

## 节点强绑定要求
**当前核心节点是「{{节点标题}}」**，这是本次内容的唯一主题锚点。
- 所有选题必须以「{{节点标题}}」为核心，标题中必须体现这一时间节点
- 禁止生成虽然质量高但与「{{节点标题}}」无关的选题
- 禁止借用节点数字做其他引申
- 不得出现考研、保研相关内容"`} />
          </div>
          <div>
            <PromptLabel text="入口B：节气/节日节点（buildFestivalPrompt）" />
            <CodeBlock text={`"## 当前节气/节日节点
**节点**：{{节点标题}}（{{日期}}）
**说明**：{{节点背景描述}}
**可策划方向**：{{方向1}}、{{方向2}}
{{节点语气约束：清明/国家公祭日等特殊节点追加}}

## 校园场景素材
**学校**：{{学校名}}
**标志性元素**：{{地标1}}、{{地标2}}
**校园气质**：{{一句话定位}}

## 节点强绑定要求
所有选题必须以「{{节点标题}}」为主角，标题或内容必须体现节气。"`} />
          </div>
          <div>
            <PromptLabel text="入口C：校园节点（buildCampusPrompt）" />
            <CodeBlock text={`"## 当前校园节点
**节点**：{{节点标题}}（{{日期}}）
**说明**：{{节点背景描述}}
**可策划方向**：{{方向1}}、{{方向2}}
{{特别提示：如有学校专属提示则追加}}

## 节点强绑定要求
所有选题必须以「{{节点标题}}」为主角，标题或内容必须直接体现节点主题。"`} />
          </div>
        </div>
      </DocSection>

      <DocSection title="直接触发路径（入口D/E/F/G）">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <PromptLabel text="入口D：节点卡片直接点击（buildNodeQuickPrompt）" />
            <CodeBlock text={`按节点类型生成对应的节点块，与配置面板路径结构一致，区别在于不注入文章类型指令和写手风格。

招生节点时注入：
"## 当前招生节点
**节点**：{{节点标题}}（{{日期}}）
**说明**：{{节点背景描述}}
**可策划方向**：{{方向1}}、{{方向2}}、{{方向3}}
{{特别提示（如有）}}

## 节点强绑定要求
当前核心节点是「{{节点标题}}」，这是本次内容的唯一主题锚点。
- 所有选题必须以「{{节点标题}}」为核心
- 禁止生成虽然质量高但与节点无关的选题
- 禁止借用节点数字做其他引申"

节气/节日节点时注入：
"## 当前节气/节日节点
（同上结构，节点强绑定要求改为：所有选题必须以此节气/节日为主角）
{{节点语气约束（如有，如清明/国家公祭日等）}}"

校园节点时注入：
"## 当前校园节点
（同上结构，节点强绑定要求改为：标题或内容必须体现节点主题）"`} />
          </div>
          <div>
            <PromptLabel text="入口E：搜索框自由文本（buildFreeSearchPrompt）" />
            <CodeBlock text={`"## 本次探索方向
「{{用户输入的关键词或选题方向}}」

请围绕以上方向，为【{{学校名}}】生成 5-8 个具体的选题方案。
要求：必须站在【{{学校名}}】的视角，结合本校专属元素，不得出现其他学校名称。"`} />
          </div>
          <div>
            <PromptLabel text="入口F：全网热点借势（buildHotTopicPrompt）" />
            <CodeBlock text={`"## 当前热点
热点标题：「{{热点标题}}」
来源：{{来源平台}}　标签：{{标签1}}、{{标签2}}　热度：{{热度值}}

请借势这个热点，为【{{学校名}}】生成 5-8 个具体的选题方案。
要求：热点是外壳，内核必须是本校独有内容；不得出现其他学校名称。"`} />
          </div>
          <div>
            <PromptLabel text="入口G：洞察场域·参考他校（buildInsightReferencePrompt）" />
            <CodeBlock text={`"## 参考文章
参考学校：{{他校名称}}
参考标题：「{{他校文章标题}}」

请仅学习这篇文章的【选题角度、内容形式、情感切入方式】，
以【{{本校名}}】的视角，生成 5-8 个【{{本校名}}】自己的选题方案。

严格要求：
1. 所有标题和内容必须结合本校元素（地标、专业、宣传重点）
2. 绝对不能出现「{{他校名称}}」或其他任何学校名称
3. 每个方案需注明与参考文章的差异化点"`} />
          </div>
        </div>
      </DocSection>

      {sections.map(sec => (
        <DocSection key={sec.label} title={sec.label}>
          {sec.nodes.map(node => (
            <div key={node.id} style={{ marginBottom: '8px', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${tokens.color.divider}`, backgroundColor: tokens.color.base.gray }}>
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
      <DocSection title="文章类型列表与专属指令">
        {allTypes.map(type => (
          <div key={type} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: tokens.color.text.primary, margin: 0 }}>{CONTENT_TYPE_LABELS[type]}</p>
              <p style={{ fontSize: '11px', color: tokens.color.text.tertiary, margin: 0 }}>
                适用节点：{
                  (Object.entries(NODE_TYPE_CONTENT_SUGGESTIONS) as [string, ContentType[]][])
                    .filter(([, types]) => types.includes(type))
                    .map(([nodeType]) => nodeType)
                    .join('、') || '通用'
                }
              </p>
            </div>
            <CodeBlock text={CONTENT_TYPE_INSTRUCTIONS[type]} />
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

// ── 保留原默认导出（兼容其他引用）────────────────────────────

export default function AlgorithmInfo() {
  return null
}
