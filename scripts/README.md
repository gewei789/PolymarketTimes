# Cloudflare AI API 测试脚本

## 使用方法

### 1. 安装依赖

首先确保安装了 `tsx`（如果还没有）：

```bash
npm install --save-dev tsx
```

### 2. 配置环境变量

确保 `.env.local` 文件中有以下变量：

```
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_AUTH_TOKEN=your_auth_token
```

### 3. 运行测试

```bash
npm run test:ai
```

或者直接使用 tsx：

```bash
npx tsx scripts/test-cloudflare-ai.ts
```

## 测试内容

脚本会：
1. 读取 `.env.local` 中的 Cloudflare 凭证
2. 发送测试消息到 Cloudflare AI API
3. 显示完整的请求和响应信息
4. 尝试解析不同格式的响应

## 预期输出

如果 API 正常工作，你会看到：
- ✅ 请求成功（状态码 200）
- ✅ 响应内容被正确解析
- ✅ 提取的 AI 回复消息

如果出现问题，脚本会显示详细的错误信息，帮助你调试。

## 故障排除

### 错误：Missing CLOUDFLARE_ACCOUNT_ID
- 检查 `.env.local` 文件是否存在
- 确认变量名拼写正确
- 确认变量值没有多余的引号或空格

### 错误：API call failed
- 检查 Account ID 和 Auth Token 是否正确
- 确认 Cloudflare 账户有 Workers AI 访问权限
- 检查网络连接

### 错误：Could not extract message
- 查看完整的响应 JSON
- 可能需要根据实际响应格式调整解析逻辑
