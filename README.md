# 🛠️ 使用教程
> 基于 [thinkerchan/weekly](https://github.com/thinkerchan/weekly) 项目修改的个人周刊系统

## ✨ 功能特点
- **🎨 主题切换**：支持浅色/深色模式自动切换
- **💬 评论功能**：集成 Waline 评论系统
- **📑 文章目录**：自动生成 TOC 导航
- **📊 访问统计**：集成 busuanzi 访问量统计
- 🔍 **站内搜索**：支持全文内容检索
- 🤖 **自动更新**：通过 [notion2md](https://github.com/thinkerchan/notion2md) 实现 Notion 内容自动同步

## 📌 应用场景
- **手动管理**：直接编辑 `src/pages/posts` 下的 Markdown 文件
- **自动同步**：通过 Notion 数据库管理内容，自动生成 Markdown


## 🚀 快速开始

### 1. 环境准备
- Fork 本仓库到你的 GitHub 账号
- 安装 Node.js 环境
- 克隆项目到本地
   ```bash
   git clone https://github.com/your-username/weekly.git
   ```
- 安装依赖并启动开发服务器：
   ```bash
   npm install  # 安装依赖
   npm run dev  # 启动服务
   ```

### 2. 站点配置
修改 `src/config.ts` 配置文件：

````js
// 配置示例
export const SITE = {
  title: "你的网站标题",      // 示例: "技术周刊"
  author: "作者名",          // 示例: "张三"
  description: "网站描述",    // 示例: "每周精选技术文章"
  keywords: "关键词1,关键词2", // 示例: "技术,编程,周刊"
  icon: "网站图标URL",       // 示例: "https://example.com/favicon.ico"
  pic: "默认图片URL",        // 示例: "https://example.com/default.jpg"
  homePage: "主页URL",       // 示例: "https://weekly.example.com"
  blogPage: "博客URL",       // 示例: "https://blog.example.com"
  githubId: "GitHub用户名",  // 示例: "zhangsan"
  repo: "仓库名",            // 示例: "zhangsan-weekly"
  cmtURL: "评论系统URL",     // 示例: "https://waline.example.com"
  // 高级配置（保持默认即可）
  cmtJs: "https://unpkg.com/@waline/client@2.15.8/dist/waline.js",
  cmtCss: "https://unpkg.com/@waline/client@2.15.8/dist/waline.css",
  pv: true  // 是否启用访问统计
};
````

### 3. 文章编写
#### 文件结构
```
src/pages/posts/
└── 01-示例文章-20240321.md
```

#### 标准格式
````markdown
---
date: 2024/03/21  # 发布日期
toc: true          # 启用目录
pic: "封面图URL"   # 可选
desc: "文章摘要"    # 可选
---

![头图](图片URL)  <!-- 建议首行放置头图 -->

<small>图片描述文字</small>  <!-- 可选图片说明 -->

## 章节标题
正文内容...
````

#### 格式规范
1. **头图设置**
   - 首行建议放置头图（自动识别）
   - 或通过 `pic` 字段指定封面图
   - 未设置时使用默认图片

2. **内容结构**
   - 头图与正文间空一行
   - 可通过 `<small>` 标签添加图片描述
   - 或通过 `desc` 字段设置文章摘要

3. **命名规范**
   - 文件名建议采用 `序号-标题-日期.md` 格式
   - 示例：`03-前端动态-20240325.md`

### 4. 部署指南
- 访问 [Vercel 控制台](https://vercel.com/new)
- 选择 GitHub 仓库导入
- 配置部署参数：
   - **Framework Preset**: Astro
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
- 点击 Deploy 完成部署

### 5. Notion 同步（可选）
#### 初始配置
- 在 GitHub 仓库设置 Secrets：
    - `NOTION_TOKEN` - Notion API 访问令牌
    - `NOTION_DATABASE_ID` - Notion 数据库 ID
    - `OSS_ACCESS_KEY_ID` - 阿里云 OSS 访问密钥 ID
    - `OSS_ACCESS_KEY_SECRET` - 阿里云 OSS 访问密钥
    - `OSS_BUCKET` - 阿里云 OSS 存储桶名称
    - `OSS_REGION` - 阿里云 OSS 存储区域
    - `OSS_DOMAIN` - 阿里云 OSS 访问域名
- 测试同步功能
    ```bash
    npm run fetch  # 生成 posts/*.md 文件
    ```

#### 高级配置
- 同步脚本：`.github/workflows/notion2md.js`
- 定时任务：`.github/workflows/task.yml`
- 参考文档：[notion2md 使用指南](https://github.com/thinkerchan/notion2md)


## 致谢
- [tw93/weekly](https://github.com/tw93/weekly)
- [thinkerchan/weekly](https://github.com/thinkerchan/weekly)
