/**
 * 时政术语使用规范
 * 用于审核推文中政治术语的准确性和时效性
 * 请定期更新，确保与最新党的文件表述一致
 */

// ——— 必须使用准确全称的术语 ———
export interface RequiredTerm {
  /** 正确完整表述 */
  correct: string
  /** 禁止的简写/误写 */
  forbidden?: string[]
  /** 说明 */
  note?: string
}

export const REQUIRED_TERMS: RequiredTerm[] = [
  {
    correct: '习近平新时代中国特色社会主义思想',
    forbidden: ['习思想', '新思想'],
    note: '首次出现需用全称，同一文章再次出现可简称"习近平新时代中国特色社会主义思想"',
  },
  {
    correct: '中国式现代化',
    forbidden: [],
    note: '注意不要写成"中国特色现代化"',
  },
  {
    correct: '全面建设社会主义现代化国家',
    forbidden: ['建设现代化国家', '全面现代化'],
    note: '二十大后的标准表述',
  },
  {
    correct: '高质量发展',
    forbidden: ['高速发展'],
    note: '经济发展表述优先用"高质量发展"',
  },
  // 请继续补充……
]

// ——— 已过时/停用的表述 ———
export interface OutdatedTerm {
  /** 过时表述 */
  outdated: string
  /** 应替换为 */
  replacedBy: string
  /** 停用时间背景 */
  since?: string
}

export const OUTDATED_TERMS: OutdatedTerm[] = [
  {
    outdated: '四个全面',
    replacedBy: '请确认当前官方提法',
    since: '注意各阶段提法有所演变',
  },
  {
    outdated: '新冠肺炎',
    replacedBy: '新冠病毒感染',
    since: '2023年1月后官方调整表述',
  },
  // 请继续补充……
]

// ——— 高校宣传敏感事项 ———
export const SENSITIVE_TOPICS = [
  '未经核实的排名数据（需注明来源和年份）',
  '涉及港澳台表述需符合官方口径',
  '历史事件年份和人物须核实',
  '奖项/荣誉描述需附权威来源',
]
