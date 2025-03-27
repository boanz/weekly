# 开发教程
> 基于[thinkerchan](https://github.com/thinkerchan/weekly)项目修改的个人周刊系统。

## 功能特点
1. **主题切换**: 支持浅色/深色模式切换
2. **评论功能**: 集成 Waline 评论系统
3. **文章目录**: 自动生成目录导航（TOC）
4. **访问统计**: 集成 busuanzi 访问量统计
5. **站内搜索**: 支持文章内容搜索
6. **自动更新**: 通过 [notion2md](https://github.com/thinkerchan/notion2md) 实现 Notion 内容自动同步

## 快速开始

### 1. 环境准备
* Fork 本仓库到你的 Github 账号
* 安装 Node.js 环境
* 克隆项目到本地，执行以下命令验证环境是否安装成功
    ```bash
    npm install    # 安装依赖
    npm run dev    # 启动开发服务器
    ```

### 2. 站点配置
在 `src/config.ts` 中配置你的站点信息：
```js
export const SITE = {
  title: "你的网站标题", // 示例: "My Awesome Blog"
  author: "作者名", // 示例: "John Doe"
  description: "网站描述", // 示例: "A blog about tech and programming"
  keywords: "关键词1,关键词2", // 示例: "tech, programming, blog"
  icon: "网站图标URL", // 示例: "https:example.com/icon.png"
  pic: "默认图片URL", // 示例: "https:example.com/default-pic.jpg"
  homePage: "主页URL", // 示例: "https://myhomepage.com"
  blogPage: "博客URL", // 示例: "https://blogpage.com"
  twitterId: "推特ID", // 示例: "john_doe"
  githubId: "Github用户名", // 示例: "johndoe"
  repo: "仓库名", // 示例: "my-awesome-blog"
  cmtURL: "评论系统URL", // 示例: "https://comments.myawesomeblog.com"
  cmtJs: "评论系统JS", // 示例: "https://unpkg.com/@waline/client@2.15.8/dist/waline.js",
  cmtCss: "评论系统CSS", // 示例: "https://unpkg.com/@waline/client@2.15.8/dist/waline.css",
  pv: true  // 是否启用访问统计, 示例: true
}
```

### 3. 文章编写
- 文章存放在 `src/pages/posts` 目录
- Markdown 文件格式示例：
    ```markdown
    ---
    date: 2024/03/21
    toc: true
    pic: "可选的封面图URL"
    desc: "可选的文章描述"
    ---

    ![封面图](图片URL)

    <small>文章描述</small>

    正文内容...
    ```

- 文章格式说明

    在 `src/pages/posts` 目录中，建议保留一个 Markdown 文件作为格式参考，或者加入自己的文件。文档说明如下：

    - 第一行建议是一个图片的展示，这样代码会自动取第一行为你的头图。也可以通过 front matter 规范用 `pic` 字段表示。如果都没有填写，会使用默认的图片。
    - 第二行空一行。
    - 第三行是文档的描述，可以用 `<small>` 标签包裹，用于文字的描述部分。也可用 front matter 规范中 `desc` 字段表示。如果没有，会使用默认描述。
    - 关于文档的时间，默认通过 Node.js 取到文档的创建时间。如果不想要这个，也可用 front matter 规范中 `date` 字段表示。
    - 关于文章的标题，可以用 `数字-标题` 的方式，方便很多地方的统一处理。


### 4. 部署方式
推荐使用 Vercel 部署：
1. 登录 [Vercel](https://vercel.com/new)
2. 选择 "Continue with GitHub" 并导入你的仓库
3. 确保 Framework Preset 选择 Astro
4. 点击 Deploy 开始部署

### 5. Notion 自动同步（可选）
如果需要启用 Notion 自动同步功能：
1. 在 Github 仓库设置中配置以下 Secrets：
   - `NOTION_TOKEN`
   - `NOTION_DATABASE_ID`
2. 测试 Notion 连接：
```bash
npm run fetch  # 执行后会在 posts 目录生成新的 md 文件
```
具体细节可以参考 [notion2md](https://github.com/thinkerchan/notion2md) 。


## 使用场景
- 手动将博客放到 `src/pages/posts` 目录下；
- 采用 Notion 插件，将平时看的文章保存到 Notion 数据库中，自动同步。

## 致谢
- [tw93](https://github.com/tw93/weekly)
- [thinkerchan](https://github.com/thinkerchan/weekly)
