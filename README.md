# 一小时 · ONE HOUR

每天一小时、每周五练的个人训练计划与记录网页。原始动作与组数来自用户提供的训练计划。

## 使用

- 查看周一至周五的原训练动作，周末主动恢复。
- 展开动作，逐组输入重量、实际次数或时长并打卡。
- 切换周次，查看历史记录，记录当天感受。
- 使用 60 / 90 / 120 秒休息计时器。
- 在「我的记录」中导出或导入 JSON 备份。导入同一天的记录时保留本机已有内容。

记录保存在当前浏览器的 localStorage，不上传服务器，也不会跨设备自动同步。清理浏览器数据前请导出备份。

## 本地运行

这是无构建依赖的静态网页，HTML、CSS、JavaScript 可直接修改。

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

访问 http://127.0.0.1:4173 。

- `index.html`：页面结构。
- `style.css`：响应式布局与视觉。
- `plan.js`：每周原始训练计划。
- `app.js`：日期切换、训练记录、计时和备份。
- `icon.svg`：站点图标。

字体使用 Google Fonts，可用性受网络影响；无法加载时使用系统字体，不影响功能。

## GitHub Pages

仓库 Settings → Pages → Build and deployment，选择 Deploy from a branch → main → /(root)。保存后由 GitHub 自动部署，推送 main 后自动更新。

预计站点地址：https://RoiSoleil520.github.io/one-hour-training/

## 数据备份格式

导出文件包含 `version: 1` 与按本地日期存储的 `journal`。导入时验证日期、动作组数与字段类型；不接受任意脚本或 HTML。训练备注显示时转义，历史记录保留原输入文本。
