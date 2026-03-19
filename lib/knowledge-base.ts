import fs from 'fs'
import path from 'path'

/**
 * 读取校本知识库内容
 */
export function loadKnowledgeBase(): string {
  try {
    const knowledgeDir = path.join(process.cwd(), '校本资料库', '知识库')

    // 检查目录是否存在
    if (!fs.existsSync(knowledgeDir)) {
      console.warn('⚠️ 校本资料库目录不存在')
      return ''
    }

    const files = [
      '1-南师大校史.md',
      '2-南师大荣誉榜单.md',
      '3-南师大院系名录.md',
      '4-南师大常用金句集.md',
      '5-南师大就业去向.md',
      '6-南师大校园美景与节气表.md',
    ]

    let knowledgeContent = '## 南京师范大学校本资料库\n\n'

    for (const file of files) {
      const filePath = path.join(knowledgeDir, file)

      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8')
        knowledgeContent += content + '\n\n'
      } else {
        console.warn(`⚠️ 文件不存在: ${file}`)
      }
    }

    console.log('✅ 已加载校本知识库，总字符数:', knowledgeContent.length)
    return knowledgeContent

  } catch (error) {
    console.error('❌ 读取校本知识库失败:', error)
    return ''
  }
}

/**
 * 根据主题筛选相关知识（简单版关键词匹配）
 */
export function getRelevantKnowledge(topic: string): string {
  const fullKnowledge = loadKnowledgeBase()

  if (!fullKnowledge) {
    return ''
  }

  // 提取主题关键词
  const keywords = extractKeywords(topic)

  // 如果没有关键词，返回精简版
  if (keywords.length === 0) {
    return getEssentialKnowledge(fullKnowledge)
  }

  // 按关键词筛选相关段落
  const paragraphs = fullKnowledge.split('\n\n')
  const relevantParagraphs = paragraphs.filter(para =>
    keywords.some(keyword => para.includes(keyword))
  )

  // 如果筛选后内容太少，返回精简版
  if (relevantParagraphs.length < 3) {
    return getEssentialKnowledge(fullKnowledge)
  }

  const result = relevantParagraphs.join('\n\n')
  console.log(`📋 筛选相关知识，从 ${fullKnowledge.length} 字符减少到 ${result.length} 字符`)

  return result
}

/**
 * 提取主题中的关键词
 */
function extractKeywords(topic: string): string[] {
  const keywords: string[] = []

  // 主题类型关键词
  const topicMap: Record<string, string[]> = {
    '就业': ['就业', '招聘', '职业', '工作', '企业', '岗位'],
    '招生': ['招生', '录取', '专业', '院系', '高考', '分数'],
    '校史': ['历史', '校史', '建校', '发展', '传统'],
    '荣誉': ['荣誉', '排名', '获奖', '成就', '表彰'],
    '美景': ['美景', '风景', '校园', '建筑', '季节', '春', '夏', '秋', '冬'],
    '科研': ['科研', '研究', '学术', '论文', '成果'],
    '文化': ['文化', '传统', '精神', '校训'],
  }

  for (const [key, values] of Object.entries(topicMap)) {
    if (values.some(v => topic.includes(v))) {
      keywords.push(...values)
    }
  }

  return [...new Set(keywords)] // 去重
}

/**
 * 获取精简版知识（核心信息）
 */
function getEssentialKnowledge(fullKnowledge: string): string {
  // 提取每个文件的前 3 段内容作为精简版
  const sections = fullKnowledge.split('# ')
  const essential = sections
    .slice(1, 7) // 6个知识文件
    .map(section => {
      const paragraphs = section.split('\n\n')
      return '# ' + paragraphs.slice(0, 3).join('\n\n') // 每个文件取前3段
    })
    .join('\n\n')

  console.log(`📋 使用精简版知识，从 ${fullKnowledge.length} 字符减少到 ${essential.length} 字符`)
  return essential
}

/**
 * 将知识库内容格式化为 AI prompt
 */
export function formatKnowledgeForPrompt(knowledge: string): string {
  if (!knowledge) {
    return ''
  }

  return `

【校本资料库】
以下是南京师范大学的官方资料，请在生成标题时参考这些信息，确保内容准确、有据可依：

${knowledge}

请基于以上资料生成标题，可以引用具体数据、荣誉、特色等。
`
}
