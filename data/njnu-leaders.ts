/**
 * 南京师范大学现任领导名单
 * 来源：https://www.njnu.edu.cn/xxgk/jgsz.htm
 * 最后同步：2026年3月
 */

export interface Leader {
  name: string
  title: string
  shortTitle?: string
  party?: boolean
}

export const NJNU_LEADERS: Leader[] = [
  { name: '尚庆飞', title: '党委书记', party: true },
  { name: '华桂宏', title: '党委副书记、校长', party: true },
  { name: '孙友莲', title: '党委副书记', party: true },
  { name: '贲国栋', title: '党委副书记', party: true },
  { name: '张连红', title: '党委常委、副校长', party: true },
  { name: '程天君', title: '党委常委、副校长', party: true },
  { name: '黄和',   title: '副校长' },
  { name: '岳嵩',   title: '党委常委、副校长', party: true },
  { name: '袁林旺', title: '副校长' },
  { name: '蒋彩霞', title: '党委常委、纪委书记', party: true },
]

/**
 * 常见错误称谓（AI 审核时检测）
 */
export const LEADER_COMMON_MISTAKES = [
  '院长',     // 南师大一把手称"校长"，不称"院长"
  '书记校长', // 语序错误
]
