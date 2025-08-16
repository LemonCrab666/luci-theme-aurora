# LuCI Theme aurora - 开发指南

基于 Vite + TailwindCSS 的现代化 OpenWrt LuCI 主题开发环境。

## ⚡ 快速开始

### 目录结构说明

```
luci-theme-aurora/
├── .dev/                    # 开发相关文件
│   ├── src/                 # 源代码
│   ├── scripts/             # 构建脚本
│   ├── package.json         # 依赖配置
│   ├── vite.config.ts       # Vite配置
│   └── tailwind.config.js   # TailwindCSS配置
├── htdocs/                  # 生产静态资源（构建输出）
├── ucode/                   # LuCI模板文件
├── root/                    # 系统配置文件
└── Makefile                 # OpenWrt构建配置
```

### 开发工作流

1. **初始化开发环境**：
   ```bash
   cd .dev && pnpm install
   ```
2. **构建生产版本**：
   ```bash
   cd .dev && pnpm build
   ```


### OpenWrt编译

```bash
make package/luci-theme-aurora/{clean,compile}
```


## 📚 相关资源

- [TailwindCSS 文档](https://tailwindcss.com/docs)
- [Vite 文档](https://vitejs.dev/guide/)
- [LuCI 开发文档](https://github.com/openwrt/luci/wiki)
