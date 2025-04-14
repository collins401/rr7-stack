# rr7-stack

一个现代化的 React 全栈应用模板，集成了 React Router 7、Drizzle ORM、TailwindCSS 和 TypeScript。

## 技术栈

- **前端框架**: React 19
- **路由**: React Router 7
- **数据库 ORM**: Drizzle ORM
- **数据库**: SQLite (better-sqlite3)
- **样式**: TailwindCSS + Shadcn UI
- **表单处理**: React Hook Form + Zod
- **开发工具**: TypeScript, ESLint, Prettier
- **构建工具**: Vite

## 特性

- 🚀 基于 React Router 7 的现代路由系统
- 📦 使用 Drizzle ORM 进行数据库操作
- 💅 集成 Shadcn UI 组件库和 TailwindCSS
- 🔒 内置用户认证支持 (bcryptjs)
- 📝 类型安全的表单处理 (React Hook Form + Zod)
- 🛠️ 完整的 TypeScript 支持

## 快速开始

### 安装依赖

```bash
npm install

# 生成数据库迁移
npm run db:generate

# 执行数据库迁移
npm run db:migrate

# 启动开发服务器
npm run dev

```

## 项目结构

```bash
rr7-stack/
├── app/ # 应用源代码目录
│ ├── components/ # 共享组件
│ │ ├── ui/ # 基础 UI 组件
│ │ └── shared/ # 业务共享组件
│ ├── config/ # 应用配置
│ ├── database/ # 数据库相关
│ │ └── schema/ # 数据库模型定义
│ ├── hooks/ # 自定义 React Hooks
│ ├── lib/ # 工具函数库
│ ├── routes/ # 路由页面
│ │ ├── \dashboard+/ # 后台管理页面
│ │ └── \_site+/ # 前台页面├── build/ # 构建输出目录
├── drizzle/ # Drizzle ORM 配置和迁移
├── public/ # 静态资源
└── package.json # 项目配置文件
```
