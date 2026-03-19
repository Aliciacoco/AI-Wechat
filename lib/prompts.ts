import { AccountProfile, BenchmarkArticle } from './dataAnalysis'

export function buildSystemPrompt(account: AccountProfile): string {
  const { positioning, contentDNA, brandAssets } = account

  const landmarks = brandAssets?.landmarks?.join('、') || ''
  const symbols = brandAssets?.culturalSymbols?.join('、') || ''
  const forbidden = contentDNA.forbiddenStyle?.join('；') || ''
  const mustHave = contentDNA.mustHaveElements?.join('；') || ''

  return `你是${account.school}「${account.name}」微信公众号的资深内容编辑。

【账号定位】
${positioning.oneLiner}

【核心受众】
主要：${positioning.primaryAudience.join('、')}
${positioning.secondaryAudience ? `次要：${positioning.secondaryAudience.join('、')}` : ''}

【内容使命】
${positioning.contentMission}

【内容风格】
基调关键词：${contentDNA.toneKeywords.join('、')}
标志性内容：${contentDNA.signatureContent.join('、')}
${forbidden ? `禁止风格：${forbidden}` : ''}
${mustHave ? `必须包含：${mustHave}` : ''}

【品牌资产】
${landmarks ? `专属地标：${landmarks}` : ''}
${symbols ? `文化符号：${symbols}` : ''}

【运营指标】
核心KPI：${positioning.coreKPI.join('、')}

请严格基于以上账号定位输出内容，确保每一条建议都与该账号的受众和使命相匹配。`
}

export function buildRecommendPrompt(
  account: AccountProfile,
  hotKeyword: string,
  topTitles: string[],
  currentDate: string
): string {
  return `${buildSystemPrompt(account)}

---

当前日期：${currentDate}
当前热点关键词：「${hotKeyword}」

以下是该账号历史上阅读量最高的文章标题（供参考风格）：
${topTitles.slice(0, 20).join('\n')}

---

请结合这个热点关键词，为该公众号生成 3 个有差异化的选题方向。

每个选题严格按以下 JSON 格式输出（输出纯 JSON 数组，不要有任何额外文字）：
[
  {
    "title": "选题标题（不超过20字，有吸引力）",
    "angle": "核心切入角度（2句话，说明为什么这样切入）",
    "audience": "目标受众",
    "reason": "为什么现在做这个选题（时效性 + 账号匹配度）"
  }
]`
}

export function buildScorePrompt(
  account: AccountProfile,
  userIdea: string,
  topTitles: string[],
  currentDate: string,
  selfBenchmarks?: BenchmarkArticle[],
  competitorBenchmarks?: BenchmarkArticle[],
  competitorSchool?: string
): string {
  const selfBlock = selfBenchmarks && selfBenchmarks.length > 0
    ? `\n本账号历史同类文章参照（按阅读量排序）：\n${selfBenchmarks.map(a =>
        `- 「${a.title}」${(a.readCount / 10000).toFixed(1)}万阅读`).join('\n')}\n本账号同类均值：${(selfBenchmarks.reduce((s, a) => s + a.readCount, 0) / selfBenchmarks.length / 10000).toFixed(1)}万`
    : ''

  const compBlock = competitorBenchmarks && competitorBenchmarks.length > 0
    ? `\n竞品学校（${competitorSchool || '竞品'}）同类文章参照（按阅读量排序）：\n${competitorBenchmarks.map(a =>
        `- 「${a.title}」${(a.readCount / 10000).toFixed(1)}万阅读`).join('\n')}\n竞品同类均值：${(competitorBenchmarks.reduce((s, a) => s + a.readCount, 0) / competitorBenchmarks.length / 10000).toFixed(1)}万`
    : ''

  return `${buildSystemPrompt(account)}

---

当前日期：${currentDate}

用户的选题想法：
「${userIdea}」

该账号历史高阅读文章参考（前20篇）：
${topTitles.slice(0, 20).join('\n')}
${selfBlock}
${compBlock}

---

请从以下4个维度对这个选题进行评分（每项0-25分），并给出总体评价。
评分必须结合上方的本账号历史参照和竞品参照来校准，使分数有实际参考意义。
在 summary 字段中，请直接提及竞品案例的阅读量数据，让分数有具体支撑。

严格按以下 JSON 格式输出（输出纯 JSON，不要有任何额外文字）：
{
  "scores": {
    "emotion": { "score": 0, "label": "情绪触发强度", "reason": "1-2句分析" },
    "audience": { "score": 0, "label": "受众覆盖面", "reason": "1-2句分析" },
    "timeliness": { "score": 0, "label": "时效性", "reason": "1-2句分析" },
    "uniqueness": { "score": 0, "label": "差异化程度", "reason": "1-2句分析" }
  },
  "total": 0,
  "grade": "优秀/良好/一般/待改进",
  "summary": "一句话总评，需引用竞品或本账号历史数据作为参照（如：竞品同类文章最高2.5万，本选题执行得当可达类似量级）",
  "suggestions": ["具体改进建议1", "具体改进建议2", "具体改进建议3"]
}`
}

export function buildTitlesPrompt(
  account: AccountProfile,
  topic: string,
  topTitles: string[]
): string {
  return `${buildSystemPrompt(account)}

---

已确定的选题方向：
「${topic}」

该账号历史高阅读标题风格参考：
${topTitles.slice(0, 15).join('\n')}

---

请为该选题生成 8 个候选标题，覆盖以下4种类型（每种至少1个）：
- 情感共鸣型：触动内心，引发回忆或共鸣
- 荣耀触发型：激发自豪感或好奇心
- 悬念好奇型：制造阅读期待，让人想点进去
- 信息实用型：清晰传达内容价值

标题规则：
- 不超过 20 字
- 优先融入该账号的品牌元素（地标/IP/称呼）
- 禁止官话套话（圆满举行、积极推进等）
- 要有具体画面感或情绪锚点

爆款标题创作技巧（可选参考，灵活运用）：
1. 数字+信息量：用具体数字制造价值感
   参考：「开学第一周，这些小技巧能帮你少踩10个坑！」

2. 悬念制造：用"可能""最后一次"等词制造紧迫感和好奇
   参考：「这可能是你今年最后一次对深大"指指点点"」

3. 热点+关联：结合社会热点（如 DeepSeek、AI工具等）与学校场景
   参考：「开学焦虑退退退！BNUer速来认领DeepSeek开学急救包！」

4. 情感共鸣+反差：用口语化表达+角色认同打动读者
   参考：「喂！你才不是这个世界的NPC！」

5. 场景具象化：用"第一次""那一刻""凌晨三点"等具体场景

6. 疑问句/祈使句：直接对话感，增强代入

7. 符号化元素：善用「」｜、！？等标点增强节奏感

严格按以下 JSON 格式输出（输出纯 JSON 数组，不要有任何额外文字）：
[
  {
    "title": "标题文本",
    "type": "情感共鸣型/荣耀触发型/悬念好奇型/信息实用型",
    "appeal": "高/中/低",
    "reason": "一句话说明吸引力来源"
  }
]`
}
