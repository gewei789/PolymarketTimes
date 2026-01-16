# Vercel 环境变量配置指南

## 为什么需要配置？

`.env.local` 文件**只在本地开发时有效**。Vercel 部署时出于安全考虑，不会读取 `.env.local` 文件，必须在 Vercel 项目设置中手动配置环境变量。

## 配置步骤

### 1. 登录 Vercel

访问 [vercel.com](https://vercel.com) 并登录你的账户。

### 2. 进入项目设置

1. 点击你的项目
2. 点击顶部菜单的 **Settings**
3. 在左侧菜单中找到 **Environment Variables**

### 3. 添加环境变量

点击 **Add New** 按钮，添加以下两个环境变量：

#### 变量 1: CLOUDFLARE_ACCOUNT_ID
- **Key**: `CLOUDFLARE_ACCOUNT_ID`
- **Value**: 你的 Cloudflare Account ID（从 `.env.local` 中复制）
- **Environment**: 选择 `Production`, `Preview`, `Development`（全选）

#### 变量 2: CLOUDFLARE_API_TOKEN
- **Key**: `CLOUDFLARE_API_TOKEN`
- **Value**: 你的 Cloudflare API Token（从 `.env.local` 中复制）
- **Environment**: 选择 `Production`, `Preview`, `Development`（全选）

### 4. 保存并重新部署

1. 点击 **Save** 保存所有环境变量
2. 回到项目页面
3. 点击 **Deployments** 标签
4. 找到最新的部署，点击右侧的 **...** 菜单
5. 选择 **Redeploy**

或者直接推送新的代码来触发重新部署。

## 验证配置

部署完成后，测试聊天功能：
1. 打开你的网站
2. 点击右下角的 AI 头像
3. 发送一条测试消息
4. 如果配置正确，应该能收到 AI 回复

## 常见问题

### Q: 为什么本地可以，Vercel 不行？
A: 因为 `.env.local` 只在本地开发时有效，Vercel 需要单独配置环境变量。

### Q: 环境变量配置后还是不工作？
A: 
1. 确保环境变量名称完全正确（大小写敏感）
2. 确保值没有多余的空格或引号
3. 确保选择了正确的环境（Production/Preview/Development）
4. 重新部署项目

### Q: 如何查看 Vercel 的环境变量？
A: 在 Vercel 项目设置的 Environment Variables 页面可以看到所有已配置的变量（值会被隐藏）。

### Q: 可以批量导入环境变量吗？
A: 可以，Vercel CLI 支持通过 `vercel env pull` 和 `vercel env add` 命令管理环境变量。

## 安全提示

⚠️ **重要**：
- 不要将 `.env.local` 文件提交到 Git
- 确保 `.env.local` 在 `.gitignore` 中
- 环境变量值在 Vercel 中会被加密存储
- 不要分享你的 API Token
