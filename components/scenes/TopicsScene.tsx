'use client'

import { useState, useEffect, useMemo } from 'react'
import { TrendingUp, CalendarDays } from 'lucide-react'
import SuperSearch, { type PickerSelection } from '@/components/SuperSearch'
import HotTopicsPool from '@/components/HotTopicsPool'
import CalendarNodes from '@/components/CalendarNodes'
import AIGenerateModal from '@/components/AIGenerateModal'
import { PromptButton } from '@/components/AlgorithmInfo'
import {
  RECRUIT_NODES,
  FESTIVAL_NODES,
  CAMPUS_NODES,
  getUpcomingNodes,
  type CalendarNode,
} from '@/data/njnu-calendar'
import {
  buildPromptByTable,
  buildNodeQuickPrompt,
  buildFreeSearchPrompt,
  buildHotTopicPrompt,
  type NodeTable,
} from '@/lib/prompt-builder'
import { useScene } from '@/components/SceneProvider'

// 热点数据
const HOT_TOPICS = [
  { id: '1', title: '高校开学季：多所大学推出AI助手帮新生适应校园生活', source: '微博', heat: 98, tags: ['AI', '开学季', '校园生活'] },
  { id: '2', title: '师范类院校就业率持续走高，教育行业人才需求旺盛', source: '抖音', heat: 85, tags: ['就业', '师范', '教育'] },
  { id: '3', title: '秋日校园美景刷屏，多所高校晒出银杏大道', source: '小红书', heat: 92, tags: ['校园', '秋天', '美景'] },
  { id: '4', title: '大学生创新创业大赛启动，多个项目获千万级投资', source: '微信', heat: 76, tags: ['创业', '创新', '投资'] },
  { id: '5', title: '高校图书馆深夜亮灯，考研学子备战进入冲刺阶段', source: '微博', heat: 88, tags: ['考研', '学习', '图书馆'] },
  { id: '6', title: '名师开讲：如何在大学四年收获最大价值', source: '知乎', heat: 72, tags: ['教育', '成长', '导师'] },
]

const NODE_TABLES: { key: NodeTable; label: string; nodes: CalendarNode[] }[] = [
  { key: 'recruit',  label: '招生节点', nodes: RECRUIT_NODES },
  { key: 'festival', label: '节气节日', nodes: FESTIVAL_NODES },
  { key: 'campus',   label: '校园节点', nodes: CAMPUS_NODES },
]

export default function TopicsScene() {
  const [modalOpen, setModalOpen] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [displayTopic, setDisplayTopic] = useState('')

  // 日历卡片注入到 picker 的节点（仅搜索框四维路径使用）
  const [injectNode, setInjectNode] = useState<{ node: CalendarNode; table: NodeTable } | null>(null)

  // 近期节点（三表各取全部）
  const [upcomingNodes, setUpcomingNodes] = useState<Record<NodeTable, CalendarNode[]>>({
    recruit: [], festival: [], campus: [],
  })
  useEffect(() => {
    setUpcomingNodes({
      recruit:  getUpcomingNodes(RECRUIT_NODES,  new Date(), 999, 99),
      festival: getUpcomingNodes(FESTIVAL_NODES, new Date(), 999, 99),
      campus:   getUpcomingNodes(CAMPUS_NODES,   new Date(), 999, 99),
    })
  }, [])

  const { currentSchool } = useScene()

  // 节点过滤：按 currentSchool 的 incompatibleNodeIds 和 schoolOnly 过滤
  const filteredNodes = useMemo<Record<NodeTable, CalendarNode[]>>(() => {
    function filterNodes(nodes: CalendarNode[]): CalendarNode[] {
      return nodes.filter(node => {
        if (!currentSchool) {
          if (node.schoolOnly) return false
          if (node.tier985Only) return false
          return true
        }
        if (node.schoolOnly && node.schoolOnly !== currentSchool.name) return false
        if (node.tier985Only && currentSchool.tier !== '985') return false
        if (currentSchool.incompatibleNodeIds?.includes(node.id)) return false
        return true
      })
    }
    return {
      recruit:  filterNodes(upcomingNodes.recruit),
      festival: filterNodes(upcomingNodes.festival),
      campus:   filterNodes(upcomingNodes.campus),
    }
  }, [currentSchool, upcomingNodes])

  function openModal(prompt: string, label: string) {
    setCurrentPrompt(prompt)
    setDisplayTopic(label)
    setModalOpen(true)
  }

  // SuperSearch 提交
  const handleSearch = (query: string, selection: PickerSelection) => {
    // 四维完整（含学校）：走结构化 prompt
    if (selection.school && selection.node && selection.nodeTable && selection.contentType && selection.writingStyle) {
      const prompt = buildPromptByTable(selection.nodeTable, {
        school: selection.school,
        node: selection.node,
        contentType: selection.contentType,
        writingStyle: selection.writingStyle,
      })
      openModal(prompt, `${selection.school.name} · ${selection.node.title}`)
      return
    }
    // 有节点但无学校（全部学校状态）：用节点快速 prompt
    if (selection.node) {
      const table = selection.nodeTable ?? 'campus'
      openModal(buildNodeQuickPrompt(selection.node, table, currentSchool), `节点：${selection.node.title}`)
      return
    }
    // 自由文本搜索
    if (query) {
      openModal(buildFreeSearchPrompt(query, currentSchool), query)
    }
  }

  // 热点点击
  const handleHotTopic = (item: any) => {
    openModal(buildHotTopicPrompt(item, currentSchool), `热点：${item.title}`)
  }

  // 节点卡片「生成选题」：直接打开 AI 对话窗口
  const handleNodeGenerate = (node: CalendarNode) => {
    const table: NodeTable = RECRUIT_NODES.find(n => n.id === node.id) ? 'recruit'
      : FESTIVAL_NODES.find(n => n.id === node.id) ? 'festival'
      : 'campus'
    const prompt = buildNodeQuickPrompt(node, table, currentSchool)
    openModal(prompt, `节点：${node.title}`)
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-8" style={{ paddingTop: '48px', paddingBottom: '48px' }}>

        {/* 搜索框区域 */}
        <div style={{ maxWidth: '680px', margin: '0 auto 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
            <PromptButton />
          </div>
          <SuperSearch
            onSearch={handleSearch}
            injectNode={injectNode}
            onInjectConsumed={() => setInjectNode(null)}
          />
        </div>

        {/* 灵感池 - 两栏（全网热点 + 节点日历三列） */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', padding: '0 8px' }}>

          {/* 全网热点 */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={15} color="#86868B" />
              </div>
              <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>全网热点</h2>
            </div>
            <HotTopicsPool topics={HOT_TOPICS} onGenerateIdea={handleHotTopic} />
          </section>

          {/* 节点日历 - 三列直展示 */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarDays size={15} color="#86868B" />
              </div>
              <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>节点日历</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              {NODE_TABLES.map(table => (
                <div key={table.key}>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: '#86868B', marginBottom: '8px', letterSpacing: '0.3px' }}>
                    {table.label}
                  </div>
                  <CalendarNodes
                    nodes={filteredNodes[table.key]}
                    onGenerateIdea={handleNodeGenerate}
                  />
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      <AIGenerateModal isOpen={modalOpen} onClose={() => setModalOpen(false)} initialPrompt={currentPrompt} displayTopic={displayTopic} />
    </div>
  )
}
