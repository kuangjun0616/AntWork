# AICowork

<div align="center">

# 🤖 AI 智能协作助手
### 基于 Qwen Code SDK 的现代化 AI 桌面应用

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE.txt)
[![Version](https://img.shields.io/badge/version-0.1.0-orange.svg)](https://github.com/BrainPicker-L/AICowork/releases)
[![Electron](https://img.shields.io/badge/Electron-39.2.7-9FEAF9.svg)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg)](https://www.typescriptlang.org/)
[![Qwen Code SDK](https://img.shields.io/badge/Qwen_Code_SDK-0.1.3-FF6B6B.svg)](https://github.com/QwenLM/qwen-code)

[English](./README_EN.md) | 简体中文 | [快速开始](#-快速开始) | [核心特性](#-核心特性) | [开发文档](./docs/开发者文档.md)

</div>

---

## 📖 项目简介

**AICowork** 是一款基于 **[@qwen-code/sdk](https://github.com/QwenLM/qwen-code)** 构建的现代化 AI 智能协作桌面应用。采用 Electron + React 19 + TypeScript 技术栈，深度集成 Qwen Code SDK 的强大能力，为用户提供流畅、安全、可扩展的 AI 交互体验。

### 🎯 核心价值

| 💡 **SDK 驱动** | 基于 Qwen Code SDK，享受官方持续更新和优化 |
|:---|:---|
| 🧠 **记忆系统** | 集成 Memvid 向量存储，AI 持久化记住重要信息 |
| 🔧 **MCP 协议** | 原生支持 Model Context Protocol，无限扩展能力 |
| 🎨 **技能系统** | 自定义技能模板，快速复用常用提示词 |
| 🛡️ **隐私安全** | 数据本地存储，API Key 加密，权限精细控制 |
| 🌍 **多语言** | 支持 10+ 语言界面，全球化用户体验 |

### 🎯 适用场景

```
💼 办公协作      📚 学习辅助      🎨 创意工作      💻 代码开发
   └─ 文档撰写      └─ 知识问答      └─ 头脑风暴      └─ 代码生成
   └─ 会议记录      └─ 要点总结      └─ 创意策划      └─ 代码审查
   └─ 邮件回复      └─ 概念解释      └─ 内容创作      └─ Bug 修复
```

---

## ✨ 核心特性

### 1. 🚀 基于 Qwen Code SDK

**为什么选择 Qwen Code SDK？**

- ✅ **官方支持**: 阿里云通义千问团队官方维护
- ✅ **持续更新**: 跟随最新 AI 技术发展
- ✅ **性能优化**: 针对代码场景深度优化
- ✅ **协议支持**: 原生支持 MCP、Hooks、Agents 等高级特性
- ✅ **多模型兼容**: 支持 OpenAI、Anthropic 等多种 API 格式

**SDK 核心能力**

```typescript
import { query } from "@qwen-code/sdk";

// 流式对话
for await (const message of query(userMessages, {
  mcpServers: { /* MCP 服务器配置 */ },
  hooks: { /* 生命周期钩子 */ },
  agents: { /* 代理配置 */ }
})) {
  console.log(message);
}
```

### 2. 🧠 记忆系统 (Memvid)

**本地向量知识库，让 AI 记住重要信息**

基于 [@memvid/sdk](https://github.com/memvid/memvid) 实现的持久化记忆系统：

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
- 📝 保存任意文本和元数据到本地向量数据库
- 🔍 智能语义搜索（基于向量相似度）
- 💬 AI 通过 MCP 工具自动检索相关记忆
- 📂 分类标签管理（project/preference/technical/context）
- 🔄 会话结束后自动分析并存储重要信息
- 📊 记忆统计和时间线可视化

### 3. 🌐 MCP 服务器集成

**Model Context Protocol - 连接外部世界**

完全兼容 [MCP 官方规范](https://modelcontextprotocol.io/)，支持 stdio、SSE、HTTP 等多种传输协议：

```
内置 MCP 服务器:
├─ Memory Tools: 记忆存储和检索
├─ Skills Tools: 技能管理和调用
└─ 自定义服务器: 支持任意 MCP 兼容服务器

社区 MCP 服务器:
├─ @modelcontextprotocol/server-github
├─ @modelcontextprotocol/server-filesystem
├─ @modelcontextprotocol/server-brave-search
└─ 更多服务器持续增加...
```

**配置示例**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your-token"
      }
    }
  }
}
```

### 4. 🔧 技能系统

**快速复用常用提示词模板**

技能存储在 `~/.qwen/skills/` 目录，每个技能是一个独立的文件夹：

```
~/.qwen/skills/
├─ code-review/
│  └─ SKILL.md          # 技能定义
├─ translator/
│  └─ SKILL.md
└─ doc-generator/
   ├─ SKILL.md
   └─ doc-generator.js  # 可选脚本
```

**SKILL.md 格式**
```markdown
---
name: code-review
description: 代码审查助手
---

# 代码审查

请对以下代码进行全面审查：

1. 代码风格和规范
2. 潜在的 Bug 和安全问题
3. 性能优化建议
4. 最佳实践建议

代码：
{{input}}
```

**使用方式**
```
/code-review --input="src/App.tsx"
/translator --target="English" --text="你好"
```

### 5. 🤖 代理系统 (Agents)

**创建专业领域的 AI 专家**

基于 SDK 的 Agents 特性，支持多代理协作：

```typescript
// 代理配置示例
{
  "agents": {
    "code-reviewer": {
      "description": "代码审查专家",
      "prompt": "你是一位经验丰富的代码审查专家...",
      "tools": ["Read", "Edit"],
      "model": "sonnet"
    }
  }
}
```

**编排模式**
- 🔄 **并行模式**: 多代理同时工作（适合独立任务）
- ⏭️ **顺序模式**: 按序执行（适合流程任务）
- 🔁 **循环模式**: 循环执行（适合迭代优化）
- 🎯 **交替模式**: 交替执行（适合对话场景）

### 6. 🎨 斜杠命令

**SDK 原生支持的快捷命令**

| 命令 | 功能 | 命令 | 功能 |
|:---|:---|:---|:---|
| `/plan` | 制定实施计划 | `/sessions` | 会话管理 |
| `/new` | 新建会话 | `/memory` | 记忆管理 |
| `/commit` | 创建 Git 提交 | `/review` | 代码审查 |
| `/test` | 运行测试 | `/build` | 构建项目 |
| `/mcp` | MCP 服务器管理 | `/agents` | 代理管理 |
| `/settings` | 打开设置 | `/help` | 显示帮助 |

### 7. 🛡️ 安全与隐私

- 🔐 **数据本地存储**: 所有数据保存在本地，不上传云端
- 🔑 **API Key 加密**: 使用系统密钥链安全存储
- ✅ **权限精细控制**: 控制 AI 可以使用的工具
- ⚠️ **敏感操作确认**: 删除、修改等危险操作需用户确认
- 🚫 **CSP 安全策略**: 防止 XSS 攻击和代码注入
- 🔍 **删除检测**: 自动识别删除命令，强制用户确认

---

## 🚀 快速开始

### 前置要求

- **操作系统**: Windows 10+, macOS 11+, Linux (Ubuntu 20.04+)
- **Node.js**: 18.0+ (仅开发环境需要)
- **API Key**: 从支持的 AI 服务商获取

### 方式一：下载安装包（推荐）⭐

从 [GitHub Releases](https://github.com/BrainPicker-L/AICowork/releases) 下载最新版本：

| 平台 | 文件名 | 大小 |
|:---|:---|:---|
| 💻 **Windows** | `AICowork-win32-x64-0.1.0.exe` | ~150 MB |
| 🍎 **macOS (ARM)** | `AICowork-0.1.0-arm64.dmg` | ~160 MB |
| 🍎 **macOS (Intel)** | `AICowork-0.1.0-x64.dmg` | ~160 MB |
| 🐧 **Linux** | `AICowork-0.1.0.AppImage` | ~150 MB |

**安装步骤**
```bash
# Windows
双击 .exe 文件，按提示安装

# macOS
打开 .dmg 文件，拖拽到 Applications

# Linux
chmod +x AICowork-*.AppImage
./AICowork-*.AppImage
```

### 方式二：从源码构建

```bash
# 1. 克隆项目
git clone https://github.com/BrainPicker-L/AICowork.git
cd AICowork

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev

# 4. 构建应用（可选）
pnpm dist
```

### 配置 API Key

#### 方式一：通过 UI 配置（推荐）

1. 启动应用后，点击左下角 ⚙️ **设置**
2. 选择 **API 配置**
3. 点击 **添加新配置**
4. 填写配置信息：
   - **配置名称**: 如 "智谱 AI"
   - **API Key**: 粘贴你的 Key
   - **Base URL**: API 地址
   - **模型名称**: 选择模型
5. 点击 **保存配置**
6. 点击 **设为激活** ✅
7. 点击 **测试连接** 验证配置

#### 方式二：通过环境变量配置

创建 `.env` 文件：

```bash
# OpenAI 格式
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4

# 或 Anthropic 格式
ANTHROPIC_AUTH_TOKEN=sk-ant-xxx
ANTHROPIC_BASE_URL=https://api.anthropic.com
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

#### 方式三：通过配置文件

创建 `~/.qwen/settings.json`：

```json
{
  "env": {
    "OPENAI_API_KEY": "sk-xxx",
    "OPENAI_BASE_URL": "https://api.openai.com/v1",
    "OPENAI_MODEL": "gpt-4"
  }
}
```

### 推荐的 AI 服务商

| 服务商 | 获取地址 | 免费额度 | 推荐指数 |
|:---|:---|:---|:---|
| **智谱 AI** | [open.bigmodel.cn](https://open.bigmodel.cn) | 新用户 25元 | ⭐⭐⭐⭐⭐ |
| **DeepSeek** | [platform.deepseek.com](https://platform.deepseek.com) | 每天 100万tokens | ⭐⭐⭐⭐⭐ |
| **通义千问** | [tongyi.aliyun.com](https://tongyi.aliyun.com) | 新用户额度 | ⭐⭐⭐⭐ |
| **OpenAI** | [platform.openai.com](https://platform.openai.com) | 需付费 | ⭐⭐⭐⭐⭐ |

---

## 📚 使用指南

### 基础对话

1. 点击左侧 **+ 新对话** 创建会话
2. 在输入框输入问题
3. 按 `Cmd+Enter` (macOS) 或 `Ctrl+Enter` (Windows/Linux) 发送
4. 等待 AI 回复

### 使用记忆系统

**存储记忆**:
```
请记住：我们的项目使用 React 19 + TypeScript + Tailwind CSS
```

**检索记忆**:
```
我们项目用的什么技术栈？
```

AI 会自动检索相关记忆并回答。

### 使用技能

**查看可用技能**:
```
/skills
```

**使用技能**:
```
/code-review --input="src/App.tsx"
/translator --target="English" --text="你好世界"
```

### 使用 MCP 服务器

**配置 GitHub MCP**:

1. 打开设置 → MCP 服务器
2. 点击 **添加服务器**
3. 选择 **GitHub** 模板
4. 填写 GitHub Token
5. 保存并启用

**使用**:
```
请帮我查看 facebook/react 仓库的最新 issues
```

### 使用代理

**配置代理**:

1. 打开设置 → 代理管理
2. 创建新代理
3. 设置代理的专业领域和提示词
4. 保存

**使用**:
```
使用代码审查代理帮我审查这段代码...
```

---

## 🎯 高级功能

### 1. 多会话管理

- 支持同时打开多个会话
- 每个会话独立的上下文
- 会话自动保存和恢复
- 会话搜索和过滤

### 2. 工作目录切换

点击输入框上方的目录路径，可以切换工作目录：

```
~/projects/my-app → ~/projects/another-app
```

AI 将在新目录下执行命令和读取文件。

### 3. 权限控制

在设置中配置工具权限：

- **自动批准**: 无需确认即可使用的工具
- **需要确认**: 使用前需要用户确认
- **禁止使用**: 完全禁止使用的工具

### 4. 自定义提示词

在设置中配置系统提示词，定制 AI 的行为风格。

### 5. 多语言界面

支持以下语言：

- 🇨🇳 简体中文
- 🇺🇸 English
- 🇯🇵 日本語
- 🇰🇷 한국어
- 🇪🇸 Español
- 🇫🇷 Français
- 🇩🇪 Deutsch
- 🇷🇺 Русский
- 🇵🇹 Português
- 🇨🇳 繁體中文

---

## 🛠️ 开发指南

### 项目结构

```
AICowork/
├─ src/
│  ├─ electron/          # Electron 主进程
│  │  ├─ main.ts        # 应用入口
│  │  ├─ libs/          # 核心库（SDK Runner）
│  │  ├─ managers/      # 管理器（MCP、配置）
│  │  ├─ services/      # 服务层
│  │  ├─ storage/       # 存储层
│  │  └─ utils/         # 工具函数
│  ├─ ui/               # React 渲染进程
│  │  ├─ pages/         # 页面组件
│  │  ├─ components/    # UI 组件
│  │  ├─ store/         # Zustand 状态
│  │  └─ i18n/          # 国际化
│  └─ shared/           # 共享代码
├─ docs/                # 文档
└─ tests/               # 测试
```

### 开发命令

```bash
# 开发
pnpm dev              # 启动开发服务器
pnpm dev:vite         # 仅启动 Vite
pnpm dev:electron     # 仅启动 Electron

# 构建
pnpm build            # 构建应用
pnpm dist             # 打包应用

# 测试
pnpm test             # 运行测试
pnpm test:watch       # 监听模式
pnpm test:coverage    # 生成覆盖率报告

# 代码检查
pnpm lint             # ESLint 检查
```

### 技术栈

- **前端**: React 19, TypeScript, Tailwind CSS, Zustand
- **桌面**: Electron 39, Vite 7
- **AI**: @qwen-code/sdk, @memvid/sdk, @modelcontextprotocol/sdk
- **测试**: Vitest, Testing Library
- **构建**: electron-builder

详细开发文档请查看 [开发者文档](./docs/开发者文档.md)

---

## 📖 文档中心

- [开发者文档](./docs/开发者文档.md) - 完整的开发指南
- [架构设计文档](./docs/架构设计文档.md) - 系统架构设计
- [用户使用手册](./docs/用户使用手册.md) - 详细使用教程
- [API 参考文档](./docs/API参考文档.md) - API 接口文档
- [插件开发指南](./docs/插件开发指南.md) - 插件开发教程

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. Fork 本项目
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

### 贡献类型

- 🐛 **Bug 修复**: 修复已知问题
- ✨ **新功能**: 添加新特性
- 📝 **文档**: 改进文档
- 🎨 **UI/UX**: 改进界面和体验
- ⚡ **性能**: 性能优化
- 🔧 **工具**: 开发工具改进

### 代码规范

- 使用 TypeScript
- 遵循 ESLint 规则
- 添加必要的注释
- 编写单元测试

### 提交规范

```
feat: 新功能
fix: Bug 修复
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

---

## 🐛 问题反馈

遇到问题？请通过以下方式反馈：

- **GitHub Issues**: [提交 Issue](https://github.com/BrainPicker-L/AICowork/issues)
- **讨论区**: [GitHub Discussions](https://github.com/BrainPicker-L/AICowork/discussions)

提交 Issue 时，请包含：

1. 问题描述
2. 复现步骤
3. 预期行为
4. 实际行为
5. 系统信息（操作系统、版本等）
6. 日志文件（如有）

---

## 📜 许可证

本项目采用 [AGPL-3.0](./LICENSE.txt) 许可证。

这意味着：

- ✅ 可以自由使用、修改和分发
- ✅ 可以用于商业用途
- ⚠️ 修改后的代码必须开源
- ⚠️ 网络服务也需要开源

---

## 🙏 致谢

感谢以下开源项目：

- [Qwen Code SDK](https://github.com/QwenLM/qwen-code) - AI 对话核心
- [Memvid](https://github.com/memvid/memvid) - 向量记忆存储
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP 协议
- [Electron](https://www.electronjs.org/) - 跨平台桌面框架
- [React](https://react.dev/) - UI 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架

---

## 📞 联系方式

- **GitHub**: https://github.com/BrainPicker-L/AICowork
- **Issues**: https://github.com/BrainPicker-L/AICowork/issues
- **Discussions**: https://github.com/BrainPicker-L/AICowork/discussions

---

## 🌟 Star History

如果这个项目对你有帮助，请给我们一个 ⭐ Star！

[![Star History Chart](https://api.star-history.com/svg?repos=BrainPicker-L/AICowork&type=Date)](https://star-history.com/#BrainPicker-L/AICowork&Date)

---

<div align="center">

**让 AI 成为你的智能协作伙伴 🚀**

Made with ❤️ by AICowork Team

</div>

# Linux
chmod +x AICowork-*.AppImage
./AICowork-*.AppImage
```

### 方式二：从源码构建

```bash
# 1. 克隆仓库
git clone https://github.com/BrainPicker-L/AICowork.git
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

查看 [常见问题文档](./docs/用户使用手册.md#常见问题) 或提交 [Issue](https://github.com/BrainPicker-L/AICowork/issues)。

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
- **项目地址**: [https://github.com/BrainPicker-L/AICowork](https://github.com/BrainPicker-L/AICowork)
- **问题反馈**: [GitHub Issues](https://github.com/BrainPicker-L/AICowork/issues)
- **功能建议**: [GitHub Discussions](https://github.com/BrainPicker-L/AICowork/discussions)

---

**如果这个项目对你有帮助，请给一个 ⭐️ Star 支持一下！**

Made with ❤️ by Alan & Muprprpr

**[⬆ 回到顶部](#aicowork)**

</div>
