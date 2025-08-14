# CSS架构文档 - OpenWrt LuCI Aurora主题

## 📋 文件结构说明

重构后的 `main.css` 遵循 Tailwind CSS v4 的最佳实践，采用分层架构，提高可维护性。

## 🏗️ 架构分层

### 1. **Design Tokens & Custom Properties**
```css
@layer base {
  :root {
    /* 设计令牌定义 */
    --color-aurora-emerald: 110 231 183;
    --font-family-primary: 'Lato', ...;
    --layout-max-width: 1600px;
  }
}
```

**特点：**
- 使用CSS自定义属性定义设计系统
- 采用无单位RGB值，便于rgba()函数使用
- 集中管理所有设计令牌

### 2. **Layout Components**
```css
@layer components {
  .layout-main { /* 主布局容器 */ }
  .layout-view { /* 视图容器 */ }
  .header { /* 头部组件 */ }
  .nav { /* 导航组件 */ }
}
```

**作用：**
- 定义页面级布局组件
- 处理响应式布局逻辑
- 统一容器宽度和间距

### 3. **UI Components**
```css
@layer components {
  .btn { /* 按钮基础样式 */ }
  .btn-neutral { /* 中性按钮 */ }
  .btn-positive { /* 积极按钮 */ }
  .form-input { /* 表单输入 */ }
  .modal { /* 模态框 */ }
  .table { /* 表格 */ }
}
```

**特点：**
- 可复用的UI组件
- 基于设计令牌构建
- 支持暗色模式切换

### 4. **Page-Specific Overrides**
```css
@layer components {
  .login-modal { /* 登录页面专用 */ }
  .ifacebox { /* 网络接口盒子 */ }
  .syslog-container { /* 系统日志容器 */ }
}
```

**用途：**
- 特定页面的样式覆盖
- 复杂组件的专门样式
- 保持全局一致性的同时提供定制化

### 5. **Utility Classes & Responsive**
```css
@layer utilities {
  .animate-fade-in-up { /* 动画工具类 */ }
  .gpu-acceleration { /* GPU加速 */ }
  .sr-only { /* 屏幕阅读器专用 */ }
  
  @media (max-width: 768px) {
    /* 响应式覆盖 */
  }
}
```

**功能：**
- 工具性样式类
- 响应式断点处理
- 性能优化类

### 6. **Legacy Component Mappings**
```css
@layer components {
  /* 映射旧类名到新组件（Tailwind v4 不要 @apply 自定义组件类到选择器）*/
  #maincontent {
    @apply pt-20 px-6 mx-auto;
    max-width: var(--layout-max-width);
    width: var(--layout-fixed-width);
    min-height: calc(100vh - var(--layout-header-height));
  }
  .cbi-button { @apply btn; }
  .alert-message { @apply alert; }
}
```

**目的：**
- 保持向后兼容性
- 渐进式迁移支持
- 减少HTML修改需求

## 🎨 设计系统

### 颜色系统
```css
/* 极光色彩 - 无单位RGB值 */
--color-aurora-emerald: 110 231 183;   /* 翡翠绿 */
--color-aurora-cyan: 103 232 249;      /* 青蓝色 */
--color-aurora-indigo: 165 180 252;    /* 靛蓝色 */

/* 使用方式 */
background: rgb(var(--color-aurora-emerald));
background: rgba(var(--color-aurora-emerald), 0.5);

/* 统一品牌渐变（按钮 / 标签 / 顶部菜单 hover）*/
--gradient-primary-start: #499ecb;  /* 基于需求：Aurora 基色 */
--gradient-primary-end: #4fc3c7;    /* 与菜单 hover 渐变保持一致 */
```

### 字体系统
```css
--font-family-primary: 'Lato', 'Inter', 'SF Pro Text', ...;
--font-family-mono: 'Courier New', 'Monaco', 'Menlo', monospace;
```

### 布局系统
```css
--layout-max-width: 1600px;    /* 最大内容宽度上限 */
--layout-header-height: 80px;  /* 头部高度 */
--layout-fixed-width: 1280px;  /* 固定页面宽度（全站统一） */
```

### 动画系统
### 表单与交互系统（统一规范）
```css
/* 按钮（主/中性/积极）复用 .btn/.btn-neutral/.btn-positive 约定 */
.btn { /* 主按钮：使用 --gradient-primary-* 统一渐变、圆角lg、阴影、中等字重、轻微悬浮提升 */ }
.btn-neutral { /* 中性按钮：毛玻璃浅底、边框、阴影、悬浮提升 */ }
.btn-positive { /* 强调按钮：更大内边距、同品牌渐变、提升更明显 */ }

/* 单选/复选 */
.cbi-checkbox input[type="checkbox"],
.cbi-checkbox input[type="radio"] { /* 统一尺寸 16px，accent-color #499ecb */ }

/* 下拉选择（原生） */
.cbi-input-select { /* 圆角lg、浅底毛玻璃、淡边框、聚焦描边光晕 */ }

/* 自定义下拉（.cbi-dropdown） */
.cbi-dropdown { /* 内填充、圆角lg、边框+阴影、hover 提示色、focus 高亮；列表项 hover 使用统一品牌渐变 */ }
.cbi-dropdown ul li:hover { /* 极光渐变行高亮、文字白色 */ }

/* 标签页（.tabs / .cbi-tabmenu） */
.tabs, .cbi-tabmenu { /* 底部分隔线、间距统一 */ }
.tab-link, .cbi-tab a { /* 圆角t-lg、hover 背景半透明、active 使用统一品牌渐变 */ }

/* 间距与圆角基线 */
.cbi-section { /* 下间距：mb-8 md:mb-10 */ }
.cbi-value { /* 行间距：mb-3 md:mb-4 */ }
.radius { /* 默认圆角：.rounded-lg；容器：.rounded-xl/2xl */ }

/* 边框与阴影基线 */
.border-base { /* rgba(148,163,184,0.12~0.2) */ }
.shadow-base { /* 0 2~8px 8~32px，透明度浅，hover 轻微提升 */ }
```

统一规范确保：
- 交互状态具备一致的 hover/active/focus 表现
- 渐变仅用于主/强调态，保持信息层级清晰
- 暗色模式下维持等价对比度与可读性

```css
--animation-duration-fast: 200ms;
--animation-duration-normal: 300ms;
--animation-duration-slow: 500ms;
```

## 🔧 开发规范

### 1. **组件命名规范**
- 使用语义化的组件名：`.btn`, `.modal`, `.table`
- 变体使用修饰符：`.btn-neutral`, `.btn-positive`
- 状态使用伪类：`:hover`, `:focus`, `:active`

### 2. **Tailwind CSS 使用规范**
- 优先使用 `@apply` 指令复用 Tailwind 类
- 复杂样式使用原生CSS属性
- 响应式使用 `@media` 查询

### 2.1 按钮与动作区间距规范（统一标准）

为提升信息密度与可点击性，统一按钮尺寸与动作区间距如下（已在 `@main.css` 落地）：

- 尺寸规范
  - 基线按钮 `button, .btn, .cbi-button`：高度 h-8（约 32px），内边距 `px-3 py-1.5`，字重中等，圆角 `rounded-lg`，轻阴影。
  - 强调按钮 `.cbi-button-positive`：高度 h-9（约 36px），`px-3.5 py-2`，同品牌渐变，轻悬浮提升，投影稍强。
  - 幽灵/描边按钮（`.cbi-button-neutral`, `.cbi-button-{add,edit,remove}`）：高度 h-8，透明背景、淡描边、轻阴影，视觉层级更轻。
  - 次要填充按钮（`.cbi-button-action`）：高度 h-8，浅填充（浅色白/深色石板）、细描边与轻阴影，作为主操作旁的次级操作。
  - 破坏/禁用类（`.cbi-button-negative`）：高度 h-8，幽灵态（透明背景+中性描边），通过边框/阴影与位置表达层级，避免强烈用色。

- 动作区布局
  - 页面级动作区 `.cbi-page-actions`：`display:flex; align-items:center; gap: .5rem; flex-wrap:wrap;`，超出自动换行。
  - 分组容器 `.btn-group`：用于并排的同级按钮组，`gap: .5rem; flex-wrap:wrap`。
  - CBI 区块操作 `.cbi-section-actions > div`：采用同样的 `flex + gap` 布局。
  - 回退策略：在非 Flex 容器下，通过兄弟选择器为相邻按钮添加 `margin-left: .5rem`，在分组/动作区内清零相邻间距，避免双重间距。

- 下拉按钮（应用按钮）
  - `.cbi-dropdown.btn` 统一用按钮尺寸（h-8；min-width: 160px；左右内边距 12px），右侧 `▾` 图标对齐。
  - 默认仅显示选中项：`li[display="0"]`；当容器带 `.open` 时，`ul` 作为下拉层展示全部项。
  - 下拉层样式：浅色 `bg-white/95` + `backdrop-blur` + `border` + `shadow-lg`；深色对应 `bg-slate-800/95` 与较深边框。

- 交互反馈
  - Hover：轻微上移 `translateY(-2px → -0.5)`，阴影加深；Active：还原位移，阴影减弱。
  - Focus：外发光 `0 0 0 3px rgba(73, 158, 203, 0.2)`；暗色模式下保持对比等价。

以上规范保证：
- 不同页面按钮与动作区风格一致且紧凑不拥挤
- 移动端具备合理的换行与触控面积
- 强调/中性/操作按钮层级清晰、信息权重明确

### 2.2 层级与对比（不增加色彩负担）

在不引入额外颜色的前提下，通过“质感与权重”来区分按钮层级：

- 主操作（Primary）：保留品牌渐变与略强阴影，获得最高权重（`.cbi-button-positive`）。
- 次要操作（Secondary）：浅填充+细描边+轻阴影（`.cbi-button-action`），与主操作并列但层级更低。
- 中性/工具类（Neutral/Utility）：幽灵或描边按钮（`.cbi-button-neutral`, `.cbi-button-{add,edit,remove}`），透明背景，视觉负担最轻。
- 破坏/禁用（Negative/Disabled）：避免使用强烈红色，采用中性描边与幽灵态，通过位置和文案承担语义（`.cbi-button-negative`）。

交互对比：
- Hover：仅轻微位移与阴影变化，避免背景强烈变色。
- Focus：统一外发光 `0 0 0 3px rgba(73, 158, 203, 0.2)`，保证可达性。
- Active：位移归零，阴影减弱，反馈即时但不刺眼。

### 3. **暗色模式支持**
```css
.component {
  /* 浅色模式样式 */
}

[data-darkmode="true"] .component {
  /* 暗色模式样式 */
}
```

### 4. **性能优化**
- 使用 `backdrop-filter` 实现毛玻璃效果
- 添加 `transform: translateZ(0)` 启用GPU加速
- 合理使用 `transition` 和 `animation`

## 📱 响应式设计

### 固定宽度策略（推荐）
- 容器宽度固定：`width: var(--layout-fixed-width)`，保持视觉稳定与可读性。
- 断点仅调整左右内边距，避免容器宽度波动：
```css
@media (max-width: 1024px) {
  .layout-main, #maincontent { @apply px-4; }
}
@media (max-width: 768px) {
  .layout-main, #maincontent { @apply px-3; }
}
```

如需自适应宽度，可将固定宽度策略替换为百分比，但本主题默认固定宽度以提升信息密度与可读性。

## 📐 布局规范：全局内容水平垂直居中

目标：所有页面在视窗内居中展示；当内容较多时，容器被内容自然撑开并铺满，不造成居中错位。

实现（以 `#maincontent` 为容器、`#view` 为主要内容区；固定宽度由 `--layout-fixed-width` 控制）：

```css
/* 容器：网格居中 + 子项拉伸 */
#maincontent {
  width: var(--layout-fixed-width);
  display: grid;
  grid-auto-rows: min-content;   /* 子项按内容高度布局 */
  align-content: center;         /* 垂直居中 */
  justify-content: center;       /* 水平居中轨道 */
  justify-items: stretch;        /* 子项横向拉伸 */
}

/* 主要内容区：默认铺满容器，超出时自然扩展 */
#view {
  align-self: stretch;            /* 垂直铺满 */
  justify-self: stretch;          /* 水平铺满 */
}
```

注意：登录态下 `#view` 可能为空，为避免空容器影响布局，约定空内容时隐藏（实现细节见下节）。

## 🔒 登录态与未登录页面规范

- 遮罩层元素：`#modal_overlay`
  - 默认隐藏：`display: none; pointer-events: none;`
  - 仅在 `<body class="modal-overlay-active">` 时显示并居中：`fixed inset-0 grid place-items-center`
- 登录卡片：`.modal.login`
  - 无毛玻璃与边框，保留柔和阴影
  - 宽度：`max-w-lg; w-full`
- 视图区域：`#view`
  - 登录态或内容为空时隐藏：`:empty { display: none }` 和 `.modal-overlay-active #view { display: none }`
- 按钮渐变：
  - 浅色：`linear-gradient(135deg, var(--gradient-primary-start), var(--gradient-primary-end))`
  - 深色：`linear-gradient(135deg, rgb(var(--color-aurora-night-teal)), rgb(var(--color-aurora-night-emerald)))`

## 📲 移动端交互与主题规范

为确保移动端日/夜模式、主色、渐变与状态一致性，制定以下规范（依赖 `:root` 中的 `--gradient-primary-*` 变量）：

### 1. 导航（.mobile-nav）
- 背景毛玻璃：浅色 `bg-white/90`，深色 `bg-slate-900/90`
- 边框：浅色 `border-slate-200`，深色 `border-slate-700`
- 激活项 `.mobile-nav .active`：
  - 文字对比增强（浅色 `#0f172a`，深色 `#e2e8f0`）
  - 顶部指示条 `::before` 使用统一品牌渐变 `linear-gradient(135deg, var(--gradient-primary-start), var(--gradient-primary-end))`
  - 投影：`0 2px 6px rgba(73, 158, 203, 0.35)`

### 2. 行为状态（按钮等）
- 基础按钮（.mobile-btn）：
  - 渐变背景：使用统一品牌渐变
  - 圆角：`rounded-lg`
  - 投影：浅色 `0 6px 20px rgba(73, 158, 203, 0.3)`，深色 `0 6px 20px rgba(0,0,0,0.45)`
- Hover（有悬浮能力的设备）：
  - 位移：`translateY(-2px)`
  - 投影：`0 8px 28px rgba(73, 158, 203, 0.4)`
- Focus：
  - 描边光晕：`0 0 0 3px rgba(73, 158, 203, 0.2)`
- Active：
  - 位移归零，投影减弱：`0 4px 14px rgba(73, 158, 203, 0.28)`

### 3. 触摸目标
- 交互元素最小可点击尺寸：`min-h/min-w 44px`

### 4. 列表与内容
- 移动卡片内外边距：`.mobile-card { mx-2 my-4 }`
- 表格容器：启用横向滚动 `.mobile-table-container { overflow-x-auto -mx-4 px-4 }`


## 🎯 维护优势

### 1. **模块化结构**
- 每个组件独立定义
- 便于单独修改和扩展
- 减少样式冲突

### 2. **设计令牌系统**
- 颜色、字体、间距统一管理
- 一处修改，全站生效
- 便于主题定制

### 3. **Tailwind CSS集成**
- 最大化利用Tailwind工具类
- 减少自定义CSS代码量
- 提供一致的设计约束

### 4. **向后兼容**
- 保留所有原有类名映射
- 渐进式迁移支持
- 零破坏性更新

## 🚀 扩展指南

### 添加新组件
```css
@layer components {
  .new-component {
    @apply /* Tailwind classes */;
    /* 自定义CSS属性 */
  }
  
  /* LuCI CBI 区块间距建议 */
  .cbi-section { @apply mb-8 md:mb-10; }
  .cbi-section h3 { @apply mb-4; }

  [data-darkmode="true"] .new-component {
    /* 暗色模式样式 */
  }
}
```

### 添加新设计令牌
```css
:root {
  --new-design-token: value;
}
```

### 响应式扩展
```css
@media (max-width: breakpoint) {
  .component {
    /* 响应式样式 */
  }
}
```

这种架构确保了代码的可维护性、可扩展性和性能优化，同时保持了与现有系统的兼容性。

