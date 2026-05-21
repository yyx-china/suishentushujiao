# 随身图书角 · yyx

静态图书角网站：书库检索、图书增删改、工程日志记录。

## 文件夹名称

项目文件夹请命名为 **随身图书角**（不要用「毓秀图书角-cursor修改」）。

1. **先关闭** Cursor 里打开的本项目窗口  
2. 双击运行项目里的 **`重命名为随身图书角.bat`**（在桌面执行改名）  
3. 或在资源管理器中手动把桌面文件夹 `毓秀图书角-cursor修改` 重命名为 `随身图书角`  
4. 再用 Cursor 打开 `桌面\随身图书角` 继续编辑

## 功能说明

- **自动保存**：图书与工程日志的添加、编辑、删除会立即写入浏览器 `localStorage`，无需每次下载 HTML 覆盖。
- **删除确认**：删除前会弹出「确认要删除吗？」对话框，可选择「是」或「否」。
- **在线访问**：推送到 GitHub 后，由 GitHub Actions 自动部署到 GitHub Pages。

## 部署到 GitHub Pages

1. 在 [GitHub](https://github.com/new) 新建仓库（例如 `yuxiu-library`）。
2. 在本文件夹打开终端，执行：

```bash
git init
git add .
git commit -m "随身图书角：自动保存与 GitHub Pages 部署"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

3. 打开仓库 **Settings → Pages → Build and deployment**，将 **Source** 设为 **GitHub Actions**。
4. 推送后等待 Actions 跑完（约 1–2 分钟），在 Actions 页或 Pages 设置里查看站点地址，一般为：

`https://你的用户名.github.io/你的仓库名/`

## 本地使用

直接用浏览器打开 `index.html` 即可。数据会保存在本机浏览器中；换电脑或清空浏览器数据后，会重新使用 HTML 内嵌的初始书目与日志。

## 文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 首页搜索 |
| `book.html` | 书库 |
| `log.html` | 工程日志 |
| `log-detail.html` | 日志详情与编辑 |
| `common.js` | 自动保存与确认弹窗 |
