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
  /* 映射旧类名到新组件 */
  #maincontent { @apply layout-main; }
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
```

### 字体系统
```css
--font-family-primary: 'Lato', 'Inter', 'SF Pro Text', ...;
--font-family-mono: 'Courier New', 'Monaco', 'Menlo', monospace;
```

### 布局系统
```css
--layout-max-width: 1600px;    /* 最大内容宽度 */
--layout-header-height: 80px;  /* 头部高度 */
```

### 动画系统
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

### 断点系统
- **桌面端**: `> 1024px` - 95%宽度，最大1600px
- **平板端**: `≤ 1024px` - 98%宽度
- **手机端**: `≤ 768px` - 100%宽度

### 响应式策略
```css
@media (max-width: 1024px) {
  .layout-main {
    @apply px-4;
    width: 98%;
  }
}

@media (max-width: 768px) {
  .layout-main {
    @apply px-3;
    width: 100%;
  }
}
```

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

