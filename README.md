# Dify Vue3 智能客服系统

基于 Dify 工作流的 Vue3 智能客服问答系统，专为您打造。

## 🚀 功能特性

- ✨ **现代化界面**: 采用 Vue3 + Composition API 构建
- 🔄 **流式响应**: 支持实时打字机效果的流式对话
- 💬 **会话持久化**: 保持对话上下文，支持连续对话
- 📱 **响应式设计**: 完美适配桌面端和移动端
- 🎨 **美观UI**: 渐变色彩和流畅动画效果
- ⚡ **高性能**: 基于 Vite 构建，快速开发和部署

## 🛠️ 技术栈

- **前端框架**: Vue 3.3+
- **构建工具**: Vite 4.4+
- **HTTP 客户端**: Fetch API (原生)
- **CSS 预处理**: 原生 CSS3 (支持变量和动画)
- **Markdown 渲染**: Marked.js
- **开发语言**: JavaScript ES6+

## 📋 系统要求

- Node.js 16.0+
- npm 7.0+ 或 yarn 1.22+
- 现代浏览器 (Chrome 88+, Firefox 78+, Safari 14+)

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API

编辑 `src/composables/useDifyChat.js` 文件，确认以下配置：

```javascript
// Dify API配置
const API_BASE_URL = '/v1'
const API_KEY = '' // 您的 Dify API Key
```

### 3. 启动开发服务器

```bash
npm run dev
```

浏览器访问 `http://localhost:3000` 即可使用。

### 4. 构建生产版本

```bash
npm run build
```

## 🔧 配置说明

### API 配置

项目默认配置了代理，将 `/v1` 路径代理到本地 Dify 服务：

```javascript
// vite.config.js
proxy: {
  '/v1': {
    target: 'http://127.0.0.1',
    changeOrigin: true,
    secure: false
  }
}
```

### Dify 工作流集成

系统集成了完整的 Dify 工作流事件处理：

- `workflow_started`: 工作流开始执行
- `node_started`: 节点开始执行  
- `node_finished`: 节点执行完成
- `message`: 流式文本消息
- `message_end`: 消息结束
- `workflow_finished`: 工作流完成

## 📁 项目结构

```
dify-vue3-chat-demo/
├── public/                 # 静态资源
├── src/
│   ├── components/         # Vue 组件
│   │   └── ChatInterface.vue
│   ├── composables/        # 组合式函数
│   │   └── useDifyChat.js
│   ├── App.vue            # 根组件
│   └── main.js            # 应用入口
├── index.html             # HTML 模板
├── vite.config.js         # Vite 配置
├── package.json           # 项目配置
└── README.md              # 项目说明
```

## 🎯 使用指南

### 基本对话

1. 在输入框中输入问题
2. 点击"发送"按钮或按 Enter 键
3. 系统将实时显示 AI 的回复

### 会话管理

- 系统自动维护会话上下文
- 支持连续多轮对话
- 会话 ID 自动生成和管理

### 支持的查询示例

- "有几个羽毛球场？"
- "羽毛球馆的开放时间是什么？"
- "如何预订羽毛球场地？"
- "场馆位置在哪里？"

## 🔍 API 接口说明

### 发送聊天消息

```javascript
// 请求格式
{
  "query": "用户输入的问题",
  "response_mode": "streaming",
  "conversation_id": "会话ID（可选）",
  "user": "用户标识",
  "inputs": {},
  "files": []
}

// 响应格式（流式）
data: {"event": "message", "answer": "回复内容", ...}
data: {"event": "message_end", "metadata": {...}}
```

## 🐛 故障排除

### 常见问题

1. **API 连接失败**
   - 检查 Dify 服务是否正常运行
   - 确认 API Key 是否正确
   - 检查网络连接

2. **消息显示异常**
   - 检查浏览器控制台错误信息
   - 确认 Marked.js 是否正确加载

3. **流式响应中断**
   - 检查网络稳定性
   - 确认服务器 SSE 支持

### 开发调试

开启浏览器开发者工具，查看控制台日志：

```javascript
console.log('发送请求到Dify API:', requestBody)
console.log('收到数据块:', data)
console.log('工作流完成:', data.data.status)
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Dify](https://dify.ai/) - 提供强大的 AI 工作流平台
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

---

💡 **提示**: 如果您在使用过程中遇到任何问题，请查看项目 Issues 或创建新的 Issue。 