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

// ── 各写手风格的具体描述 ────────────────────────────────────────

const STYLE_DESCRIPTIONS: Record<WritingStyle, string> = {
  'warm-humanistic': `
【写手风格：温柔人文风】
- 语言：细腻、温暖，善用意象与细节描写，情感真挚不煽情
- 句式：多用短句和疑问句，营造亲切的阅读节奏
- 视角：以"人"为核心，从个体故事切入，避免宏大叙事
- 禁忌：不用"恭祝""欣慰""蓬勃发展"等官方套话`,

  'rigorous-tech': `
【写手风格：严谨工科风】
- 语言：简洁有力，数据说话，逻辑清晰，不堆砌形容词
- 结构：善用"问题—解法—结果"三段式
- 视角：强调能力培养和可量化的成果（数据、排名、薪资）
- 禁忌：不过度煽情，不用"美丽""温柔"等感性形容词作主要卖点`,

  'professional-med': `
【写手风格：专业权威风】
- 语言：专业严谨，同时具备人文关怀，体现医学"有温度的专业"
- 视角：兼顾职业荣耀感与现实培养路径，诚实说明周期
- 结构：强调临床资源、师资资质、就业方向等可信信息
- 禁忌：不夸大就业薪资（医学生规培期是共识），不回避培养年限长的问题`,

  'vibrant-campus': `
【写手风格：活泼校媒风】
- 语言：年轻化、网感强，可使用Z世代惯用表达（但不滥用网络梗）
- 节奏：短段落、多换行，段落间有呼吸感
- 视角：以学生视角出发，讲"我"在这里的真实体验
- 禁忌：不说官方话，不堆砌"历史悠久""综合实力强"等虚词`,

  'official-prestige': `
【写手风格：权威官方风】
- 语言：严肃大气，具有引领性，体现顶尖高校的自信与底气
- 视角：从国家战略、学科引领、人才培养高度切入
- 结构：事实+数据+权威佐证，逻辑严密
- 禁忌：不过度娱乐化，保持格调；避免"看过来"等促销式表达`,
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
每个选题必须有且仅有一个核心驱动维度：

- **H（Heart）动心**：连接情感，触发身份认同、集体记忆或深层共鸣。成功标准：让读者觉得"这就是我/我们"。
- **M（Mind）有用**：解决问题，提供具象、稀缺、可操作的信息。成功标准：让读者忍不住"收藏/转发"。
- **S（Smile）会心一笑**：创造愉悦，运用幽默、反差、梗文化。成功标准：让读者笑着分享，评论"是我校了"。

**重要原则**：拒绝拼盘（焦点只能一个）；拒绝套路（严禁套用固定模板）；逻辑自洽（情感升华需有合理依据）。

## 选题类型矩阵

**1. 新闻资讯软化类**：为冰冷的"事"找到温暖的"人"。
- H：报道新实验室落成，主角是第一位用它做出数据的大四学生。
- M：解读新奖学金政策，制作"一图读懂"和申请条件自测表。
- S：用"开箱测评"形式展示学校新投入的黑科技自习座椅。

**2. 招生宣传种草类**：贩卖"体验"和"可能性"，而非罗列排名。
- H：一位新生用手机记录入学第一周，从清晨操场到深夜图书馆。
- M："学长学姐说"系列，坦诚分享本专业真实课表和职业发展方向。
- S：报考我校的十大"离谱"理由（真实版）。

**3. 热点借势融合类**：将社会情绪"翻译"成校园语境。热点是外壳，内核必须是本校独有内容。
- H：结合"人生照片"热梗，征集校友那一张定义大学时代的照片。
- M：借考研国家线公布热点，推出复试现场导师最看重的3个软实力。
- S：模仿热门短剧格式，拍重生之我在大学当"e人"。

**4. 实用指南痛点类**：做读者在特定阶段的"救命锦囊"。标题要直击焦虑，内容要极致细化。
- H：写给春招中第N次被拒的你，用校友早期挫折故事提供情感支撑。
- M：如何用AI工具一天内完成毕业设计文献综述，保姆级教程。
- S：体测生存图鉴，献给每年春天操场上那些"痛苦面具"们。

**5. 校园故事共情类**：发现并礼赞"平凡中的光辉"。主角未必是学霸，保洁员/门卫/老建筑都可以。
- H：跟踪拍摄深夜保洁阿姨，她悄悄整理学生遗落的笔记并在黑板上写"加油"。
- M：讲述"古籍修复"专业师生故事，侧面展示该领域技艺传承与职业前景。
- S：采访校园"知名"恋爱长跑情侣，整理出一份校园恋爱防踩坑指南（非官方严肃版）。

## 标题创作要求
标题是选题的门面，必须做到**长短错落、句式多变**：
- 短标题（6-10字）：一句话点破核心，如"她在图书馆哭了一整晚"
- 中标题（11-16字）：有情境感，如"毕业前我终于去了一次随园深处的那栋楼"
- 疑问/祈使句：制造对话感，如"你真的了解自己选的这个专业吗"
- 口语化短句：像朋友说话，如"今年的银杏比去年更黄了"
- **严禁**：所有标题都用"xxx，xxx"或"xxx：xxx"的切割句式，这会让版面单调`

// ── 学校数据块（无节点入口复用）───────────────────────────

function buildSchoolBlock(school: SchoolProfile): string {
  const tierLabel = school.tier === '985' ? '985工程' : school.tier === '211' ? '211工程' : school.tier === 'private' ? '民办本科' : school.tier === 'normal' ? '普通本科' : '高职专科'
  const featureLabel = school.feature === 'liberal-arts' ? '文科/师范' : school.feature === 'engineering' ? '工科' : school.feature === 'medical' ? '医科' : '综合'
  return `## 学校背景
**学校**：${school.name}（${tierLabel}·${featureLabel}类）
**定位**：${school.positioning}
**校园标志性元素**：${school.campusSymbols.join('、')}
**宣传重点**：${school.promotionFocus.slice(0, 3).map((f, i) => `${i + 1}. ${f}`).join('；')}
**宣传禁区**：${school.promotionAvoid.map(a => `- ${a}`).join('\n')}`
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
**可策划方向**：${node.topics.join('、')}
**内容类型**：${contentTypeLabel}${specialHint}
`.trim()

  // 节气/节日语气约束
  const toneModule = toneConstraint
    ? `\n${toneConstraint.trim()}`
    : ''

  return `# 高校新媒体现象级选题策划（结构化规范 V3.0）

## 角色与使命
你是一位以"用户洞察"和"创意破圈"著称的高校新媒体首席内容官。你的专长不是复述新闻，而是为校园故事找到最动人的讲述方式。

${schoolModule}

${nodeModule}

${admissionModule}

${majorModule ? majorModule + '\n\n' : ''}${styleDesc.trim()}
${toneModule}

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
**可策划方向**：${node.topics.join('、')}
**内容类型**：${contentTypeLabel}${specialHint}`.trim()

  return `# 高校招生新媒体选题策划（招生节点专用）

## 角色与使命
你是一位专注高招宣传的高校新媒体内容策划，深度理解高考生和家长的信息需求与决策心理。
你的目标是帮助考生做出报考决策，而不是泛泛展示学校形象。

${schoolModule}

${nodeModule}

${admissionModule}
${majorModule}

${styleDesc.trim()}

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
  const contentTypeLabel = CONTENT_TYPE_LABELS[contentType]
  const styleDesc = STYLE_DESCRIPTIONS[writingStyle]
  const toneConstraint = NODE_TONE_CONSTRAINTS[node.id] ?? ''

  const nodeModule = `
## 当前节气/节日节点
**节点**：${node.title}（${node.date}）
**说明**：${node.description}
**可策划方向**：${node.topics.join('、')}
**内容类型**：${contentTypeLabel}`.trim()

  const toneModule = toneConstraint ? `\n${toneConstraint.trim()}` : ''

  const campusModule = `
## 校园场景素材
**学校**：${school.name}
**标志性元素**：${school.campusSymbols.join('、')}
**校园气质**：${school.positioning}`.trim()

  return `# 高校节气/节日新媒体选题策划

## 角色与使命
你是一位擅长将传统节气文化与校园生活融合的高校新媒体内容策划。
你的目标是让节气内容有温度、有校园专属感，而不是通用的节日海报文案。

${nodeModule}
${toneModule}

${campusModule}

${styleDesc.trim()}

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
  const contentTypeLabel = CONTENT_TYPE_LABELS[contentType]
  const styleDesc = STYLE_DESCRIPTIONS[writingStyle]
  const specialHint = school.specialNodeHints?.[node.id]
    ? `\n**特别提示**：${school.specialNodeHints[node.id]}`
    : ''

  const nodeModule = `
## 当前校园节点
**节点**：${node.title}（${node.date}）
**说明**：${node.description}
**可策划方向**：${node.topics.join('、')}
**内容类型**：${contentTypeLabel}${specialHint}`.trim()

  const schoolModule = `
## 学校背景
**学校**：${school.name}
**校园气质**：${school.positioning}
**标志性元素**：${school.campusSymbols.join('、')}`.trim()

  return `# 高校校园新媒体选题策划（校园节点专用）

## 角色与使命
你是一位深度理解校园文化的高校新媒体内容策划，擅长挖掘校园生活中的动人细节。
你的目标是让在校生产生归属感，让校友产生怀念，让新生充满期待。

${nodeModule}

${schoolModule}

${styleDesc.trim()}

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
  const daysInfo = node.daysLeft != null ? `（距今约 ${node.daysLeft} 天）` : ''
  const topicsHint = node.topics.length ? `**可策划方向**：${node.topics.join('、')}` : ''
  const toneConstraint = NODE_TONE_CONSTRAINTS[node.id] ? `\n${NODE_TONE_CONSTRAINTS[node.id].trim()}` : ''
  const specialHint = school?.specialNodeHints?.[node.id] ? `\n**特别提示**：${school.specialNodeHints[node.id]}` : ''
  const schoolBlock = school ? `\n${buildSchoolBlock(school)}\n` : ''

  const nodeTypeMap: Record<string, string> = {
    recruit: '招生节点', festival: '节气/节日', campus: '校园节点',
  }

  return `# 高校新媒体选题策划（节点灵感）

## 角色与使命
你是一位以"用户洞察"和"创意破圈"著称的高校新媒体首席内容官。当前日期：${today}。
${schoolBlock}
## 当前宣传节点
**节点**：${node.title}（${node.date}）${daysInfo}
**类型**：${nodeTypeMap[table] ?? table}
**说明**：${node.description}
${topicsHint}${specialHint}${toneConstraint}

${HMS_FRAMEWORK}

## 输出格式
请以表格形式输出 5-8 个选题方案，确保覆盖至少 3 种不同的 HMS 类型：

| 选题类别 | 建议标题（长短不一，句式各异） | 核心驱动 (H/M/S) | 内容切入角度（一句话故事线） | 预期传播点（用户为何转发） |
| :--- | :--- | :--- | :--- | :--- |

## 创作红线
- 所有选题必须以「${node.title}」为核心主题，不得偏题
- 禁止生成笼统、可被任意高校套用的选题
- 每个选题必须体现**${schoolName}**的专属细节或IP`
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
你是一位以"用户洞察"和"创意破圈"著称的高校新媒体首席内容官。当前日期：${today}。
${schoolBlock}
## 本次探索方向
「${query}」

请围绕以上方向，为【${schoolName}】生成 3-5 个具体的选题方案。
要求：必须站在【${schoolName}】的视角，结合本校专属元素，不得出现其他学校名称。

${HMS_FRAMEWORK}

## 输出格式
请以表格形式输出 3-5 个选题方案：

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
你是一位以"用户洞察"和"创意破圈"著称的高校新媒体首席内容官。当前日期：${today}。
${schoolBlock}
## 当前热点
热点标题：「${hot.title}」
${source}　${tags}　${heat}

请借势这个热点，为【${schoolName}】生成 3-5 个具体的选题方案。
要求：热点是外壳，内核必须是本校独有内容；标题中只能出现本校相关词，不得出现其他学校名称。

${HMS_FRAMEWORK}

## 输出格式
请以表格形式输出 3-5 个选题方案：

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
你是一位以"用户洞察"和"创意破圈"著称的高校新媒体首席内容官。当前日期：${today}。
${schoolBlock}
## 参考文章
参考学校：${refSchool}
参考标题：「${refTitle}」

请仅学习这篇文章的【选题角度、内容形式、情感切入方式】，
以【${schoolName}】的视角，生成 3-5 个【${schoolName}】自己的选题方案。

严格要求：
1. 所有标题和内容必须结合本校元素（地标、专业、宣传重点）
2. 绝对不能出现「${refSchool}」或其他任何学校名称
3. 每个方案需注明与参考文章的差异化点

${HMS_FRAMEWORK}

## 输出格式
请以表格形式输出 3-5 个选题方案：

| 选题类别 | 建议标题（长短不一，句式各异） | 核心驱动 (H/M/S) | 内容切入角度（一句话故事线） | 预期传播点（用户为何转发） |
| :--- | :--- | :--- | :--- | :--- |

## 创作红线
- 禁止生成笼统、可被任意高校套用的选题
- 每个选题必须体现**${schoolName}**的专属细节或IP
- 追求极致具体：人物、地点、时间都要落到实处`
}

// ── 文档视图用：导出各维度原始描述 ──────────────────────────────

export { STYLE_DESCRIPTIONS, NODE_TONE_CONSTRAINTS }
