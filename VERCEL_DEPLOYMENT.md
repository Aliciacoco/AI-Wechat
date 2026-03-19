# Vercel 部署指南

## 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `KIMI_API_KEY` | Moonshot AI (KIMI) API 密钥 | `sk-xxxxxxxxxxxxxxxxxx` |

### 获取 KIMI API Key

1. 访问 [Moonshot AI 平台](https://platform.moonshot.cn/)
2. 注册/登录账号
3. 进入控制台创建 API Key
4. 复制生成的密钥（格式：`sk-xxxxx...`）

### 在 Vercel 中配置

1. 登录 Vercel Dashboard
2. 选择项目 → Settings → Environment Variables
3. 添加 `KIMI_API_KEY` 并粘贴您的 API Key
4. 选择所有环境（Production + Preview + Development）
5. 保存并重新部署

## 常见问题排查

### 1. API 调用失败

**现象**：点击"生成"或"换一条"按钮无反应或报错

**可能原因**：

#### A. 环境变量未配置
- 检查 Vercel Settings → Environment Variables 中是否已添加 `KIMI_API_KEY`
- 确认 API Key 格式正确（以 `sk-` 开头）
- 配置后需要重新部署项目

#### B. Vercel 免费版超时（10秒限制）
- Vercel 免费版 Serverless 函数最长运行 10 秒
- KIMI API 调用可能需要 5-15 秒
- **解决方案**：
  1. 升级 Vercel Pro（支持 60 秒）
  2. 或使用其他部署平台（Railway, Render 等）
  3. 或在代码中已添加 `maxDuration: 60`（需 Pro 版）

#### C. 网络连接问题
- Vercel 服务器在海外，连接 Moonshot API 可能存在网络问题
- 本地能用但 Vercel 不能用，通常是这个原因
- **解决方案**：
  1. 检查 KIMI API 是否支持海外访问
  2. 联系 Moonshot 客服确认 API 域名可访问性
  3. 考虑使用代理或其他 AI 服务

#### D. API Key 额度或权限问题
- API Key 余额不足
- API Key 权限受限
- **解决方案**：登录 Moonshot 控制台检查账户状态

### 2. 查看 Vercel 日志

部署后查看实时日志：

1. Vercel Dashboard → 项目 → Deployments
2. 点击最新部署
3. 查看 "Functions" 标签下的日志
4. 搜索带有 emoji 的日志标记：
   - 📥 请求接收
   - 🤖 API 调用
   - ✅ 成功
   - ❌ 错误

### 3. 本地测试 Vercel 环境

```bash
# 安装 Vercel CLI
npm i -g vercel

# 本地运行 Vercel 环境
vercel dev

# 添加环境变量
vercel env add KIMI_API_KEY
```

## 性能优化建议

### 1. 超时时间配置

已在 `/app/api/generate/route.ts` 中配置：

```typescript
export const maxDuration = 60 // 需要 Vercel Pro
```

Vercel 免费版限制：
- Edge Functions: 30秒
- Serverless Functions: 10秒

### 2. API 调用优化

已添加的优化：
- 超时时间：30秒
- 自动重试：2次
- 详细日志：方便排查问题

```typescript
const kimi = new OpenAI({
  apiKey: process.env.KIMI_API_KEY,
  baseURL: 'https://api.moonshot.cn/v1',
  timeout: 30000,    // 30秒超时
  maxRetries: 2,     // 重试2次
})
```

## 调试技巧

### 1. 查看具体错误信息

前端代码会显示详细错误：
- "API Key 未配置" → 环境变量问题
- "API 请求超时" → 超时问题（升级 Pro 或换平台）
- "网络连接失败" → 网络问题
- "API 调用频率超限" → 配额问题

### 2. 测试 API Key 是否有效

在本地运行：

```bash
# 设置环境变量
export KIMI_API_KEY=sk-your-key-here

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000 测试
```

如果本地可以用，说明 API Key 有效，问题在 Vercel 环境。

### 3. 检查网络连接

Vercel 部署后，在浏览器开发者工具中：
- Network 标签查看 API 请求
- Console 查看前端错误
- 记录错误信息以便排查

## 推荐配置

### 生产环境最佳实践

1. ✅ 使用 Vercel Pro（支持 60 秒超时）
2. ✅ 配置 CDN 加速静态资源
3. ✅ 监控 API 调用次数和费用
4. ✅ 设置错误告警

### 备选部署方案

如果 Vercel 免费版超时：
- **Railway**：支持长时间运行
- **Render**：免费版支持更长超时
- **Cloudflare Pages + Workers**：全球加速
- **自建服务器**：完全控制

## 联系支持

遇到问题？
1. 查看 [Vercel 文档](https://vercel.com/docs)
2. 查看 [Moonshot AI 文档](https://platform.moonshot.cn/docs)
3. 提交 [GitHub Issue](https://github.com/Aliciacoco/AI-Wechat/issues)
