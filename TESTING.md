# 雨宿り微缩景观 · 验证记录

日期：2026-10-18，Asia/Taipei。本文件记录当前无 UI 微缩场景的实际运行结果。

## 构建

`npm run build` 成功，包含 TypeScript 检查及 Vite 生产打包。最终模型使用 React / Three.js 程序化几何与 Canvas 贴图，未使用 Blender 或外部模型。

Vite 保留大分块提示：Three.js 约 704 kB，应用约 536 kB，均为未压缩体积；这不是构建失败。

## 实际浏览器验收

使用 Codex 捆绑的 Playwright 与本机已安装的 Google Chrome。开发版和最终生产版均执行验收脚本；最终版本访问 `http://127.0.0.1:4173/`。桌面视口 1440 × 1000，竖屏视口 390 × 844。

最终生产版：**18 / 18 通过，运行和着色器错误 0，外部素材请求 0**。

| 验收项 | 结果 |
| --- | --- |
| WebGL 实际渲染并进入动画循环 | 通过 |
| 页面无按钮、菜单、输入控件、标题、页眉或页脚 | 通过 |
| 无可见 HTML 文案 | 通过 |
| 桌面画布填满视口 | 通过 |
| 左键拖拽旋转 | 通过 |
| 连续滚轮事件放大 | 通过 |
| 双击恢复初始相机 | 通过 |
| 复位清除缩放惯性 | 通过 |
| 右键拖拽平移 | 通过 |
| 可旋转到建筑背面 | 通过 |
| 自动门定时打开 | 通过 |
| 自动门随后关闭 | 通过 |
| 交通灯切换 | 通过 |
| 天气动画持续推进 | 通过 |
| 390 px 画布适配 | 通过 |
| 竖屏无横向溢出和 UI | 通过 |
| 无外部素材请求 | 通过 |
| 无运行或 Shader 错误 | 通过 |

初始相机为 `[18, 18.5, 23]`。正交投影、全方位旋转与响应式缩放均实测。验收过程中从背面复位后的坐标与初始坐标一致。

湿路面使用专门的正交反射相机捕获店铺，配合全局水面裁剪，避免使用透视反射相机产生不正确的倒影。最终截图已人工检查整体构图、底座完整性、天窗室内可见性、暖色倒影与路面纹理。

## 证据文件

- `output/playwright/koharu-production/results.json`：最终 18 项逐项结果。
- `output/playwright/koharu-production/01-overview.png`：整体构图。
- `output/playwright/koharu-production/02-orbit.png`：旋转后的视角。
- `output/playwright/koharu-production/03-interior-detail.png`：放大视角。
- `output/playwright/koharu-production/04-rear.png`：建筑背面。
- `output/playwright/koharu-production/05-door-open.png`：门打开时的画面。
- `output/playwright/koharu-production/06-mobile.png`：390 × 844 竖屏。
- `output/playwright/koharu-production/07-final.png`：最终完整场景。
- `output/playwright/koharu-production/08-storefront-detail.png`：较低角度的店内观察。

这些文件是实际运行中的 WebGL 截帧，不参与场景输入，也不是用于冒充三维场景的图片。输出目录默认被 Git 忽略。

## 验证范围

已测试桌面 Chrome 与 Codex 内置浏览器。竖屏检查是在桌面 Chrome 中改变视口，不代表手机真机测试。尚未进行 Safari / Firefox、长时间 GPU 内存压力或各型号硬件的性能测试。降雨、水痕和积水为视觉模拟，未进行流体计算。
