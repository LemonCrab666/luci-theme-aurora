# CSS架构文档 - OpenWrt LuCI Aurora主题




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



