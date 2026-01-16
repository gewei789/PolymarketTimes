# Cloudflare Pages 部署指南

## ✅ 可行性

**可以部署到 Cloudflare Pages！**

Cloudflare Pages 支持 Next.js 项目，并且有**免费计划**：
- ✅ 每月 500 次构建（免费）
- ✅ 无限带宽（免费）
- ✅ 每天 100,000 次 Pages Functions 请求（免费）
- ✅ 全球 CDN 加速

## ⚠️ 需要注意的问题

### 1. Runtime 兼容性

你的项目中有一些 API 路由使用了 `runtime = 'nodejs'`，Cloudflare Pages 主要支持 **Edge Runtime**。

需要修改的文件：
- `app/api/ai-chat/route.ts` - 当前：`nodejs`，需要改为：`edge` 或移除
- `app/api/monitor/route.ts` - 当前：`nodejs`
- `app/api/cron/generate-edition/route.ts` - 当前：`nodejs`

**好消息**：你的 AI 聊天 API 调用的是 Cloudflare 自己的 API，应该可以在 Edge Runtime 中正常工作。

### 2. 环境变量配置

需要在 Cloudflare Dashboard 中配置以下环境变量：
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `MIMO_API_KEY`
- `MIMO_API_BASE_URL`
- `MIMO_MODEL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

## 📋 部署步骤

### 方法一：通过 Cloudflare Dashboard（最简单）

1. **登录 Cloudflare**
   - 访问 https://dash.cloudflare.com
   - 登录你的账户

2. **创建 Pages 项目**
   - 点击左侧菜单 **Workers & Pages**
   - 点击 **Create application** → **Pages** → **Connect to Git**
   - 选择你的 Git 仓库（GitHub/GitLab/Bitbucket）
   - 授权 Cloudflare 访问你的仓库

3. **配置构建设置**
   - **Project name**: `polymarket-times`（或你喜欢的名字）
   - **Production branch**: `main` 或 `master`
   - **Framework preset**: `Next.js`
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/`（留空或填 `/`）

4. **配置环境变量**
   - 在构建设置页面，找到 **Environment variables** 部分
   - 点击 **Add variable**
   - 添加所有需要的环境变量（见上方列表）
   - 为每个变量选择环境：Production、Preview、Development（建议全选）

5. **部署**
   - 点击 **Save and Deploy**
   - Cloudflare 会自动开始构建和部署
   - 等待构建完成（通常 2-5 分钟）

6. **自定义域名（可选）**
   - 部署完成后，可以在项目设置中绑定自定义域名
   - 免费计划支持自定义域名

### 方法二：使用 Wrangler CLI

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **在项目根目录创建 `wrangler.toml`**
   ```toml
   name = "polymarket-times"
   pages_build_output_dir = ".next"
   ```

4. **部署**
   ```bash
   wrangler pages deploy .next --project-name=polymarket-times
   ```

## 🔧 需要修改的代码

在部署到 Cloudflare 之前，需要修改 API 路由的 runtime：

### 修改 `app/api/ai-chat/route.ts`

```typescript
// 将这行：
export const runtime = 'nodejs';

// 改为：
export const runtime = 'edge';
// 或者直接删除这行（Next.js 默认使用 edge）
```

### 修改其他使用 nodejs runtime 的 API 路由

检查并修改：
- `app/api/monitor/route.ts`
- `app/api/cron/generate-edition/route.ts`

## 🧪 测试

部署后，测试以下功能：
1. ✅ 首页加载
2. ✅ 市场数据获取
3. ✅ AI 聊天功能
4. ✅ 所有 API 路由

## 💰 免费计划限制

- **构建次数**：每月 500 次（通常足够个人项目使用）
- **Pages Functions 请求**：每天 100,000 次
- **带宽**：无限
- **存储**：无限

对于你的项目，免费计划应该足够使用。

## 🆚 Cloudflare vs Vercel

| 特性 | Vercel | Cloudflare Pages |
|------|--------|------------------|
| 免费构建 | 每月 100 小时 | 每月 500 次 |
| 带宽 | 100GB/月 | **无限** |
| 函数执行时间 | 10 秒 | 30 秒 |
| 全球 CDN | ✅ | ✅ |
| Next.js 支持 | ✅ 原生 | ✅ 需要配置 |
| 自定义域名 | ✅ | ✅ |

## 📝 总结

**推荐**：
- 如果已经在 Vercel 上运行良好，可以继续使用 Vercel
- 如果想使用 Cloudflare 的无限带宽，可以部署到 Cloudflare Pages
- 两个平台可以同时使用（不同的域名）

**部署到 Cloudflare 的步骤**：
1. 修改 API 路由的 runtime（`nodejs` → `edge`）
2. 在 Cloudflare Dashboard 创建 Pages 项目
3. 配置环境变量
4. 连接 Git 仓库并部署

需要我帮你修改 API 路由的 runtime 配置吗？
