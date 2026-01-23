# AICowork

<div align="center">

# 🤖 AI 智能协作助手
### 您的全天候 AI 办公伙伴，让工作效率翻倍

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE.txt)
[![Version](https://img.shields.io/badge/version-0.1.0-orange.svg)](https://github.com/Pan519/AICowork/releases)
[![Electron](https://img.shields.io/badge/Electron-39.2.7-9FEAF9.svg)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg)](https://www.typescriptlang.org/)
[![Stars](https://img.shields.io/github/stars/Pan519/AICowork?style=social)](https://github.com/Pan519/AICowork/stargazers)

[English](./README_EN.md) | 简体中文 | [功能演示](#-功能演示) | [快速开始](#-快速开始) | [文档中心](#-文档中心) | [贡献指南](#-贡献指南)

</div>

---

## 📖 项目简介

**AICowork** 是一款基于 Electron + React 19 + TypeScript 构建的现代化桌面 AI 智能协作助手。通过集成 60+ 主流 AI 服务商，提供强大的 AI 对话、本地知识库、技能扩展等核心能力，帮助用户在办公、学习、创作等多个场景中显著提升效率。

### 🎯 核心价值

| 💡 **智能对话** | 基于大模型的自然语言交互，支持多厂商 API |
|:---|:---|
| 🧠 **记忆系统** | 本地向量知识库，AI 持久化记住重要信息 |
| 🔧 **技能扩展** | 自定义技能 + MCP 协议，无限扩展 AI 能力 |
| 🛡️ **隐私安全** | 数据本地存储，API Key 加密保护 |
| 🌍 **多语言** | 支持 10+ 语言界面，全球化用户体验 |
| ⚡ **高性能** | React 19 + 并发渲染，流畅的交互体验 |

### 🎯 适用场景

```
💼 办公协作      📚 学习辅助      🎨 创意工作      📊 数据分析
   └─ 文档撰写      └─ 知识问答      └─ 头脑风暴      └─ 报告生成
   └─ 会议记录      └─ 要点总结      └─ 创意生成      └─ 趋势分析
   └─ 邮件回复      └─ 概念解释      └─ 内容策划      └─ 数据解读
```

---

## ✨ 功能特性

### 1. 🤖 AI 对话系统

#### 多厂商 API 支持（60+）

**国内厂商**
- 智谱 AI (GLM)、DeepSeek、阿里云通义千问、百度文心一言
- 腾讯混元、科大讯飞星火、华为云盘古、月之暗面
- MiniMax、百川智能、七牛云

**国外厂商**
- OpenAI (GPT-4/GPT-3.5)、Google Gemini、Anthropic Claude
- Cohere、Mistral AI、xAI (Grok)

**本地部署**
- Ollama、vLLM、LocalAI

**代理服务**
- OpenRouter、N1N.AI

#### 对话能力
- ✅ 多轮连续对话，上下文理解
- ✅ 流式响应，实时打字效果
- ✅ 会话管理，自动保存历史
- ✅ 文档写作、润色、改写
- ✅ 代码生成、审查、优化
- ✅ 创意头脑风暴、内容策划

### 2. 🧠 记忆系统

**本地向量知识库，AI 记住重要信息**

```
┌─────────────────────────────────────┐
│  存储类型    │  示例内容              │
├─────────────────────────────────────┤
│  项目信息    │  技术栈、架构决策       │
│  用户偏好    │  语言风格、格式习惯      │
│  知识文档    │  学习笔记、教程要点      │
│  上下文      │  项目背景、业务逻辑      │
└─────────────────────────────────────┘
```

**核心能力**
- 📝 保存任意文本和元数据
- 🔍 智能语义搜索（基于向量相似度）
- 💬 AI 自动调用相关知识
- 📂 分类标签管理（project/preference/technical/context/custom）
- 🔄 自动保存重要对话
- 📊 记忆统计和时间线

### 3. 🔧 技能系统

**扩展 AI 能力的自定义技能**

```
创建技能 → 定义提示词模板 → (可选) 添加脚本 → 使用 /skill-name 调用
```

**技能类型**
- **提示词技能**: 纯文本模板，快速创建
- **脚本技能**: 集成 JavaScript/Python 脚本
- **标签分类**: 便于管理和搜索

**示例技能**
```markdown
/code-review --file="src/App.tsx"
/translator --target="English" --text="你好"
/doc-generator --lang="python" --code="..."
```

### 4. 🌐 MCP 服务器集成

**Model Context Protocol - 连接外部世界**

```
内置模板:
├─ GitHub: 访问代码仓库
├─ Filesystem: 读取本地文件
├─ SQLite: 查询数据库
├─ Brave Search: 网络搜索
└─ 自定义: 创建自己的 MCP 服务器
```

**集成能力**
- 🔌 即插即用的服务器模板
- ⚙️ 自定义命令和环境变量
- 🧪 连接测试和错误诊断
- 🔄 动态启用/禁用服务器

### 5. 🤖 代理系统

**创建专业领域的 AI 专家**

```
代理编排模式:
├─ 并行模式: 多代理同时工作（适合独立任务）
├─ 顺序模式: 按序执行（适合流程任务）
└─ 动态模式: 智能选择（适合复杂场景）
```

**应用场景**
- 👨‍💻 代码审查团队（风格 + 安全 + 性能）
- 👔 文档编写团队（撰写 + 审校 + 发布）
- 🔬 质量保证团队（测试 + 分析 + 报告）

### 6. 🎨 丰富的斜杠命令

**快捷命令，效率翻倍**

| 命令 | 功能 | 命令 | 功能 |
|:---|:---|:---|:---|
| `/plan` | 制定实施计划 | `/sessions` | 会话管理 |
| `/new` | 新建会话 | `/memory` | 记忆管理 |
| `/commit` | 创建 Git 提交 | `/review` | 代码审查 |
| `/test` | 运行测试 | `/build` | 构建项目 |
| `/mcp` | MCP 服务器 | `/agents` | 代理管理 |
| `/settings` | 打开设置 | `/help` | 显示帮助 |

### 7. 🛡️ 安全控制

- 🔐 **数据本地存储**: 所有数据保存在本地
- 🔑 **API Key 加密**: 安全存储，永不泄露
- ✅ **权限精细控制**: 控制工具使用权限
- ⚠️ **敏感操作确认**: 危险操作需用户确认
- 🚫 **CSP 安全策略**: 防止 XSS 攻击

---

## 🚀 快速开始

### 前置要求

- **操作系统**: Windows 10+, macOS 11+, Linux
- **API Key**: 从支持的 AI 服务商获取

### 三步上手

#### Step 1: 获取 API Key

```
推荐服务商（免费额度充足）:
┌─────────────┬──────────────────────┬──────────────┐
│ 服务商      │  获取地址              │  免费额度     │
├─────────────┼──────────────────────┼──────────────┤
│ 智谱 AI     │ open.bigmodel.cn      │ 新用户 25元   │
│ DeepSeek    │ platform.deepseek.com │ 每天 100万tokens│
│ 通义千问     │ tongyi.aliyun.com     │ 新用户额度    │
│ OpenAI      │ platform.openai.com   │ 需付费        │
└─────────────┴──────────────────────┴──────────────┘
```

1. 选择服务商，注册/登录账号
2. 进入控制台，创建 API Key
3. 复制生成的 Key（格式：`sk-xxxx...`）

#### Step 2: 配置应用

```
操作流程:
1. 打开 AICowork
2. 点击左下角 ⚙️ 设置
3. 选择 "API 配置"
4. 点击 "添加新配置"
5. 填写配置信息:
   - 配置名称: 如 "智谱 AI"
   - API Key: 粘贴你的 Key
   - API 厂商: 选择对应服务商
   - 模型名称: 选择模型
6. 点击 "保存配置"
7. 点击 "设为激活" ✅
8. 点击 "测试连接" ✅
```

#### Step 3: 开始对话

```
1. 点击左侧 "+ 新对话"
2. 输入框输入: "你好，请帮我学习 Python"
3. 按 Enter 发送
4. 等待 AI 回复
```

---

## 📦 安装指南

### 方式一：下载安装包（推荐）⭐

从 [GitHub Releases](https://github.com/Pan519/AICowork/releases) 下载：

| 平台 | 文件名 | 大小 |
|:---|:---|:---|
| 💻 **Windows** | `AICowork-win32-x64-0.1.0.exe` | ~150 MB |
| 🍎 **macOS (ARM)** | `AICowork-0.1.0-arm64.dmg` | ~160 MB |
| 🍎 **macOS (Intel)** | `AICowork-0.1.0-x64.dmg` | ~160 MB |
| 🐧 **Linux** | `AICowork-0.1.0.AppImage` | ~150 MB |

**安装步骤**
```
Windows: 双击 .exe 文件，按提示安装
macOS:   打开 .dmg 文件，拖拽到 Applications
Linux:   chmod +x AICowork-*.AppImage && ./AICowork-*.AppImage
```

### 方式二：从源码构建

```bash
# 1. 克隆仓库
git clone https://github.com/Pan519/AICowork.git
cd AICowork

# 2. 安装 pnpm（如未安装）
npm install -g pnpm

# 3. 安装依赖
pnpm install

# 4. 重建原生模块
pnpm rebuild

# 5. 开发模式运行
pnpm dev

# 6. 构建生产版本
pnpm build

# 7. 打包应用
pnpm dist:win      # Windows
pnpm dist:mac-arm64 # macOS ARM
pnpm dist:mac-x64  # macOS Intel
pnpm dist:linux    # Linux
```

#### ⚠️ Electron 安装问题修复

如果遇到 `Electron failed to install correctly` 错误：

```bash
# 安装 electron-fix
npm install -g electron-fix

# 修复并启动
electron-fix start
```

---

## 📚 文档中心

<div align="center">

### 📖 完整文档导航

| 文档 | 描述 | 适合人群 |
|:---|:---|:---|
| **[📘 用户使用手册](./docs/用户使用手册.md)** | 详细的使用教程，从入门到精通 | 所有用户 |
| **[👨‍💻 开发者文档](./docs/开发者文档.md)** | 开发环境、项目结构、核心模块 | 开发者 |
| **[🏗️ 架构设计文档](./docs/架构设计文档.md)** | 系统架构、数据流、设计原则 | 架构师 |
| **[📡 API 参考文档](./docs/API参考文档.md)** | IPC API、类型定义、事件系统 | API 开发者 |
| **[🔌 插件开发指南](./docs/插件开发指南.md)** | 技能、MCP、代理插件开发 | 插件开发者 |
| **[📑 文档索引](./docs/文档索引.md)** | 所有文档的快速导航索引 | 快速查找 |

</div>

### 核心功能快速指南

#### 🔊 AI 对话

```
创建会话 → 输入问题 → Enter 发送 → 多轮对话 → 保存会话
```

#### 🧠 记忆系统

```
设置 → 记忆系统 → 添加新记忆
├─ 标题: 简短描述
├─ 内容: 详细信息
├─ 标签: project/preference/technical/context/custom
└─ 保存: AI 会自动调用
```

#### 🔧 技能使用

```
方法一: 使用技能
/input 技能名称 --参数1="值1" --参数2="值2"

方法二: 创建技能
~/.claude/skills/my-skill.md
---
name: my-skill
description: 我的技能
---
技能提示词内容...
```

#### 🌐 MCP 服务器

```
设置 → MCP 服务器 → 添加服务器
├─ 选择模板: GitHub/Filesystem/SQLite/自定义
├─ 配置命令: npx @modelcontextprotocol/server-xxx
├─ 环境变量: GITHUB_TOKEN=xxx
├─ 测试连接: ✅
└─ 启用服务器: 🟢
```

---

## 🏗️ 技术架构

### 技术栈

#### 前端技术

| 技术 | 版本 | 用途 |
|:---|:---|:---|
| **React** | 19.2.3 | UI 框架，并发渲染 |
| **TypeScript** | 5.9.2 | 类型安全 |
| **Tailwind CSS** | 4.1.18 | 原子化 CSS |
| **Zustand** | 5.0.10 | 轻量级状态管理 |
| **i18next** | 24.2.0 | 国际化（10+ 语言） |
| **react-markdown** | 10.1.0 | Markdown 渲染 |
| **highlight.js** | 11.11.1 | 代码高亮 |

#### 后端技术

| 技术 | 版本 | 用途 |
|:---|:---|:---|
| **Electron** | 39.2.7 | 桌面框架 |
| **better-sqlite3** | 12.6.0 | 嵌入式数据库（WAL 模式） |
| **Winston** | 3.19.0 | 日志系统 |
| **@anthropic-ai/claude-agent-sdk** | 0.2.6 | AI Agent SDK |
| **@memvid/sdk** | 2.0.120 | 向量数据库 |

#### 构建工具

| 工具 | 用途 |
|:---|:---|
| **Vite** | 5.6.0 | 快速构建 |
| **electron-builder** | 26.0.0 | 应用打包 |
| **Vitest** | 3.0.5 | 单元测试 |

### 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                     用户界面层 (UI)                          │
│           React 19 + Tailwind CSS + i18next                 │
│     ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│     │ 聊天界面 │  │ 设置页面 │  │ 插件管理 │               │
│     └──────────┘  └──────────┘  └──────────┘               │
└─────────────────────────────────────────────────────────────┘
                           ↕ IPC (contextBridge)
┌─────────────────────────────────────────────────────────────┐
│                   预加载层 (Preload)                         │
│            安全 API 暴露 + 类型定义                          │
└─────────────────────────────────────────────────────────────┘
                           ↕ IPC Communication
┌─────────────────────────────────────────────────────────────┐
│                    主进程层 (Main)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ API 代理层   │  │ 会话管理     │  │ 存储层       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ 配置管理     │  │ 记忆系统     │  │ 插件系统     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                      数据层 (Data)                           │
│    better-sqlite3 (会话) + Memvid (记忆向量)                │
└─────────────────────────────────────────────────────────────┘
```

### 项目结构

```
AICowork/
├── src/
│   ├── electron/              # Electron 主进程
│   │   ├── main.ts           # 主入口
│   │   ├── ipc-handlers.ts   # IPC 事件处理
│   │   ├── logger.ts         # 日志系统
│   │   ├── api-proxy/        # API 代理层
│   │   ├── handlers/         # 会话处理器
│   │   └── libs/             # 核心库
│   │       ├── config-store.ts      # API 配置
│   │       ├── session-store.ts     # 会话管理
│   │       ├── memory-tools.ts      # 记忆系统
│   │       ├── skills-store.ts      # 技能管理
│   │       ├── agents-store.ts      # 代理管理
│   │       ├── mcp-store.ts         # MCP 服务器
│   │       └── ...                 # 更多模块
│   │
│   └── ui/                    # React 渲染进程
│       ├── main.tsx           # React 入口
│       ├── App.tsx            # 主应用
│       ├── components/        # UI 组件
│       ├── pages/             # 页面组件
│       ├── store/             # Zustand 状态
│       ├── hooks/             # React Hooks
│       ├── i18n/              # 国际化
│       └── utils/             # 工具函数
│
├── dist-electron/            # Electron 编译输出
├── dist-react/               # React 构建输出
├── electron-builder.json     # 打包配置
├── vite.config.ts            # Vite 配置
├── tsconfig.json             # TypeScript 配置
├── package.json              # 项目配置
└── README.md                 # 项目说明
```

---

## ⚙️ 配置说明

### 数据存储位置

**Windows**
```
配置文件: C:\Users\你的用户名\AppData\Roaming\AICowork\
记忆数据: C:\Users\你的用户名\AppData\Roaming\AICowork\memvid\
日志文件: C:\Users\你的用户名\AppData\Roaming\AICowork\logs\
```

**macOS**
```
配置文件: ~/Library/Application Support/AICowork/
记忆数据: ~/Library/Application Support/AICowork/memvid/
日志文件: ~/Library/Application Support/AICowork/logs/
```

**Linux**
```
配置文件: ~/.config/AICowork/
记忆数据: ~/.config/AICowork/memvid/
日志文件: ~/.config/AICowork/logs/
```

**全局目录（跨项目）**
```
技能目录: ~/.claude/skills/
插件目录: ~/.claude/plugins/
代理目录: ~/.claude/agents/
```

### 环境变量

| 变量 | 说明 | 默认值 |
|:---|:---|:---|
| `NODE_ENV` | 环境模式 | `development` |
| `PORT` | Vite 开发服务器端口 | `5173` |
| `ANTHROPIC_AUTH_TOKEN` | API 密钥 | - |
| `ANTHROPIC_BASE_URL` | API 基础 URL | - |
| `ANTHROPIC_MODEL` | 模型名称 | - |

---

## 🎯 功能演示

### 场景 1: 代码审查

```
用户: /review 帮我审查 src/App.tsx 的代码

AI (代码审查代理):
├─ 检查代码风格和格式
├─ 识别潜在的性能问题
├─ 发现安全隐患
└─ 提供改进建议

结果: 生成详细的审查报告，包含代码示例
```

### 场景 2: 学习辅助

```
用户: 帮我学习 React Hooks

AI:
├─ 从记忆系统检索相关学习笔记
├─ 提供 Hooks 概念和原理
├─ 给出实际代码示例
└─ 自动保存学习重点到记忆系统

结果: 个性化学习计划 + 知识积累
```

### 场景 3: 文档撰写

```
用户: /doc-generator 为这个 API 编写文档

AI (文档作家代理):
├─ 分析代码功能
├─ 生成 Markdown 文档
├─ 包含使用示例
└─ 保存到文件

结果: 完整的 API 文档
```

---

## 🤝 贡献指南

我们欢迎任何形式的贡献！🎉

### 如何贡献

```bash
# 1. Fork 本仓库
# 2. 克隆到本地
git clone https://github.com/你的用户名/AICowork.git

# 3. 创建特性分支
git checkout -b feature/AmazingFeature

# 4. 提交更改
git commit -m 'feat: 添加某个功能'

# 5. 推送到分支
git push origin feature/AmazingFeature

# 6. 开启 Pull Request
```

### 代码规范

- ✅ 遵循 ESLint 配置
- ✅ 使用 TypeScript 类型注解
- ✅ 编写单元测试
- ✅ 更新相关文档
- ✅ 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)

### 开发指南

```bash
# 安装依赖
pnpm install

# 启动开发模式
pnpm dev

# 运行测试
pnpm test

# 代码检查
pnpm lint

# 构建项目
pnpm build
```

---

## 📊 项目状态

### 当前版本

- **版本号**: v0.1.0
- **发布日期**: 2026-01-22
- **开发状态**: 🟢 活跃开发中

### 开发进度

- [x] ✅ AI 对话功能
- [x] ✅ 记忆系统（Memvid + FileSystem 双后端）
- [x] ✅ 技能系统（提示词 + 脚本）
- [x] ✅ MCP 服务器集成
- [x] ✅ 代理系统（并行/顺序/动态编排）
- [x] ✅ 斜杠命令
- [x] ✅ 权限管理
- [x] ✅ 多语言支持（10+ 语言）
- [x] ✅ 主题定制
- [ ] 🚧 插件市场（计划中）
- [ ] 🚧 云端同步（计划中）
- [ ] 🚧 移动端适配（规划中）

### 路线图

#### v0.2.0 (开发中)
- [ ] 技能市场功能
- [ ] 对话导出（PDF/Markdown）
- [ ] 更多 AI 模型支持
- [ ] 性能优化

#### v0.3.0 (规划中)
- [ ] 云端同步功能
- [ ] 团队协作
- [ ] 移动端适配
- [ ] API 开放平台

---

## ❓ 常见问题

### Q1: 提示"API Key 未配置"？

**A**:
1. 点击设置 → API 配置
2. 点击"添加新配置"
3. 填写 API Key 并保存
4. 点击"设为激活"

### Q2: 发送消息无响应？

**A**:
- 检查网络连接
- 确认 API Key 正确
- 点击"测试连接"验证配置
- 查看日志文件排查问题

### Q3: 如何删除历史对话？

**A**:
- 右键点击会话卡片
- 选择"删除"
- 确认删除

### Q4: 记忆系统如何使用？

**A**:
1. 设置 → 记忆系统
2. 点击"添加新记忆"
3. 填写标题和内容
4. 选择标签分类
5. 保存后 AI 会自动调用

### Q5: 如何备份配置？

**A**:
复制整个应用数据目录到安全位置即可。

### 更多问题？

查看 [常见问题文档](./docs/用户使用手册.md#常见问题) 或提交 [Issue](https://github.com/Pan519/AICowork/issues)。

---

## 🙏 致谢

感谢以下开源项目：

- [Electron](https://www.electronjs.org/) - 跨平台桌面应用框架
- [React](https://react.dev/) - UI 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Memvid](https://memvid.ai/) - 向量数据库
- [Anthropic](https://www.anthropic.com/) - Claude AI SDK
- [Vite](https://vitejs.dev/) - 构建工具

---

## 📄 许可证

本项目采用 **GNU Affero General Public License v3.0 (AGPL-3.0)** 许可证。

### ⚠️ 关于 AGPL-3.0

AGPL-3.0 是一个强 copyleft 自由软件许可证，与 GPL 类似，但额外要求：

> 如果您在网络上运行修改后的程序并向用户提供服务，必须向这些用户提供源代码。

这确保了网络服务的用户也能获得源代码，防止 SaaS 提供商利用自由软件而不回馈社区。

**商业使用请联系作者获取商业授权。**

---

## 📞 联系方式

<div align="center">

### 👥 加入社区

**扫码加入微信群：**

> 二维码已过期，请点击链接获取最新的群二维码

[**🔗 点击获取微信群二维码**](https://ima.qq.com/note/share/_AwZPbuK9wucK5gWaVdjNQ?channel=4)

- 💻 **开发者群** - 程序员进开发者群（非程序员勿进）
- 👥 **交流群** - 普通用户进交流群

### 📧 其他联系方式

- **作者**: Alan, Muprprpr
- **项目地址**: [https://github.com/Pan519/AICowork](https://github.com/Pan519/AICowork)
- **问题反馈**: [GitHub Issues](https://github.com/Pan519/AICowork/issues)
- **功能建议**: [GitHub Discussions](https://github.com/Pan519/AICowork/discussions)

---

**如果这个项目对你有帮助，请给一个 ⭐️ Star 支持一下！**

Made with ❤️ by Alan & Muprprpr

**[⬆ 回到顶部](#aicowork)**

</div>
