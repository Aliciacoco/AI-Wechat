/**
 * 南京师范大学官方名称规范
 * 审核时用于检测校名、简称、院系名称的正确性
 */

// ——— 学校名称 ———
export const SCHOOL_NAME = {
  /** 法定全称 */
  full: '南京师范大学',
  /** 官方认可的简称 */
  approved: ['南师大', '南师'],
  /** 禁止使用的错误写法 */
  forbidden: ['南师院', '南京师大', '南京师范', 'NJNU（单独使用时需附全称）'],
  /** 英文全称 */
  english: 'Nanjing Normal University',
  /** 英文缩写 */
  englishAbbr: 'NNU',
}

// ——— 二级学院官方名称 ———
export interface Department {
  /** 官方全称 */
  official: string
  /** 官方认可的简称（可为空） */
  approvedAlias?: string[]
  /** 常见误写/非官方简称 */
  wrongAlias?: string[]
}

export const NJNU_DEPARTMENTS: Department[] = [
  // 请根据学校官网补充完整名单
  // 官网来源：https://www.njnu.edu.cn/xxgk/jgsz.htm

  { official: '教师教育学院', wrongAlias: ['师范学院', '教育学院', '教师学院'] },
  { official: '新闻与传播学院', approvedAlias: ['新传院'], wrongAlias: ['新闻学院', '传播学院'] },
  { official: '文学院', wrongAlias: ['中文系', '汉语言文学学院'] },
  { official: '外国语学院', wrongAlias: ['外语学院', '外语系'] },
  { official: '法学院', wrongAlias: [] },
  { official: '商学院', wrongAlias: ['经济学院', '管理学院'] },
  { official: '马克思主义学院', wrongAlias: ['马院', '政治学院'] },
  { official: '历史学院', wrongAlias: ['历史系'] },
  { official: '数学科学学院', wrongAlias: ['数学学院', '数学系'] },
  { official: '物理学院', wrongAlias: ['物理系'] },
  { official: '化学与材料科学学院', wrongAlias: ['化学学院', '化学系'] },
  { official: '生命科学学院', wrongAlias: ['生物学院', '生物系'] },
  { official: '地理科学学院', wrongAlias: ['地理学院', '地理系'] },
  { official: '计算机科学与技术学院', wrongAlias: ['计算机学院', '计算机系'] },
  { official: '电气与自动化工程学院', wrongAlias: ['电气学院', '自动化学院'] },
  { official: '能源与机械工程学院', wrongAlias: ['机械学院'] },
  { official: '美术学院', wrongAlias: ['艺术学院（美术）'] },
  { official: '音乐学院', wrongAlias: ['音乐系'] },
  { official: '体育科学学院', wrongAlias: ['体育学院', '体育系'] },
  { official: '社会发展学院', wrongAlias: ['社会学院'] },
  { official: '心理学院', wrongAlias: ['心理系'] },
  { official: '教育科学学院', wrongAlias: ['教科院'] },
  // 请继续补充……
]

// ——— 校区名称 ———
export const CAMPUSES = {
  main: [
    { official: '仙林校区', location: '南京市栖霞区' },
    { official: '随园校区', location: '南京市鼓楼区' },
    { official: '紫金校区', location: '南京市玄武区' },
  ],
  wrongNames: ['本部', '老校区（需写明随园）'],
}
