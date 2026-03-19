# AI 提供商配置指南

本项目支持多个 AI 提供商，您可以根据需求选择使用 KIMI 或 DeepSeek。

## 支持的 AI 提供商

| 提供商 | 响应速度 | 价格 | 速率限制 | 推荐场景 |
|--------|----------|------|----------|----------|
| **KIMI** (Moonshot AI) | 6-15秒 | 较贵 | 较严格 | 对响应质量要求高 |
| **DeepSeek** | 2-5秒 ⚡ | 便宜 (1/10价格) | 宽松 | 推荐！速度快、成本低 |

## 价格对比

### KIMI (Moonshot AI)
```
输入: ¥0.012/1K tokens
输出: ¥0.012/1K tokens
```

### DeepSeek
```
输入: ¥0.001/1K tokens (便宜 12 倍!)
输出: ¥0.002/1K tokens (便宜 6 倍!)
```

## 切换到 DeepSeek（推荐）

### 1. 获取 DeepSeek API Key

访问 [DeepSeek 开放平台](https://platform.deepseek.com/)：
1. 注册/登录账号
2. 进入控制台创建 API Key
3. 复制生成的密钥（格式：`sk-xxxxx...`）

### 2. 配置环境变量

#### 本地开发

编辑 `.env.local` 文件：

```bash
# 选择 AI 提供商（kimi 或 deepseek）
AI_PROVIDER=deepseek

# DeepSeek API Key
DEEPSEEK_API_KEY=sk-your-deepseek-key-here

# KIMI API Key（可选，保留作为备用）
KIMI_API_KEY=sk-your-kimi-key-here
```

#### Vercel 部署

在 Vercel Dashboard 中配置环境变量：

1. 登录 Vercel → 选择项目 → Settings → Environment Variables
2. 添加以下变量：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `AI_PROVIDER` | `deepseek` | Production + Preview + Development |
| `DEEPSEEK_API_KEY` | `sk-xxxxx...` | Production + Preview + Development |

3. 保存并重新部署

#### Railway / Render 部署

在平台的环境变量配置中添加：
```
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=sk-your-deepseek-key-here
```

### 3. 重启服务

```bash
# 本地开发
npm run dev

# 生产环境
# Vercel: 自动重新部署
# Railway/Render: 推送代码后自动部署
```

### 4. 验证配置

启动后查看控制台日志：
```
✅ 使用 AI 提供商: DeepSeek (deepseek)
```

如果看到以上日志，说明配置成功！

## 切换回 KIMI

如果需要切换回 KIMI：

```bash
# .env.local
AI_PROVIDER=kimi
KIMI_API_KEY=sk-your-kimi-key-here
```

重启服务后生效。

## 性能对比测试

### 标题生成速度

**KIMI (Moonshot AI)**：
```
🤖 Calling KIMI API (attempt 1/3) with model: moonshot-v1-8k
⏳ 等待 8-15 秒...
✅ KIMI API response received
```

**DeepSeek**：
```
🤖 Calling DeepSeek API (attempt 1/3) with model: deepseek-chat
⏳ 等待 2-5 秒...
✅ DeepSeek API response received
```

**速度提升：约 3-5 倍！**

### 成本对比（生成 4 个标题）

假设每次生成：
- 输入 tokens: ~2000 (含 RAG 知识库)
- 输出 tokens: ~800 (4 个标题 + JSON)

**KIMI**：
```
成本 = (2000 × 0.012 + 800 × 0.012) / 1000 = ¥0.0336
```

**DeepSeek**：
```
成本 = (2000 × 0.001 + 800 × 0.002) / 1000 = ¥0.0036
```

**节省成本：约 90%！**

## 常见问题

### Q: DeepSeek 的质量如何？
A: DeepSeek-V3 是目前国内领先的开源模型，质量接近 GPT-4，完全满足标题生成、内容推荐等需求。

### Q: 可以同时配置两个 API Key 吗？
A: 可以！在 `.env.local` 中同时配置，通过 `AI_PROVIDER` 环境变量切换。

### Q: 如果 DeepSeek 速率限制怎么办？
A: DeepSeek 的速率限制比 KIMI 宽松很多，但如果遇到限制：
1. 代码已经实现了自动重试机制（指数退避）
2. 可以临时切换回 KIMI：`AI_PROVIDER=kimi`

### Q: 已有的代码需要改动吗？
A: 不需要！所有 AI 调用函数都已适配，只需修改环境变量即可。

### Q: 模型选择会影响功能吗？
A: 不会。两个模型都支持：
- ✅ 标题生成（4种风格）
- ✅ 历史文章搜索
- ✅ 名校对标案例
- ✅ 推荐主题生成
- ✅ RAG 知识库集成

## 推荐配置

### 开发环境
```bash
AI_PROVIDER=deepseek  # 快速迭代测试
```

### 生产环境
```bash
AI_PROVIDER=deepseek  # 降低运营成本，提升用户体验
```

## 技术实现

项目使用统一的 `lib/ai.ts` 模块管理 AI 调用：

```typescript
// 自动根据 AI_PROVIDER 切换配置
const aiConfig = {
  kimi: {
    apiKey: process.env.KIMI_API_KEY,
    baseURL: 'https://api.moonshot.cn/v1',
    model: 'moonshot-v1-8k',
  },
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com',
    model: 'deepseek-chat',
  },
}

// 统一的 chat 函数，自动适配不同提供商
export async function chat(messages, model?) { ... }
```

所有业务代码无需改动，自动使用配置的 AI 提供商。

## 联系支持

遇到问题？
1. 查看 [DeepSeek 文档](https://platform.deepseek.com/docs)
2. 查看 [Moonshot AI 文档](https://platform.moonshot.cn/docs)
3. 提交 [GitHub Issue](https://github.com/Aliciacoco/AI-Wechat/issues)
