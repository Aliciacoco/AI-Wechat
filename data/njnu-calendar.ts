/**
 * 南京师范大学全年宣传节点日历
 *
 * 分三张表：
 *   RECRUIT_NODES  —— 高招核心节点（高考生/家长受众，不含考研）
 *   FESTIVAL_NODES —— 传统节气/节日（festival + season 类型）
 *   CAMPUS_NODES   —— 校园节点（school + youth 类型，含校庆/开学/新生/年终）
 */

export type CalendarNodeType = 'festival' | 'school' | 'season' | 'recruit' | 'youth'

export interface CalendarNode {
  id: string
  month: number          // 1-12
  date: string           // 展示用，如 "3月20日"
  title: string
  type: CalendarNodeType
  topics: string[]       // 可策划的选题方向
  description: string    // 简短说明，用于 AI 生成上下文
  daysLeft?: number      // 运行时动态计算
  /** 仅某学校专属（填学校全称），无学校上下文时不显示；其他学校选中时也不显示 */
  schoolOnly?: string
  /** 仅985高校适用（如强基计划），无学校上下文时隐藏 */
  tier985Only?: boolean
}

// ─────────────────────────────────────────────────────────────
// 招生节点（纯高招，不含考研）
// ─────────────────────────────────────────────────────────────

export const RECRUIT_NODES: CalendarNode[] = [
  {
    id: 'nov-gaokao-countdown',
    month: 11,
    date: '11月',
    title: '高考倒计时200天',
    type: 'recruit',
    topics: ['高考倒计时200天', '高考报名通知', '招生宣讲预告'],
    description: '高考倒计时200天节点，新一届高考备考周期开启，可发布倒计时内容，预热招生宣传。',
  },
  {
    id: 'jan-countdown',
    month: 1,
    date: '1月',
    title: '高考倒计时150天',
    type: 'recruit',
    topics: ['高考倒计时150天特辑', '招生宣传片预热', '专业介绍系列'],
    description: '距高考约150天，是高考生信息敏感期，适合发布招生宣传片和专业介绍预热内容。',
  },
  {
    id: 'jan-hometown',
    month: 1,
    date: '1月中旬',
    title: '学子家乡行招生宣讲',
    type: 'recruit',
    topics: ['学子家乡行活动通知与系列报道', '宣讲征文活动', '留校师生寒假活动'],
    description: '寒假前后，在校学子返乡开展招生宣讲，可发布活动通知、系列征文，展现南师大学子风采。',
  },
  {
    id: 'feb-countdown100',
    month: 2,
    date: '2月底',
    title: '高考倒计时100天',
    type: 'recruit',
    topics: ['高考百日冲刺特辑', '学长学姐经验谈', '新年招生宣传片首发', '生源地高中招生宣讲'],
    description: '高考倒计时100天是重要节点，宜发布冲刺激励内容、学长学姐经验，以及南师大招生宣传片。',
  },
  {
    id: 'mar-qiangji',
    month: 3,
    date: '3月',
    title: '强基计划招生简章',
    type: 'recruit',
    tier985Only: true,
    topics: ['强基计划招生简章及解读', '招生动态直播预告', '校区介绍', '专业介绍系列'],
    description: '强基计划招生简章发布，是春季招生宣传最重要节点，需及时发布解读和直播预告。',
  },
  {
    id: 'apr-recruit-guide',
    month: 4,
    date: '4月',
    title: '招生宣传攻势月',
    type: 'recruit',
    topics: ['专业介绍系列', '线上宣讲会预告与回放', '招生榜样人物专访', '招生宣传片发布', '生源地附属中学宣讲'],
    description: '四月是招生宣传集中发力期，宜密集发布专业介绍、线上宣讲、榜样人物等内容，全面种草。',
  },
  {
    id: 'apr-countdown50',
    month: 4,
    date: '4月下旬',
    title: '高考倒计时50天',
    type: 'recruit',
    topics: ['高考倒计时50天特辑', '高考日历·招生进程时间表', '学长学姐备考心得', '校园日常行程展示'],
    description: '高考倒计时50天，考生信息需求高峰，宜发布招生日历、学长学姐经验和校园生活展示。',
  },
  {
    id: 'may-countdown30',
    month: 5,
    date: '5月',
    title: '高考倒计时30天',
    type: 'recruit',
    topics: ['高考倒计时30天冲刺锦囊', '专业漫谈·你以为的专业VS南师大的专业', '直播预告回放', '本科招生咨询通道汇总'],
    description: '距高考仅一个月，考生择校意愿最强，宜大力推送专业介绍和招生咨询通道。',
  },
  {
    id: 'jun-gaokao',
    month: 6,
    date: '6月7日',
    title: '高考',
    type: 'recruit',
    topics: ['高考必胜原创海报', '随园幸运笺·为高考学子助力', '南师大十大理由', '学校实力干货', '志愿填报攻略'],
    description: '高考是全年招生宣传最高潮，可发布必胜祝福、校园幸运笺、选择南师大十大理由等内容。',
  },
  {
    id: 'jun-volunteer',
    month: 6,
    date: '6月下旬',
    title: '志愿填报季',
    type: 'recruit',
    topics: ['志愿填报攻略', '南师大各专业报考指南汇总', '招生咨询通道汇总', '十大理由系列', '录取通知书查询方式汇总'],
    description: '志愿填报是招生宣传的关键转化节点，需密集发布各专业报考指南、招生咨询方式等实用信息。',
  },
  {
    id: 'jul-admission',
    month: 7,
    date: '7月',
    title: '高考录取季',
    type: 'recruit',
    topics: ['录取通知书开箱介绍·含义与设计解读', '录取进度直播', '各省市录取查询方式', '录取防诈骗宣传', '通知书开箱系列'],
    description: '高考录取进行中，重点发布录取进度、通知书含义解读、查询方式和防诈骗提醒。',
  },
  {
    id: 'aug-admission2',
    month: 8,
    date: '8月',
    title: '强基/专项录取·入学须知',
    type: 'recruit',
    tier985Only: true,
    topics: ['强基计划校测工作新闻', '各省录取通知书查询', '新生QQ群公告', '入学须知章程指南', '萌新攻略系列'],
    description: '8月录取工作收尾，重点发布新生入学须知、攻略指南，以及衣食住行等实用信息。',
  },
]

// ─────────────────────────────────────────────────────────────
// 传统节气/节日（festival + season 类型）
// ─────────────────────────────────────────────────────────────

export const FESTIVAL_NODES: CalendarNode[] = [
  {
    id: 'jan-newyear',
    month: 1,
    date: '1月1日',
    title: '元旦',
    type: 'festival',
    topics: ['新年快乐海报', '新年贺词', '学子家乡行活动预告', '年度十大新闻投票'],
    description: '跨年节点，适合总结过去一年、展望新年，可结合学子家乡行活动发布通知预告。',
  },
  {
    id: 'feb-spring',
    month: 2,
    date: '2月',
    title: '春节',
    type: 'festival',
    topics: ['新春贺年海报', '新年月历', '留校学生暖心活动', '学子亮相央视春晚'],
    description: '春节期间，可发布新春祝贺海报、新年月历，关注留校学生，记录学子亮相央视春晚等暖心内容。',
  },
  {
    id: 'mar-spring-scenery',
    month: 3,
    date: '3月初',
    title: '春日随园·开学季',
    type: 'season',
    topics: ['春景（校花、校草、校树）', '随园春日校园风景大片', '新学期新气象', '学子风采展示'],
    description: '春季学期开学，随园春色正当时，适合发布校园春景大片，展示南师大独特的随园校园气息。',
  },
  {
    id: 'mar-vernal-equinox',
    month: 3,
    date: '3月20日',
    title: '春分',
    type: 'season',
    topics: ['春分节气海报', '随园春分物候图鉴', '春日校园打卡指南'],
    description: '春分节气，随园草长莺飞，可结合节气话题发布校园春景内容，强化校园美学形象。',
  },
  {
    id: 'apr-qingming',
    month: 4,
    date: '4月4日',
    title: '清明节',
    type: 'festival',
    topics: ['缅怀先贤·校史人物专题', '踏青好去处·随园赏春', '清明节气物候'],
    description: '传统节日，可结合缅怀先贤做校史人物专题，也可借踏青节点展示随园春色。语气宜庄重淡雅。',
  },
  {
    id: 'may-laborday',
    month: 5,
    date: '5月1日',
    title: '五一劳动节',
    type: 'festival',
    topics: ['五一海报', '五四倒计时预热', '劳动最光荣·师生故事'],
    description: '五一小长假，可发布假期海报，并预热五四青年节内容。',
  },
  {
    id: 'jun-party',
    month: 6,
    date: '7月1日',
    title: '建党节',
    type: 'festival',
    topics: ['建党节海报（转发官微）', '红色校史·南师大与党同行'],
    description: '建党节可转发官微内容，也可策划结合南师大校史的红色主题内容。',
  },
  {
    id: 'oct-national',
    month: 10,
    date: '10月1日',
    title: '国庆节',
    type: 'festival',
    topics: ['国庆海报', '秋天的第一杯奶茶（原创）', '国家级一流本科专业成就展示', '秋景大片'],
    description: '国庆黄金节点，可发布爱国主题海报，结合国家级专业成就，或用轻量创意内容。',
  },
  {
    id: 'oct-autumn',
    month: 10,
    date: '10月',
    title: '随园秋景',
    type: 'season',
    topics: ['随园秋景大片', '秋日校园打卡地图', '原创秋景图文', '秋季运动会新闻及图鉴'],
    description: '秋季运动会与随园秋景是10月的双重内容亮点，适合展示校园美景和学生活力。',
  },
  {
    id: 'dec-memorial',
    month: 12,
    date: '12月13日',
    title: '国家公祭日',
    type: 'festival',
    topics: ['国家公祭日海报', '铭记历史·南师大在南京的记忆', '公祭日主题文章'],
    description: '南京大屠杀国家公祭日，南师大地处南京，此节点意义特殊，宜发布庄重悼念内容。',
  },
  {
    id: 'dec-winter',
    month: 12,
    date: '12月',
    title: '冬日随园',
    type: 'season',
    topics: ['冬日随园雪景', '温暖冬季·随园冬季御寒指南', '创意冬日情书'],
    description: '冬日随园若遇雪景则是极佳传播素材，同时可策划温暖冬季系列。',
  },
  {
    id: 'may-youth',
    month: 5,
    date: '5月4日',
    title: '五四青年节',
    type: 'festival',
    topics: ['五四青年奖获奖专访', '南师大青年的"加减乘除"', '青年力量·校园创新故事', '五四特辑·我们这一代南师大人'],
    description: '五四青年节是法定节日，也是展示青年力量的重要节点，可策划获奖青年专访、青年精神主题策划等。',
  },
]

// ─────────────────────────────────────────────────────────────
// 校园节点（school + youth 类型）
// ─────────────────────────────────────────────────────────────

export const CAMPUS_NODES: CalendarNode[] = [
  {
    id: 'jul-summer-camp',
    month: 7,
    date: '7月',
    title: '夏令营·暑期社会实践',
    type: 'school',
    topics: ['夏令营活动报道', '暑期社会实践系列', '暑假！好好休息'],
    description: '暑期期间，可发布夏令营和暑期社会实践内容，同时关注留校学子动态。',
  },
  {
    id: 'aug-frosh',
    month: 8,
    date: '8月下旬',
    title: '新生报到准备',
    type: 'school',
    topics: ['大学生活是什么样子', '萌新攻略·衣食住行全攻略', '奖助体系介绍', '城市介绍·南京这座城'],
    description: '临近报到，新生和家长信息需求旺盛，宜发布校园生活全攻略和城市介绍。',
  },
  {
    id: 'sep-enrollment',
    month: 9,
    date: '9月初',
    title: '新生报到·开学典礼',
    type: 'school',
    topics: ['新生报到现场图鉴', '开学典礼邀请函', '校长/教师/学子讲话摘录', '开学第一天vlog', '迎新晚会报道'],
    description: '一年最重要的开学节点，可发布现场图鉴、开学典礼精彩瞬间和各方讲话金句。',
  },
  {
    id: 'sep-anniversary',
    month: 9,
    date: '9月10日',
    title: '南京师范大学校庆日·教师节',
    type: 'school',
    schoolOnly: '南京师范大学',
    topics: ['校庆周年纪念特辑', '校友回忆·随园往事', '校史故事系列', '师生祝福大合集', '知名校友专访', '致南师大的先生们', '师生情深·双节同庆'],
    description: '南师大校庆日与教师节同为9月10日，是全年最具特色的情感节点，双节叠加对师范类高校尤为独特。',
  },
  {
    id: 'sep-freshmen-data',
    month: 9,
    date: '9月',
    title: '新生大数据',
    type: 'school',
    topics: ['本科新生大数据长图', '军训记忆图鉴', '辅导员介绍系列', '招办纳新·社团纳新'],
    description: '新生报到后发布新生大数据，展示生源地分布、最小最大年龄等趣味数据，引发广泛传播。',
  },
  {
    id: 'oct-rankings',
    month: 10,
    date: '10月',
    title: '各类学科排名发布',
    type: 'school',
    topics: ['各类学术排名解读', '国家级一流本科专业/课程展示', '校园新闻集锦'],
    description: '年末前各类大学排名陆续发布，可及时跟进，以"与人有关"的角度软化解读。',
  },
  {
    id: 'nov-postgraduate',
    month: 11,
    date: '11月',
    title: '保研·升学季',
    type: 'youth',
    topics: ['保研系列·南师大保研去向揭秘', '升学故事·图书馆深夜灯光', '中国大学生自强之星标兵', '创新创业大赛报道'],
    description: '11月保研关键节点，可策划学习故事、保研去向、图书馆深夜等共情内容。',
  },
  {
    id: 'nov-competition',
    month: 11,
    date: '11月',
    title: '互联网+·创新创业大赛',
    type: 'youth',
    topics: ['互联网+大赛成果展示', '创新创业故事', '辩论赛精彩回顾'],
    description: '互联网+大赛季，可聚焦南师大学子的创新项目和背后故事，展示青年担当。',
  },
  {
    id: 'dec-yearend',
    month: 12,
    date: '12月下旬',
    title: '年终回顾',
    type: 'school',
    topics: ['年度十大新闻投票及结果', '年度十大关键词', '年终回顾长图'],
    description: '年终总结是全年收官内容，可发布十大新闻、十大关键词。',
  },
]

// ─────────────────────────────────────────────────────────────
// 工具函数
// ─────────────────────────────────────────────────────────────

/**
 * 从指定节点表中取近 N 天内的节点，按时间排序
 */
export function getUpcomingNodes(
  nodes: CalendarNode[],
  today: Date = new Date(),
  windowDays = 90,
  limit = 6,
): CalendarNode[] {
  const result: (CalendarNode & { daysLeft: number })[] = []

  for (const node of nodes) {
    const rawDate = node.date
    let targetMonth = node.month
    let targetDay = 15

    const matchExact = rawDate.match(/(\d+)月(\d+)日/)
    if (matchExact) {
      targetMonth = parseInt(matchExact[1])
      targetDay = parseInt(matchExact[2])
    } else {
      if (rawDate.match(/(\d+)月初/)) targetDay = 5
      if (rawDate.match(/(\d+)月下旬/)) targetDay = 25
      if (rawDate.match(/(\d+)月中旬/)) targetDay = 15
    }

    const year = today.getFullYear()
    let target = new Date(year, targetMonth - 1, targetDay)
    if (target < today) {
      target = new Date(year + 1, targetMonth - 1, targetDay)
    }

    const daysLeft = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (daysLeft >= 0 && daysLeft <= windowDays) {
      result.push({ ...node, daysLeft })
    }
  }

  return result
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, limit)
}

/**
 * 所有节点合并（兼容旧代码）
 */
export const NJNU_CALENDAR_NODES: CalendarNode[] = [
  ...RECRUIT_NODES,
  ...FESTIVAL_NODES,
  ...CAMPUS_NODES,
]
