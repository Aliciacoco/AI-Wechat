/**
 * 结构化提示词拼装器 V3.0
 *
 * 有节点入口（三张专用表）：
 *   buildRecruitPrompt  —— 招生节点（高招受众，报考决策导向）
 *   buildFestivalPrompt —— 传统节气/节日（情感共鸣，节气约束）
 *   buildCampusPrompt   —— 校园节点（在校生/校友，校园生活）
 *   buildPromptByTable  —— 统一路由入口
 *
 * 无节点入口（共用 HMS_FRAMEWORK 底座）：
 *   buildNodeQuickPrompt      —— 节点卡片直接点击（无配置面板）
 *   buildFreeSearchPrompt     —— 搜索框自由文本
 *   buildHotTopicPrompt       —— 全网热点借势
 *   buildInsightReferencePrompt —— 洞察场域参考他校文章
 */

import type { SchoolProfile, WritingStyle } from '@/data/school-profiles'
import type { CalendarNode, CalendarNodeType } from '@/data/njnu-calendar'

// ── 内容类型定义 ────────────────────────────────────────────────

export type ContentType =
  | 'admission-guide'     // 报考攻略
  | 'major-intro'         // 专业介绍/种草
  | 'campus-life'         // 校园生活
  | 'news-soft'           // 新闻资讯软化
  | 'story-emotion'       // 故事共情
  | 'seasonal'            // 节气/季节
  | 'hotspot'             // 热点借势
  | 'practical-tips'      // 实用指南

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  'admission-guide': '报考攻略',
  'major-intro':     '专业介绍',
  'campus-life':     '校园生活',
  'news-soft':       '新闻软化',
  'story-emotion':   '故事共情',
  'seasonal':        '节气内容',
  'hotspot':         '热点借势',
  'practical-tips':  '实用指南',
}

export const WRITING_STYLE_LABELS: Record<WritingStyle, string> = {
  'warm-humanistic':   '温柔人文风',
  'rigorous-tech':     '严谨工科风',
  'professional-med':  '专业权威风',
  'vibrant-campus':    '活泼校媒风',
  'official-prestige': '权威官方风',
}

// ── 节点类型 → 推荐内容类型映射 ────────────────────────────────

export const NODE_TYPE_CONTENT_SUGGESTIONS: Record<CalendarNodeType, ContentType[]> = {
  recruit:  ['admission-guide', 'major-intro', 'practical-tips'],
  season:   ['seasonal', 'campus-life', 'story-emotion'],
  festival: ['story-emotion', 'hotspot', 'campus-life'],
  school:   ['news-soft', 'story-emotion', 'campus-life'],
  youth:    ['story-emotion', 'hotspot', 'practical-tips'],
}

// ── 文章类型专属指令 ─────────────────────────────────────────────
// 告诉 AI 每种内容类型下，输出选题时应有的侧重和结构要求

export const CONTENT_TYPE_INSTRUCTIONS: Record<ContentType, string> = {
  'admission-guide': `【内容类型：报考攻略】
- 选题须以「帮助考生做决策」为核心，提供具象可操作的信息
- 优先输出 M（有用）类选题：分数线解读、专业对比、志愿填报路径
- 内容切入角度要指向具体流程：如「第一步做什么、如何查、避哪些坑」
- 标题可用数字、步骤、清单感增强信任度`,

  'major-intro': `【内容类型：专业介绍】
- 选题须以「消除选专业的信息差」为核心，让考生和家长看清楚真实面貌
- 兼顾 M（有用）和 H（动心）：既有课表/出路等硬信息，也有在读生的真实感受
- 内容切入角度可以是：真实课程体验、就业方向地图、学长学姐的第一手反馈
- 避免官方套话，用具体数据和个人视角替代"实力雄厚"`,

  'campus-life': `【内容类型：校园生活】
- 选题须以「唤起归属感或代入感」为核心，目标受众是在校生/新生/校友
- 优先输出 H（动心）和 S（会心）类选题：真实场景、日常细节、共同记忆
- 内容切入角度要具体落地：某个时间点（凌晨图书馆）、某个地点（某栋楼）、某个小群体
- 标题要有画面感，禁止"多姿多彩的大学生活"这类虚词`,

  'news-soft': `【内容类型：新闻软化】
- 选题须把「官方事件」翻译成「普通人的故事」，一件事找一个人
- 优先输出 H（动心）类选题：从成就/政策/活动中找到受益个体的真实改变
- 内容切入角度要回答：这件事对一个普通学生的生活意味着什么？
- 标题禁止官方通稿句式（"圆满举行""积极推进"等）`,

  'story-emotion': `【内容类型：故事共情】
- 选题须以「发现平凡中的光辉」为核心，主角不必是学霸或明星
- 全部输出 H（动心）类选题：有具体人物、场景、转折，避免空泛赞美
- 内容切入角度要有一个戏剧性的细节或反转：她每天凌晨3点做同一件事
- 标题要像一个悬念，让人想知道"然后呢"`,

  'seasonal': `【内容类型：节气内容】
- 选题须将「节气文化」与「校园专属场景」有机融合，而非通用的节日海报
- 优先输出 H（动心）和 S（会心）类选题：节气意象在本校的具体呈现
- 内容切入角度可以是：节气与某个校园地标的关联、节气与某群学生的当下状态
- 语气和基调须严格遵守节点约束（如清明庄重、元旦温暖）`,

  'hotspot': `【内容类型：热点借势】
- 选题须让「社会热点」真正服务于本校内容，热点是外壳，本校是内核
- 优先输出 S（会心）和 H（动心）类选题：用本校视角重新诠释热点
- 内容切入角度：热点现象在本校有什么对应的真实场景？本校学生/老师有什么相关故事？
- 关联要巧妙自然，禁止强行蹭热度（如把无关热点强行扯到本校）`,

  'practical-tips': `【内容类型：实用指南】
- 选题须以「帮读者解决一个具体问题」为核心，达到"照着做就行"的程度
- 全部输出 M（有用）类选题：清单、教程、攻略、资源汇总
- 内容切入角度要锁定一个具体场景和人群：考研复试前夜、毕设最后一周、开学第一天
- 标题要直击焦虑，用数字、步骤、"保姆级"等词增强实用感`,
}

// ── 各写手风格的具体描述 ────────────────────────────────────────

const STYLE_DESCRIPTIONS: Record<WritingStyle, string> = {
  'warm-humanistic': `
【写手风格：温柔人文风】
核心气质：像一封写给老朋友的信，有温度、有细节、有留白。
- 语言：多用感官细节和场景还原（"那天下午图书馆的阳光斜进来""她低头看了很久那张录取通知书"），让读者身临其境
- 句式：善用短句停顿制造呼吸感，偶尔用反问引发共鸣（"你有没有过这样的时刻……"）
- 情感：只渲染，不煽情——描述细节，让读者自己动情，而非直接告诉读者"感动""催泪"
- 视角：始终以"人"为主角，一个具体的人、一个真实的瞬间，而非学校、政策、成就
- 禁忌：不用"感人肺腑""岁月峥嵘""满怀期待"等套话；不写宏大叙事；不在文末硬升华`,

  'rigorous-tech': `
【写手风格：严谨工科风】
核心气质：用数据和逻辑说话，让理工科学生觉得"这是自己人写的"。
- 语言：简洁精准，每句话都有信息量，拒绝冗余修饰；数字必须具体（不是"很多"，是"83%""第3名""平均薪资18k"）
- 结构：偏好"问题—分析—结论"或"现象—原因—解法"的清晰逻辑链
- 视角：强调可验证的成果（竞赛获奖、专利数量、就业去向）而非情感体验
- 语气：客观、克制，偶尔用幽默但不靠段子；可以直接、甚至略带挑战性（"你以为工科只是做题？"）
- 禁忌：不堆砌形容词；不用感性词汇作主卖点；不写没有依据的"强大""顶尖"`,

  'professional-med': `
【写手风格：专业权威风】
核心气质：像一位顶级医院的资深医生在向你介绍这个行业——权威、克制、但让你信服。
- 语言：专业术语使用准确，不解释基础概念（默认读者有一定医学常识）；措辞严谨，不随意使用"最好""第一"等极端表述
- 结构：强调临床资源、导师资质、科研平台、规培政策等硬核信息，用事实建立可信度
- 视角：既有职业高度（医生的社会责任、学科使命），也有现实诚实（规培年限、工作强度不回避）
- 语气：沉稳、有分量，每一句话都像经过仔细斟酌；适当时可用医学比喻，但不卖弄
- 禁忌：不夸大薪资前景；不用"温暖""感动"等情感化表达；不写空洞的"救死扶伤"口号`,

  'vibrant-campus': `
【写手风格：活泼校媒风】
核心气质：像学校里最受欢迎的学生记者写的——有网感、有态度、接地气。
- 语言：年轻化口语，可使用当下流行表达（但不强行堆梗），语速感要快，读起来轻盈
- 节奏：短段落、多换行、善用破折号和省略号制造停顿；一段不超过3句话
- 视角：以"我们"或"你"为主语，讲真实体验，不端着；可以自嘲、可以吐槽，但要有爱
- 互动感：善用反问、选择题式开头（"你是哪种宿舍类型？"）、或制造"就是在说你"的代入感
- 禁忌：不写官方通稿语气；不堆砌"历史悠久""办学实力"；不用超过15字的长句作标题`,

  'official-prestige': `
【写手风格：权威官方风】
核心气质：像顶尖高校官微在重要节点发布的内容——大气、有格局、自带分量。
- 语言：严肃精炼，每句话都经得起推敲；用词考究，有历史感和厚重感（但不是文言文）
- 视角：从国家战略、学科引领、人才使命的高度切入，体现高校的社会责任与文化自信
- 结构：逻辑严密，事实+数据+权威佐证，不靠情绪，靠底气
- 语气：自信而不傲慢，引领而不说教；适当时可用排比或对仗增加气势
- 禁忌：不娱乐化；不用"戳进来""快来看"等促销式表达；不写口水话；不堆砌感叹号`,
}

// ── 节点内容约束（清明不能活泼等）────────────────────────────

const NODE_TONE_CONSTRAINTS: Record<string, string> = {
  'apr-qingming': `
【节点语气约束：清明节】
- 必须保持庄重、肃穆的整体基调
- 可选方向1：缅怀先贤，结合校史人物
- 可选方向2：踏青赏春，但语气宜淡雅，不能欢快跳跃
- 严禁：活泼语气、段子类标题、轻浮表达`,

  'dec-memorial': `
【节点语气约束：国家公祭日】
- 必须保持高度庄重，这是南京高校最特殊的历史节点
- 主题必须围绕"铭记历史、勿忘国殇"
- 严禁：任何轻松、娱乐化的内容`,

  'jan-newyear': `
【节点语气约束：元旦】
- 语气可以喜庆、充满希望，但避免过度狂欢
- 官方号元旦内容宜有一定的格调和高度`,

  'may-laborday': `
【节点语气约束：五一劳动节】
- 可轻松活泼，但不能只是节日打卡，需有一定内容厚度`,

  'sep-anniversary': `
【节点语气约束：南师大校庆日·教师节】
- 双节叠加，情感浓度高，适合深度情感内容
- 应当温暖、有历史感，兼顾对教师的致敬和对校园的眷恋`,
}

// ── 共用规范底座：HMS模型 + 5类选题矩阵 ─────────────────────
// 供所有入口引用，保证规范统一

const HMS_FRAMEWORK = `## HMS三维驱动模型
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
- **禁止**：超过半数标题使用"X：X"或"X，X"的冒号/逗号分割结构；禁止标题中出现无意义的破折号连接；禁止复用节点数字衍生出无关量词（如节点是"高考倒计时200天"，禁止标题出现"200份""200个""200位"等与天数无关的变体）。`

// ── 学校数据块（所有入口共用完整版）───────────────────────────

function buildSchoolBlock(school: SchoolProfile): string {
  const tierLabel = school.tier === '985' ? '985工程' : school.tier === '211' ? '211工程' : school.tier === 'private' ? '民办本科' : school.tier === 'normal' ? '普通本科' : '高职专科'
  const featureLabel = school.feature === 'liberal-arts' ? '文科/师范' : school.feature === 'engineering' ? '工科' : school.feature === 'medical' ? '医科' : '综合'
  return `## 学校背景
**学校**：${school.name}（${tierLabel}·${featureLabel}类）
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
${school.flagshipMajors.map(m => `- **${m.name}**：${m.highlight}`).join('\n')}`
}

// ── 主拼装函数（有节点 + 写手风格 + 配置面板路径）────────────

export interface PromptBuildParams {
  school: SchoolProfile
  node: CalendarNode
  contentType: ContentType
  writingStyle: WritingStyle
}

export function buildStructuredPrompt(params: PromptBuildParams): string {
  const { school, node, contentType, writingStyle } = params

  const contentTypeLabel = CONTENT_TYPE_LABELS[contentType]
  const styleDesc = STYLE_DESCRIPTIONS[writingStyle]
  const toneConstraint = NODE_TONE_CONSTRAINTS[node.id] ?? ''

  // 学校定位模块
  const schoolModule = `
## 学校背景
**学校**：${school.name}（${school.tier === '985' ? '985工程' : school.tier === '211' ? '211工程' : school.tier === 'private' ? '民办本科' : school.tier === 'normal' ? '普通本科' : '高职专科'}·${school.feature === 'liberal-arts' ? '文科/师范' : school.feature === 'engineering' ? '工科' : school.feature === 'medical' ? '医科' : '综合'}类）
**定位**：${school.positioning}

**本次宣传重点**（按优先级）：
${school.promotionFocus.map((f, i) => `${i + 1}. ${f}`).join('\n')}

**宣传禁区**（以下方向不适合该学校主打）：
${school.promotionAvoid.map(a => `- ${a}`).join('\n')}

**校园标志性元素**：${school.campusSymbols.join('、')}
`.trim()

  // 招生数据模块
  const admissionModule = `
## 可参考的学校数据
- 在校本科生规模：${school.admissionData.undergraduateCount}
- 主要生源省份：${school.admissionData.mainSourceProvinces.join('、')}
- 录取分数参考：${school.admissionData.scoreRange}
${school.admissionData.postgraduateRate ? `- 深造/升学率：${school.admissionData.postgraduateRate}` : ''}
- 就业亮点：${school.employmentHighlight}
`.trim()

  // 王牌专业模块（仅专业介绍类内容时详细展开）
  const majorModule = (contentType === 'major-intro' || contentType === 'admission-guide')
    ? `
## 王牌专业数据
${school.flagshipMajors.map(m => `- **${m.name}**：${m.highlight}`).join('\n')}
`.trim()
    : ''

  // 节点信息模块
  const specialHint = school.specialNodeHints?.[node.id]
    ? `\n**特别提示**：${school.specialNodeHints[node.id]}`
    : ''

  const nodeModule = `
## 当前宣传节点
**节点名称**：${node.title}
**节点时间**：${node.date}
**节点类型**：${node.type}
**节点说明**：${node.description}
**可策划方向**：${node.topics.join('、')}${specialHint}
`.trim()

  // 节气/节日语气约束
  const toneModule = toneConstraint
    ? `\n${toneConstraint.trim()}`
    : ''

  return `# 高校新媒体现象级选题策划（结构化规范 V3.0）

## 角色与使命
你是一位拥有10年经验的高校新媒体首席内容官，擅长策划"现象级"校园软文。你深谙大学生、校友及家长的阅读心理，能够将枯燥的新闻资讯转化为具有情感温度、实用价值或幽默趣味的爆款内容。你的核心信条是：内容要么"对用户有用"，要么"让用户动心"，要么"让用户会心一笑"。

${schoolModule}

${nodeModule}

${admissionModule}

${majorModule ? majorModule + '\n\n' : ''}${styleDesc.trim()}
${toneModule}

${CONTENT_TYPE_INSTRUCTIONS[contentType]}

${HMS_FRAMEWORK}

## 输出格式
请以表格形式输出 5-8 个选题方案，确保覆盖至少 3 种不同的 HMS 类型：

| 选题类别 | 建议标题（长短不一，句式各异） | 核心驱动 (H/M/S) | 内容切入角度（一句话故事线） | 预期传播点（用户为何转发） |
| :--- | :--- | :--- | :--- | :--- |

## 创作红线
- 禁止使用任何固定标题句式模板
- 禁止生成笼统、可被任意高校套用的选题
- 每个选题必须体现**${school.name}**的专属细节或IP
- 追求极致具体：人物、地点、时间都要落到实处`
}

/**
 * 用于「提示词预览」按钮展示的简化版本（隐藏数据明细，只展示结构）
 */
export function buildPromptPreview(params: PromptBuildParams): string {
  const { school, node, contentType, writingStyle } = params
  return [
    `学校：${school.name}（${school.tier}·${school.feature}）`,
    `节点：${node.title}（${node.date}）`,
    `内容类型：${CONTENT_TYPE_LABELS[contentType]}`,
    `写手风格：${WRITING_STYLE_LABELS[writingStyle]}`,
    `节点语气约束：${NODE_TONE_CONSTRAINTS[node.id] ? '有' : '无'}`,
    `学校定位重点：${school.promotionFocus[0]}...`,
  ].join('\n')
}

// ── 招生节点专用 builder ─────────────────────────────────────
// 受众：高考生、家长
// 重点：报考决策、专业数据、志愿填报；不涉及考研

export function buildRecruitPrompt(params: PromptBuildParams): string {
  const { school, node, contentType, writingStyle } = params
  const contentTypeLabel = CONTENT_TYPE_LABELS[contentType]
  const styleDesc = STYLE_DESCRIPTIONS[writingStyle]

  const schoolModule = `
## 学校背景
**学校**：${school.name}（${school.tier === '985' ? '985工程' : school.tier === '211' ? '211工程' : school.tier === 'private' ? '民办本科' : school.tier === 'normal' ? '普通本科' : '高职专科'}·${school.feature === 'liberal-arts' ? '文科/师范' : school.feature === 'engineering' ? '工科' : school.feature === 'medical' ? '医科' : '综合'}类）
**定位**：${school.positioning}

**招生宣传重点**（按优先级）：
${school.promotionFocus.map((f, i) => `${i + 1}. ${f}`).join('\n')}

**宣传禁区**：
${school.promotionAvoid.map(a => `- ${a}`).join('\n')}`.trim()

  const admissionModule = `
## 招生数据参考
- 在校本科生规模：${school.admissionData.undergraduateCount}
- 主要生源省份：${school.admissionData.mainSourceProvinces.join('、')}
- 录取分数参考：${school.admissionData.scoreRange}
- 就业亮点：${school.employmentHighlight}`.trim()

  const majorModule = (contentType === 'major-intro' || contentType === 'admission-guide')
    ? `\n## 王牌专业数据\n${school.flagshipMajors.map(m => `- **${m.name}**：${m.highlight}`).join('\n')}`
    : ''

  const specialHint = school.specialNodeHints?.[node.id]
    ? `\n**特别提示**：${school.specialNodeHints[node.id]}`
    : ''

  const nodeModule = `
## 当前招生节点
**节点**：${node.title}（${node.date}）
**说明**：${node.description}
**可策划方向**：${node.topics.join('、')}${specialHint}`.trim()

  return `# 高校招生新媒体选题策划（招生节点专用）

## 角色与使命
你是一位拥有10年经验的高校新媒体首席内容官，擅长策划"现象级"校园软文。你深谙大学生、校友及家长的阅读心理，能够将枯燥的新闻资讯转化为具有情感温度、实用价值或幽默趣味的爆款内容。你的核心信条是：内容要么"对用户有用"，要么"让用户动心"，要么"让用户会心一笑"。

${schoolModule}

${nodeModule}

${admissionModule}
${majorModule}

${styleDesc.trim()}

${CONTENT_TYPE_INSTRUCTIONS[contentType]}

${HMS_FRAMEWORK}

## 节点强绑定要求
**当前核心节点是「${node.title}」**，这是本次内容的唯一主题锚点。
- 所有选题必须以「${node.title}」为核心，标题中必须体现这一时间节点或与之直接相关的概念
- 禁止生成虽然质量高但与「${node.title}」无关的选题
- 禁止借用节点数字做其他引申（例如用"100天"引申为"随园100天能发生什么"）

## 输出格式
请以表格形式输出 5-8 个选题方案，确保覆盖至少 3 种不同的 HMS 类型：

| 选题类别 | 建议标题（长短不一，句式各异） | 核心驱动 (H/M/S) | 内容切入角度（一句话故事线） | 预期传播点（用户为何转发） |
| :--- | :--- | :--- | :--- | :--- |

## 创作红线
- 禁止生成笼统、可被任意高校套用的选题
- 每个选题必须体现**${school.name}**的专属细节
- 追求极致具体：专业名称、数据、地点都要落到实处
- 不得出现考研、保研相关内容`
}

// ── 传统节气/节日专用 builder ────────────────────────────────
// 受众：在校生、校友、社会大众
// 重点：节气情感共鸣，结合校园场景，受节气语气约束

export function buildFestivalPrompt(params: PromptBuildParams): string {
  const { school, node, contentType, writingStyle } = params
  const styleDesc = STYLE_DESCRIPTIONS[writingStyle]
  const toneConstraint = NODE_TONE_CONSTRAINTS[node.id] ?? ''

  const nodeModule = `
## 当前节气/节日节点
**节点**：${node.title}（${node.date}）
**说明**：${node.description}
**可策划方向**：${node.topics.join('、')}`.trim()

  const toneModule = toneConstraint ? `\n${toneConstraint.trim()}` : ''

  const campusModule = `
## 校园场景素材
**学校**：${school.name}
**标志性元素**：${school.campusSymbols.join('、')}
**校园气质**：${school.positioning}`.trim()

  return `# 高校节气/节日新媒体选题策划

## 角色与使命
你是一位拥有10年经验的高校新媒体首席内容官，擅长策划"现象级"校园软文。你深谙大学生、校友及家长的阅读心理，能够将枯燥的新闻资讯转化为具有情感温度、实用价值或幽默趣味的爆款内容。你的核心信条是：内容要么"对用户有用"，要么"让用户动心"，要么"让用户会心一笑"。

${nodeModule}
${toneModule}

${campusModule}

${styleDesc.trim()}

${CONTENT_TYPE_INSTRUCTIONS[contentType]}

${HMS_FRAMEWORK}

## 节点强绑定要求
**当前核心节点是「${node.title}」**，所有选题必须以此节气/节日为主角。
- 标题或内容必须体现「${node.title}」，禁止借节点氛围生成与之无关的校园内容

## 输出格式
请以表格形式输出 5-8 个选题方案，确保覆盖至少 3 种不同的 HMS 类型：

| 选题类别 | 建议标题（长短不一，句式各异） | 核心驱动 (H/M/S) | 内容切入角度（一句话故事线） | 预期传播点（用户为何转发） |
| :--- | :--- | :--- | :--- | :--- |

## 创作红线
- 禁止生成通用节日祝福文案，必须结合**${school.name}**的校园场景
- 严格遵守节点语气约束（如有）
- 每个选题必须有校园专属细节`
}

// ── 校园节点专用 builder ─────────────────────────────────────
// 受众：在校生、新生、校友
// 重点：校园生活、师生情感、学校荣誉；有归属感

export function buildCampusPrompt(params: PromptBuildParams): string {
  const { school, node, contentType, writingStyle } = params
  const styleDesc = STYLE_DESCRIPTIONS[writingStyle]
  const specialHint = school.specialNodeHints?.[node.id]
    ? `\n**特别提示**：${school.specialNodeHints[node.id]}`
    : ''

  const nodeModule = `
## 当前校园节点
**节点**：${node.title}（${node.date}）
**说明**：${node.description}
**可策划方向**：${node.topics.join('、')}${specialHint}`.trim()

  const schoolModule = `
## 学校背景
**学校**：${school.name}
**校园气质**：${school.positioning}
**标志性元素**：${school.campusSymbols.join('、')}`.trim()

  return `# 高校校园新媒体选题策划（校园节点专用）

## 角色与使命
你是一位拥有10年经验的高校新媒体首席内容官，擅长策划"现象级"校园软文。你深谙大学生、校友及家长的阅读心理，能够将枯燥的新闻资讯转化为具有情感温度、实用价值或幽默趣味的爆款内容。你的核心信条是：内容要么"对用户有用"，要么"让用户动心"，要么"让用户会心一笑"。

${nodeModule}

${schoolModule}

${styleDesc.trim()}

${CONTENT_TYPE_INSTRUCTIONS[contentType]}

${HMS_FRAMEWORK}

## 节点强绑定要求
**当前核心节点是「${node.title}」**，所有选题必须以此为主角。
- 标题或内容必须直接体现「${node.title}」，禁止生成与节点无关的校园内容

## 输出格式
请以表格形式输出 5-8 个选题方案，确保覆盖至少 3 种不同的 HMS 类型：

| 选题类别 | 建议标题（长短不一，句式各异） | 核心驱动 (H/M/S) | 内容切入角度（一句话故事线） | 预期传播点（用户为何转发） |
| :--- | :--- | :--- | :--- | :--- |

## 创作红线
- 禁止生成笼统的校园宣传稿
- 每个选题必须体现**${school.name}**的专属细节或IP
- 追求极致具体：人物、地点、时间都要落到实处`
}

// ── 统一路由入口（按节点类型自动选择 builder）────────────────

export type NodeTable = 'recruit' | 'festival' | 'campus'

export function buildPromptByTable(table: NodeTable, params: PromptBuildParams): string {
  if (table === 'recruit') return buildRecruitPrompt(params)
  if (table === 'festival') return buildFestivalPrompt(params)
  return buildCampusPrompt(params)
}

// ── 节点快速生成（无配置面板，直接点击节点卡片）────────────

export function buildNodeQuickPrompt(
  node: CalendarNode,
  table: NodeTable,
  school: SchoolProfile | null
): string {
  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
  const schoolName = school?.name ?? '一所综合性大学'
  const toneConstraint = NODE_TONE_CONSTRAINTS[node.id] ? `\n${NODE_TONE_CONSTRAINTS[node.id].trim()}` : ''
  const specialHint = school?.specialNodeHints?.[node.id] ? `\n**特别提示**：${school.specialNodeHints[node.id]}` : ''
  const schoolBlock = school ? `\n${buildSchoolBlock(school)}\n` : ''

  const nodeTypeLabel = table === 'recruit' ? '招生节点' : table === 'festival' ? '节气/节日节点' : '校园节点'
  const nodeSectionTitle = table === 'recruit' ? '当前招生节点' : table === 'festival' ? '当前节气/节日节点' : '当前校园节点'

  const nodeModule = `## ${nodeSectionTitle}
**节点**：${node.title}（${node.date}）
**说明**：${node.description}
**可策划方向**：${node.topics.join('、')}${specialHint}${toneConstraint}`

  const bindingRequirement = table === 'recruit'
    ? `## 节点强绑定要求
**当前核心节点是「${node.title}」**，这是本次内容的唯一主题锚点。
- 所有选题必须以「${node.title}」为核心，标题中必须体现这一时间节点或与之直接相关的概念
- 禁止生成虽然质量高但与「${node.title}」无关的选题
- 禁止借用节点数字做其他引申`
    : `## 节点强绑定要求
**当前核心节点是「${node.title}」**，所有选题必须以此${nodeTypeLabel}为主角。
- 标题或内容必须体现「${node.title}」，禁止生成与节点无关的内容`

  const recruitRedline = table === 'recruit' ? '\n- 不得出现考研、保研相关内容' : ''
  const festivalRedline = table === 'festival' ? '\n- 禁止生成通用节日祝福文案，必须结合本校校园场景\n- 严格遵守节点语气约束（如有）' : ''

  return `# 高校新媒体选题策划（节点灵感）

## 角色与使命
你是一位拥有10年经验的高校新媒体首席内容官，擅长策划"现象级"校园软文。你深谙大学生、校友及家长的阅读心理，能够将枯燥的新闻资讯转化为具有情感温度、实用价值或幽默趣味的爆款内容。你的核心信条是：内容要么"对用户有用"，要么"让用户动心"，要么"让用户会心一笑"。当前日期：${today}。
${schoolBlock}
${nodeModule}

${HMS_FRAMEWORK}

${bindingRequirement}

## 输出格式
请以表格形式输出 5-8 个选题方案，确保覆盖至少 3 种不同的 HMS 类型：

| 选题类别 | 建议标题（长短不一，句式各异） | 核心驱动 (H/M/S) | 内容切入角度（一句话故事线） | 预期传播点（用户为何转发） |
| :--- | :--- | :--- | :--- | :--- |

## 创作红线
- 禁止生成笼统、可被任意高校套用的选题
- 每个选题必须体现**${schoolName}**的专属细节或IP
- 追求极致具体：人物、地点、时间都要落到实处${recruitRedline}${festivalRedline}`
}

// ── 自由文本搜索 ─────────────────────────────────────────────

export function buildFreeSearchPrompt(
  query: string,
  school: SchoolProfile | null
): string {
  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
  const schoolName = school?.name ?? '一所综合性大学'
  const schoolBlock = school ? `\n${buildSchoolBlock(school)}\n` : ''

  return `# 高校新媒体选题策划（自由探索）

## 角色与使命
你是一位拥有10年经验的高校新媒体首席内容官，擅长策划"现象级"校园软文。你深谙大学生、校友及家长的阅读心理，能够将枯燥的新闻资讯转化为具有情感温度、实用价值或幽默趣味的爆款内容。你的核心信条是：内容要么"对用户有用"，要么"让用户动心"，要么"让用户会心一笑"。当前日期：${today}。
${schoolBlock}
## 本次探索方向
「${query}」

请围绕以上方向，为【${schoolName}】生成 5-8 个具体的选题方案。
要求：必须站在【${schoolName}】的视角，结合本校专属元素，不得出现其他学校名称。

${HMS_FRAMEWORK}

## 输出格式
请以表格形式输出 5-8 个选题方案，确保覆盖至少 3 种不同的 HMS 类型：

| 选题类别 | 建议标题（长短不一，句式各异） | 核心驱动 (H/M/S) | 内容切入角度（一句话故事线） | 预期传播点（用户为何转发） |
| :--- | :--- | :--- | :--- | :--- |

## 创作红线
- 禁止生成笼统、可被任意高校套用的选题
- 每个选题必须体现**${schoolName}**的专属细节或IP
- 追求极致具体：人物、地点、时间都要落到实处`
}

// ── 全网热点借势 ─────────────────────────────────────────────

interface HotTopic {
  title: string
  source?: string
  tags?: string[]
  heat?: number
}

export function buildHotTopicPrompt(
  hot: HotTopic,
  school: SchoolProfile | null
): string {
  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
  const schoolName = school?.name ?? '一所综合性大学'
  const schoolBlock = school ? `\n${buildSchoolBlock(school)}\n` : ''
  const tags = hot.tags?.length ? `标签：${hot.tags.join('、')}` : ''
  const source = hot.source ? `来源：${hot.source}` : ''
  const heat = hot.heat != null ? `热度：${hot.heat}` : ''

  return `# 高校新媒体选题策划（热点借势）

## 角色与使命
你是一位拥有10年经验的高校新媒体首席内容官，擅长策划"现象级"校园软文。你深谙大学生、校友及家长的阅读心理，能够将枯燥的新闻资讯转化为具有情感温度、实用价值或幽默趣味的爆款内容。你的核心信条是：内容要么"对用户有用"，要么"让用户动心"，要么"让用户会心一笑"。当前日期：${today}。
${schoolBlock}
## 当前热点
热点标题：「${hot.title}」
${source}　${tags}　${heat}

请借势这个热点，为【${schoolName}】生成 5-8 个具体的选题方案。
要求：热点是外壳，内核必须是本校独有内容；标题中只能出现本校相关词，不得出现其他学校名称。

${HMS_FRAMEWORK}

## 输出格式
请以表格形式输出 5-8 个选题方案，确保覆盖至少 3 种不同的 HMS 类型：

| 选题类别 | 建议标题（长短不一，句式各异） | 核心驱动 (H/M/S) | 内容切入角度（一句话故事线） | 预期传播点（用户为何转发） |
| :--- | :--- | :--- | :--- | :--- |

## 创作红线
- 关联要巧妙自然，避免"尬蹭"
- 禁止生成笼统、可被任意高校套用的选题
- 每个选题必须体现**${schoolName}**的专属细节或IP`
}

// ── 洞察场域：参考他校文章 ──────────────────────────────────

export function buildInsightReferencePrompt(
  refSchool: string,
  refTitle: string,
  school: SchoolProfile | null
): string {
  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
  const schoolName = school?.name ?? '一所综合性大学'
  const schoolBlock = school ? `\n${buildSchoolBlock(school)}\n` : ''

  return `# 高校新媒体选题策划（竞品参考）

## 角色与使命
你是一位拥有10年经验的高校新媒体首席内容官，擅长策划"现象级"校园软文。你深谙大学生、校友及家长的阅读心理，能够将枯燥的新闻资讯转化为具有情感温度、实用价值或幽默趣味的爆款内容。你的核心信条是：内容要么"对用户有用"，要么"让用户动心"，要么"让用户会心一笑"。当前日期：${today}。
${schoolBlock}
## 参考文章
参考学校：${refSchool}
参考标题：「${refTitle}」

请仅学习这篇文章的【选题角度、内容形式、情感切入方式】，
以【${schoolName}】的视角，生成 5-8 个【${schoolName}】自己的选题方案。

严格要求：
1. 所有标题和内容必须结合本校元素（地标、专业、宣传重点）
2. 绝对不能出现「${refSchool}」或其他任何学校名称
3. 每个方案需注明与参考文章的差异化点

${HMS_FRAMEWORK}

## 输出格式
请以表格形式输出 5-8 个选题方案，确保覆盖至少 3 种不同的 HMS 类型：

| 选题类别 | 建议标题（长短不一，句式各异） | 核心驱动 (H/M/S) | 内容切入角度（一句话故事线） | 预期传播点（用户为何转发） |
| :--- | :--- | :--- | :--- | :--- |

## 创作红线
- 禁止生成笼统、可被任意高校套用的选题
- 每个选题必须体现**${schoolName}**的专属细节或IP
- 追求极致具体：人物、地点、时间都要落到实处`
}

// ── 文档视图用：导出各维度原始描述 ──────────────────────────────

export { STYLE_DESCRIPTIONS, NODE_TONE_CONSTRAINTS }

// ── 节点卡片快速触发：按节点类型自动推断默认 contentType + writingStyle ──
// 用于节点卡片直接点击时，无需配置面板，走与配置面板相同的 builder 逻辑

export function inferDefaultsFromNode(
  table: NodeTable,
  school: SchoolProfile | null
): { contentType: ContentType; writingStyle: WritingStyle } {
  // contentType：按节点类型取推荐列表第一项
  const contentType = NODE_TYPE_CONTENT_SUGGESTIONS[
    table === 'recruit' ? 'recruit' : table === 'festival' ? 'season' : 'school'
  ][0]

  // writingStyle：学校有推荐风格则取第一项，否则用通用活泼风
  const writingStyle: WritingStyle = school?.recommendedStyles?.[0] ?? 'vibrant-campus'

  return { contentType, writingStyle }
}
