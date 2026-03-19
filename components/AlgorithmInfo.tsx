'use client'

import { HelpCircle, X } from 'lucide-react'
import { useState } from 'react'

export default function AlgorithmInfo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* 问号按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full transition-all"
        style={{
          backgroundColor: 'var(--background-secondary)',
          color: 'var(--foreground-tertiary)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--primary-light)'
          e.currentTarget.style.color = 'var(--primary)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--background-secondary)'
          e.currentTarget.style.color = 'var(--foreground-tertiary)'
        }}
        title="查看算法规则"
      >
        <HelpCircle size={14} />
      </button>

      {/* 弹出层 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 遮罩 */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          {/* 内容 */}
          <div
            className="relative bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            style={{ boxShadow: 'var(--shadow-lg)' }}
          >
            {/* 头部 */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                产品核心逻辑 & 提示词设计
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                style={{ color: 'var(--foreground-tertiary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* 内容 */}
            <div className="p-6 space-y-6">
              {/* 产品核心逻辑 */}
              <div>
                <h4 className="text-base font-bold mb-3" style={{ color: 'var(--foreground)' }}>
                  📋 产品核心逻辑
                </h4>
                <div className="space-y-3">
                  <div className="rounded-lg p-4 border" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-sm font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                      1️⃣ 三维灵感来源
                    </div>
                    <ul className="text-xs space-y-1" style={{ color: 'var(--foreground-secondary)' }}>
                      <li>• <strong>全网热点</strong>：实时抓取微博、抖音、小红书等平台的教育类热门话题</li>
                      <li>• <strong>节点日历</strong>：结合校历、节气、节日等时间节点推荐选题</li>
                      <li>• <strong>内容平衡</strong>：分析近期发文类型分布，推荐稀缺内容类别</li>
                    </ul>
                  </div>

                  <div className="rounded-lg p-4 border" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-sm font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                      2️⃣ AI 智能推荐机制
                    </div>
                    <ul className="text-xs space-y-1" style={{ color: 'var(--foreground-secondary)' }}>
                      <li>• <strong>实时生成</strong>：点击"换一条"时调用 KIMI API 实时生成个性化推荐</li>
                      <li>• <strong>权重算法</strong>：基于时间节点、学校动态、热点关联度智能分配权重（5-10分）</li>
                      <li>• <strong>上下文感知</strong>：结合当前季节、校历事件、近期热点生成推荐</li>
                      <li>• <strong>双重保障</strong>：API 失败时自动降级到本地权重随机选择</li>
                    </ul>
                  </div>

                  <div className="rounded-lg p-4 border" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-sm font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                      3️⃣ AI 生成流程（三层架构）
                    </div>
                    <ul className="text-xs space-y-1" style={{ color: 'var(--foreground-secondary)' }}>
                      <li>• <strong>第一层：AI 标题推荐</strong>
                        <ul className="ml-4 mt-1 space-y-0.5" style={{ color: 'var(--foreground-tertiary)' }}>
                          <li>- 生成 4 个不同风格的标题（情感、荣耀、悬念、实用）</li>
                          <li>- 为每个标题标注预估浏览量、语气、热点关联</li>
                          <li>- 提供详细的推荐理由和目标受众</li>
                        </ul>
                      </li>
                      <li>• <strong>第二层：历史本校回溯</strong>
                        <ul className="ml-4 mt-1 space-y-0.5" style={{ color: 'var(--foreground-tertiary)' }}>
                          <li>- 搜索本校历史文章中的相似主题</li>
                          <li>- 分析过往数据表现（阅读量、点赞数）</li>
                          <li>- 默认展示 1 条，点击"查看更多"展开</li>
                        </ul>
                      </li>
                      <li>• <strong>第三层：名校参考对标</strong>
                        <ul className="ml-4 mt-1 space-y-0.5" style={{ color: 'var(--foreground-tertiary)' }}>
                          <li>- 检索北大、清华、复旦等名校的优秀案例</li>
                          <li>- 标记爆款文章（阅读量过万）</li>
                          <li>- 默认展示 1 条，点击"查看更多"展开</li>
                        </ul>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-lg p-4 border" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-sm font-semibold mb-2" style={{ color: 'var(--primary)' }}>
                      4️⃣ 首页推荐主题逻辑
                    </div>
                    <ul className="text-xs space-y-1" style={{ color: 'var(--foreground-secondary)' }}>
                      <li>• <strong>初始化</strong>：页面加载时为每个账号基于权重随机选择一个推荐</li>
                      <li>• <strong>换一条</strong>：点击按钮时调用 API 生成新推荐，1-3秒内完成</li>
                      <li>• <strong>多账号独立</strong>：南京师大、南师招生各自独立维护推荐状态</li>
                      <li>• <strong>去创作</strong>：点击后打开 AI 生成弹窗，展示三层架构结果</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6" style={{ borderColor: 'var(--border)' }}>
                <h4 className="text-base font-bold mb-3" style={{ color: 'var(--foreground)' }}>
                  ✨ 标题生成提示词
                </h4>

                <div className="space-y-3">
                  {/* 系统角色 */}
                  <div>
                    <div className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                      系统角色设定
                    </div>
                    <div className="rounded-lg p-3 text-xs font-mono" style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--foreground-secondary)' }}>
                      你是南京师范大学「南京师大」微信公众号的资深内容编辑<br/>
                      基于账号定位、核心受众、内容使命、风格基调、品牌资产等维度输出内容
                    </div>
                  </div>

                  {/* 输入信息 */}
                  <div>
                    <div className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                      输入信息
                    </div>
                    <ul className="text-xs space-y-1" style={{ color: 'var(--foreground-secondary)' }}>
                      <li>• 已确定的选题方向（用户输入）</li>
                      <li>• 该账号历史高阅读标题风格参考（前15篇）</li>
                    </ul>
                  </div>

                  {/* 生成要求 */}
                  <div>
                    <div className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                      生成要求
                    </div>
                    <ul className="text-xs space-y-1" style={{ color: 'var(--foreground-secondary)' }}>
                      <li>• 生成 4 个候选标题，覆盖 4 种类型（每种1个）</li>
                      <li className="ml-4">- <strong>情感共鸣型</strong>：触动内心，引发回忆或共鸣</li>
                      <li className="ml-4">- <strong>荣耀触发型</strong>：激发自豪感或好奇心</li>
                      <li className="ml-4">- <strong>悬念好奇型</strong>：制造阅读期待，让人想点进去</li>
                      <li className="ml-4">- <strong>信息实用型</strong>：清晰传达内容价值</li>
                      <li>• 每个标题必须包含：预估浏览量、语气标签、热点关联、目标受众</li>
                    </ul>
                  </div>

                  {/* 标题规则 */}
                  <div>
                    <div className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                      标题规则
                    </div>
                    <ul className="text-xs space-y-1" style={{ color: 'var(--foreground-secondary)' }}>
                      <li>• 不超过 20 字</li>
                      <li>• 优先融入该账号的品牌元素（地标/IP/称呼）</li>
                      <li>• 禁止官话套话（圆满举行、积极推进等）</li>
                      <li>• 要有具体画面感或情绪锚点</li>
                    </ul>
                  </div>

                  {/* 爆款技巧 */}
                  <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--primary-light)' }}>
                    <div className="text-sm font-semibold mb-3" style={{ color: 'var(--primary)' }}>
                      💡 爆款标题创作技巧（可选参考）
                    </div>
                    <div className="space-y-2 text-xs" style={{ color: 'var(--foreground-secondary)' }}>
                      <div>
                        <strong>1. 数字+信息量</strong>：用具体数字制造价值感<br/>
                        <span className="text-xs italic" style={{ color: 'var(--foreground-tertiary)' }}>
                          示例：「开学第一周，这些小技巧能帮你少踩10个坑！」
                        </span>
                      </div>
                      <div>
                        <strong>2. 悬念制造</strong>：用"可能""最后一次"等词制造紧迫感<br/>
                        <span className="text-xs italic" style={{ color: 'var(--foreground-tertiary)' }}>
                          示例：「这可能是你今年最后一次对深大"指指点点"」
                        </span>
                      </div>
                      <div>
                        <strong>3. 热点+关联</strong>：结合社会热点与学校场景<br/>
                        <span className="text-xs italic" style={{ color: 'var(--foreground-tertiary)' }}>
                          示例：「开学焦虑退退退！BNUer速来认领DeepSeek开学急救包！」
                        </span>
                      </div>
                      <div>
                        <strong>4. 情感共鸣+反差</strong>：用口语化表达+角色认同<br/>
                        <span className="text-xs italic" style={{ color: 'var(--foreground-tertiary)' }}>
                          示例：「喂！你才不是这个世界的NPC！」
                        </span>
                      </div>
                      <div>
                        <strong>5. 场景具象化</strong>：用"第一次""那一刻""凌晨三点"等具体场景
                      </div>
                      <div>
                        <strong>6. 疑问句/祈使句</strong>：直接对话感，增强代入
                      </div>
                      <div>
                        <strong>7. 符号化元素</strong>：善用「」｜、！？等标点增强节奏感
                      </div>
                    </div>
                  </div>

                  {/* 输出格式 */}
                  <div>
                    <div className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                      输出格式
                    </div>
                    <div className="rounded-lg p-3 text-xs font-mono overflow-x-auto" style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--foreground-secondary)' }}>
{`[
  {
    "title": "标题文本",
    "type": "情感共鸣型/荣耀触发型/悬念好奇型/信息实用型",
    "appeal": "高/中/低",
    "reason": "一句话说明吸引力来源"
  }
]`}
                    </div>
                  </div>
                </div>
              </div>

              {/* 说明 */}
              <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--background-secondary)' }}>
                <p className="text-xs" style={{ color: 'var(--foreground-tertiary)' }}>
                  💡 提示：提示词会动态注入账号 DNA、历史爆款标题、校本资料库等上下文，确保生成内容符合账号定位和风格。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
