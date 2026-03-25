/**
 * 学校院校级数据库
 *
 * 包含学校定位、宣传重点差异、写手风格推荐、招生数据、王牌专业等。
 * AI 生成提示词时自动根据学校名称匹配，用户无需手动选定位。
 */

export type SchoolTier =
  | '985'          // 985工程院校
  | '211'          // 211工程院校（非985）
  | 'normal'       // 普通本科
  | 'private'      // 民办本科
  | 'vocational'   // 高职/专科

export type SchoolFeature =
  | 'liberal-arts'   // 文科/师范综合
  | 'engineering'    // 工科为主
  | 'medical'        // 医科为主
  | 'comprehensive'  // 综合类

export type WritingStyle =
  | 'warm-humanistic'   // 温柔人文风（师范/文科类）
  | 'rigorous-tech'     // 严谨工科风（理工类）
  | 'professional-med'  // 专业权威风（医科类）
  | 'vibrant-campus'    // 活泼校媒风（民办/年轻化）
  | 'official-prestige' // 权威官方风（顶尖名校）

export interface SchoolProfile {
  /** 学校全称 */
  name: string
  /** 学校简称，用于模糊搜索 */
  aliases: string[]
  /** 办学层次 */
  tier: SchoolTier
  /** 学校特色 */
  feature: SchoolFeature
  /** 一句话定位 */
  positioning: string
  /** 核心宣传重点（按优先级排序） */
  promotionFocus: string[]
  /** 宣传禁区（这类院校不适合主打的点） */
  promotionAvoid: string[]
  /** 推荐写手风格（可选1-2种） */
  recommendedStyles: WritingStyle[]
  /** 招生相关数据 */
  admissionData: {
    /** 本科在校生规模 */
    undergraduateCount: string
    /** 研究生规模 */
    graduateCount?: string
    /** 主要生源省份 */
    mainSourceProvinces: string[]
    /** 分数段描述（文理/综合） */
    scoreRange: string
    /** 升学率（推免/考研方向） */
    postgraduateRate?: string
  }
  /** 王牌专业（用于文章具体化） */
  flagshipMajors: Array<{
    name: string
    highlight: string  // 该专业一句话亮点
  }>
  /** 就业亮点 */
  employmentHighlight: string
  /** 校园标志性元素（地标/文化/IP） */
  campusSymbols: string[]
  /** 特有节点提示：某些节点对该校意义特殊 */
  specialNodeHints?: Record<string, string>
  /**
   * 与该学校互斥的节点 ID 列表（变灰不可选）
   * 例如民办/专科没有强基计划，普通本科没有保研
   */
  incompatibleNodeIds?: string[]
  /**
   * 该学校的公众号账号列表
   * schoolKey 对应 data/schools.ts 中 SCHOOLS 对象的 key
   */
  accounts: Array<{
    id: string          // 平台内唯一 ID，如 'njnu-main'
    schoolKey: string   // 对应 SCHOOLS 的 key，如 '南京师大'
    role: 'main' | 'sub' // main=官方主号, sub=专项号（招生/研究生等）
  }>
}

export const SCHOOL_PROFILES: SchoolProfile[] = [
  // ──────────────────────────────────────────────────────────────
  // 南京师范大学
  // ──────────────────────────────────────────────────────────────
  {
    name: '南京师范大学',
    aliases: ['南师大', '南京师范', 'njnu', 'NJNU'],
    tier: '211',
    feature: 'liberal-arts',
    positioning: '百年师范名校，人文底蕴深厚的综合性研究型大学，以教师教育为特色，坐拥随园、仙林、紫金三校区。',
    promotionFocus: [
      '百年人文底蕴与随园历史校区独特美学',
      '教师教育品牌：全国高中名校长、教育家摇篮',
      '理科基础学科实力（数学、化学、地理全国顶尖）',
      '校园生活质量：随园美景、仙林新区设施',
      '保研深造机会与高升学率',
    ],
    promotionAvoid: [
      '过度强调就业薪资（师范院校学生更看重情怀与稳定）',
      '与综合性985硬比排名（用特色替代排名）',
    ],
    recommendedStyles: ['warm-humanistic'],
    admissionData: {
      undergraduateCount: '约2.4万名',
      graduateCount: '约1.8万名',
      mainSourceProvinces: ['江苏', '安徽', '山东', '河南', '湖北'],
      scoreRange: '本科录取线一般高出所在省份一本线20-40分；部分强势专业（教育学、数学）更高',
      postgraduateRate: '本科生升学深造率约45%，保研率约12%',
    },
    flagshipMajors: [
      { name: '教育学', highlight: '全国师范类第一，教育部重点实验室，培养了无数教育家和校长' },
      { name: '数学', highlight: '理科顶尖，华罗庚数学奖得主辈出，强基计划核心专业' },
      { name: '地理科学', highlight: '全国排名前三，自然地理与人文地理并重，科研活跃' },
      { name: '化学', highlight: '国家重点学科，诺奖团队合作，本科生科研机会多' },
      { name: '汉语言文学', highlight: '百年文脉传承，名家荟萃，文学创作与学术研究并重' },
      { name: '美术学', highlight: '国内顶尖，金陵画派传承地，毕业生遍布全国艺术界' },
    ],
    employmentHighlight: '毕业生深造和教育系统就业为主流，连续多年高中教师"南师大制造"遍布全国重点中学',
    campusSymbols: ['随园', '北大楼', '银杏大道', '随园食堂', '仙林校区图书馆', '紫金山'],
    specialNodeHints: {
      'sep-anniversary': '9月10日南师大校庆日与教师节同日，是全年最独特的情感节点，师范院校双节叠加意义极为特殊',
    },
    // 211院校无强基计划
    incompatibleNodeIds: ['mar-qiangji'],
    accounts: [
      { id: 'njnu-main', schoolKey: '南京师大', role: 'main' },
      { id: 'njnu-zs',   schoolKey: '南师招生', role: 'sub' },
    ],
  },

  // ──────────────────────────────────────────────────────────────
  // 东南大学
  // ──────────────────────────────────────────────────────────────
  {
    name: '东南大学',
    aliases: ['东南', '东大', 'SEU', 'seu'],
    tier: '985',
    feature: 'engineering',
    positioning: '国内顶尖工科强校，建筑、信息、交通三大国家级优势学科，985+双一流A类，南京工科第一。',
    promotionFocus: [
      '985顶尖工科实力与双一流A类学科',
      '建筑学全国第一的品牌影响力',
      '信息工程、电子科学大厂就业直通车',
      '高强度科研训练与企业联合培养',
      '四牌楼历史校区人文与工科融合美学',
      '高保研率与顶尖高校深造机会',
    ],
    promotionAvoid: [
      '过度渲染"文科气质"（工科院校受众看重技能和就业）',
      '轻描淡写就业薪资（工科学生高度关注薪资和大厂机会）',
    ],
    recommendedStyles: ['rigorous-tech', 'official-prestige'],
    admissionData: {
      undergraduateCount: '约1.8万名',
      graduateCount: '约2.5万名',
      mainSourceProvinces: ['江苏', '浙江', '安徽', '上海', '山东'],
      scoreRange: '录取分数高，江苏省内985级别，理工科方向分数线通常高出一本线60-90分',
      postgraduateRate: '深造率超60%，保研率约18%，大量进入清北交浙深造',
    },
    flagshipMajors: [
      { name: '建筑学', highlight: '全国第一，与同济、清华并称三大建筑名校，毕业生遍布顶尖设计院所' },
      { name: '电子信息工程', highlight: '信息领域顶尖，华为、阿里、字节等大厂直招，年薪起步25万+' },
      { name: '交通运输工程', highlight: '国家一流学科，国内铁路、地铁、公路行业领军人才摇篮' },
      { name: '土木工程', highlight: '传统强势专业，基建领域校友网络极强，国企央企首选' },
      { name: '集成电路设计', highlight: '响应国家战略，芯片领域高需求专业，就业供不应求' },
    ],
    employmentHighlight: '工科就业率接近100%，互联网大厂、央企国企、头部设计院三足鼎立，平均薪资居全国前列',
    campusSymbols: ['四牌楼校区', '大礼堂', '梅庵', '九龙湖校区', '前工院'],
    specialNodeHints: {
      'apr-recruit-guide': '东南大学招生宣传应重点突出学科排名、大厂就业数据、深造率等硬数据，理性说服为主',
    },
    incompatibleNodeIds: [],
    accounts: [
      { id: 'seu-main', schoolKey: '东南大学', role: 'main' },
    ],
  },
  // ──────────────────────────────────────────────────────────────
  {
    name: '南京医科大学',
    aliases: ['南医大', '南医', '南京医大', 'NJMU', 'njmu'],
    tier: 'normal',
    feature: 'medical',
    positioning: '国内知名医科大学，临床医学、公共卫生双轮驱动，附属医院体系强大，培养一线医疗卫生人才。',
    promotionFocus: [
      '附属医院实力：省人民医院、鼓楼医院等顶级临床教学平台',
      '临床医学五年制/八年制的成长路径',
      '公共卫生与预防医学：疫情背景下社会关注度高',
      '护理、药学等热门医学细分方向就业稳定',
      '医学生的成长故事与职业荣耀感',
      '考研与规培后的职业上升路径',
    ],
    promotionAvoid: [
      '夸大就业薪资（医学生规培期收入低是共识，需诚实说明长期前景）',
      '回避医学培养周期长的问题（与考生坦诚比回避更有说服力）',
    ],
    recommendedStyles: ['professional-med', 'warm-humanistic'],
    admissionData: {
      undergraduateCount: '约1.4万名',
      graduateCount: '约1万名',
      mainSourceProvinces: ['江苏', '安徽', '山东', '河南', '湖南'],
      scoreRange: '临床医学录取分较高，江苏省内约高出一本线30-50分；护理、预防医学等相对较低',
      postgraduateRate: '临床医学几乎100%需规培，学术深造（研究生）比例约40%',
    },
    flagshipMajors: [
      { name: '临床医学', highlight: '核心王牌，附属医院床位数全省第一，实习资源业内顶尖' },
      { name: '公共卫生与预防医学', highlight: '后疫情时代需求激增，疾控、卫健委系统就业路径清晰' },
      { name: '护理学', highlight: '就业率接近100%，三甲医院优先录取，薪资随年资稳步增长' },
      { name: '药学', highlight: '医药企业+医院药房双渠道，考研方向多元，生物医药产业需求旺' },
    ],
    employmentHighlight: '医学毕业生就业稳定，三甲医院、公共卫生机构、医药企业是主要去向，长期职业前景稳定向好',
    campusSymbols: ['江宁校区', '五台山校区', '附属医院', '医学楼', '解剖楼（学生文化地标）'],
    specialNodeHints: {
      'may-youth': '医学生的青春故事往往更感人——"白衣梦想"主题在5月4日前后传播力极强',
    },
    // 普通本科·医科无强基计划
    incompatibleNodeIds: ['mar-qiangji', 'aug-admission2'],
    accounts: [
      { id: 'njmu-main', schoolKey: '南京医科大学', role: 'main' },
    ],
  },

  // ──────────────────────────────────────────────────────────────
  // 金陵科技学院
  // ──────────────────────────────────────────────────────────────
  {
    name: '金陵科技学院',
    aliases: ['金科', '金陵科技', 'jit', 'JIT'],
    tier: 'private',
    feature: 'engineering',
    positioning: '南京民办应用型本科高校，以"产学研用"见长，校园环境优美，就业直通型培养模式。',
    promotionFocus: [
      '校园环境与宿舍硬件（民办生首要关注点）',
      '就业直通：企业合作、实习基地、就业率数据',
      '学费与助学金政策（民办考生家庭高度关注）',
      '双校区特色环境与生活配套',
      '动漫、软件、电商等热门就业方向',
      '小班教学与个性化培养',
    ],
    promotionAvoid: [
      '过度强调学科排名和科研实力（与公办院校竞争无优势）',
      '主打"专业深度"（应聚焦"应用能力"和"就业结果"）',
      '回避民办标签（坦然展示优质民办的价值更有说服力）',
    ],
    recommendedStyles: ['vibrant-campus'],
    admissionData: {
      undergraduateCount: '约2万名',
      mainSourceProvinces: ['江苏', '安徽', '河南', '四川', '湖北'],
      scoreRange: '录取分数在本科线附近，部分热门专业略高；民办学费约1.5-2.5万/年',
      postgraduateRate: '考研升学比例约15%，主要面向就业',
    },
    flagshipMajors: [
      { name: '动漫制作技术', highlight: '就业导向鲜明，与南京多家动漫公司合作，直接对口就业' },
      { name: '软件工程', highlight: '课程贴近企业需求，学生在校即可参与实际项目，毕业即就业' },
      { name: '电子商务', highlight: '结合直播经济趋势，实训平台完善，学生创业案例多' },
      { name: '园林', highlight: '校园本身即实训基地，绿化景观专业全省小有名气' },
    ],
    employmentHighlight: '本科就业率长期保持在95%以上，实习即就业比例高，校企合作定向培养是核心竞争力',
    campusSymbols: ['江宁校区花海', '白下校区', '实训中心', '创业孵化园'],
    specialNodeHints: {
      'aug-frosh': '民办院校新生攻略应重点介绍宿舍条件、校园环境、周边配套，这是家长和新生最关心的',
      'jun-volunteer': '志愿填报季是民办院校最关键节点，需要主动说明学费政策、助学贷款、奖学金等信息',
    },
    // 民办本科：无强基计划、无保研相关节点
    incompatibleNodeIds: ['mar-qiangji', 'aug-admission2', 'nov-postgraduate'],
    accounts: [
      { id: 'jit-main', schoolKey: '金陵科技学院', role: 'main' },
    ],
  },
]

/**
 * 根据名称（全称或别名）搜索学校
 */
export function findSchoolProfile(query: string): SchoolProfile | null {
  const q = query.trim().toLowerCase()
  return SCHOOL_PROFILES.find(
    s =>
      s.name.includes(query) ||
      s.aliases.some(a => a.toLowerCase().includes(q))
  ) ?? null
}

/**
 * 获取所有学校名称列表（用于搜索下拉）
 */
export function getAllSchoolNames(): string[] {
  return SCHOOL_PROFILES.map(s => s.name)
}

/**
 * 根据节点 ID 获取该学校的特殊提示（如有）
 */
export function getSpecialNodeHint(school: SchoolProfile, nodeId: string): string | null {
  return school.specialNodeHints?.[nodeId] ?? null
}
