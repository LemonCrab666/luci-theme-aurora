/**
 * LuCI Theme Design - Main Entry Point
 * 现代化主题系统的主入口文件
 */

import { initThemeSystem } from './utils.js';
import { menuRenderer } from './menu.js';
import { authHandler } from './auth.js';

// 导入静态资源，让Vite处理
import logoSvg from '../assets/images/logo.svg';
import logoPng from '../assets/images/logo_48.png';

/**
 * 主题系统初始化
 */
class ThemeManager {
  constructor() {
    this.modules = new Map();
    this.init();
  }

  /**
   * 初始化主题系统
   */
  init() {
    // 初始化主题系统
    initThemeSystem();
    
    // 注册模块
    this.registerModule('menu', menuRenderer);
    this.registerModule('auth', authHandler);
    
    // 初始化交互功能
    this.initInteractions();
    
    // 初始化页面特定功能
    this.initPageSpecific();
  }

  /**
   * 注册模块
   * @param {string} name - 模块名称
   * @param {Object} module - 模块实例
   */
  registerModule(name, module) {
    this.modules.set(name, module);
  }

  /**
   * 获取模块
   * @param {string} name - 模块名称
   * @returns {Object} 模块实例
   */
  getModule(name) {
    return this.modules.get(name);
  }

  /**
   * 初始化交互功能
   */
  initInteractions() {
    this.enhanceButtons();
    this.enhanceForms();
    this.enhanceNavigation();
    this.initResponsive();
  }

  /**
   * 增强按钮交互
   */
  enhanceButtons() {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('.btn, .cbi-button');
      if (button && !button.disabled) {
        this.addRippleEffect(button, e);
      }
    });
  }

  /**
   * 添加涟漪效果
   * @param {HTMLElement} button - 按钮元素
   * @param {Event} e - 点击事件
   */
  addRippleEffect(button, e) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;

    // 确保按钮有相对定位
    if (getComputedStyle(button).position === 'static') {
      button.style.position = 'relative';
    }
    button.style.overflow = 'hidden';

    button.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  /**
   * 增强表单交互
   */
  enhanceForms() {
    // 表单字段焦点效果
    document.addEventListener('focusin', (e) => {
      if (e.target.matches('input, select, textarea')) {
        const cbiValue = e.target.closest('.cbi-value');
        if (cbiValue) {
          cbiValue.classList.add('focused');
        }
      }
    });

    document.addEventListener('focusout', (e) => {
      if (e.target.matches('input, select, textarea')) {
        const cbiValue = e.target.closest('.cbi-value');
        if (cbiValue) {
          cbiValue.classList.remove('focused');
        }
      }
    });

    // 表单验证
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.tagName === 'FORM') {
        const invalidInputs = form.querySelectorAll(':invalid');
        invalidInputs.forEach(input => {
          input.classList.add('border-red-500', 'focus:ring-red-500');
          setTimeout(() => {
            input.classList.remove('border-red-500', 'focus:ring-red-500');
          }, 3000);
        });
      }
    });
  }

  /**
   * 增强导航交互
   */
  enhanceNavigation() {
    // 高亮当前页面
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav a').forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('bg-blue-100', 'text-blue-700', 'dark:bg-blue-900', 'dark:text-blue-300');
      }
    });

    // 移动端导航切换
    document.addEventListener('click', (e) => {
      const navToggle = e.target.closest('[data-nav-toggle]');
      if (navToggle) {
        const nav = document.querySelector('.nav');
        if (nav) {
          nav.classList.toggle('hidden');
        }
      }
    });
  }

  /**
   * 初始化响应式功能
   */
  initResponsive() {
    // 监听窗口大小变化
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.handleResize();
      }, 250);
    });

    // 初始检查
    this.handleResize();
    
    // 动态加载移动端样式
    this.loadMobileStylesIfNeeded();
  }

  /**
   * 处理窗口大小变化
   */
  handleResize() {
    const isMobile = window.innerWidth <= 768;
    document.body.classList.toggle('mobile', isMobile);
    
    // 动态加载/卸载移动端样式
    this.loadMobileStylesIfNeeded();
    
    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('themeResize', {
      detail: { isMobile, width: window.innerWidth }
    }));
  }

  /**
   * 初始化页面特定功能
   */
  initPageSpecific() {
    const page = document.body.getAttribute('data-page');
    
    if (page) {
      this.loadPageModule(page);
    }
  }

  /**
   * 动态加载页面模块
   * @param {string} page - 页面标识
   */
  async loadPageModule(page) {
    try {
      // 尝试加载页面特定的模块
      const moduleUrl = `./pages/${page}.js`;
      const module = await import(moduleUrl);
      
      if (module.default && typeof module.default.init === 'function') {
        module.default.init();
      }
    } catch (error) {
      // 页面模块不存在，这是正常情况
      console.debug(`No specific module found for page: ${page}`);
    }
  }

  /**
   * 动态加载移动端样式
   */
  async loadMobileStylesIfNeeded() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile && !document.querySelector('#mobile-styles')) {
      try {
        // 动态创建link标签加载移动端样式
        const link = document.createElement('link');
        link.id = 'mobile-styles';
        link.rel = 'stylesheet';
        link.href = `${this.getMediaPath()}/design/mobile.css`;
        link.media = 'screen and (max-width: 768px)';
        
        // 添加到head
        document.head.appendChild(link);
        
        console.debug('Mobile styles loaded dynamically');
      } catch (error) {
        console.warn('Failed to load mobile styles:', error);
      }
    } else if (!isMobile) {
      // 如果不是移动端，移除移动端样式
      const mobileStyles = document.querySelector('#mobile-styles');
      if (mobileStyles) {
        mobileStyles.remove();
        console.debug('Mobile styles removed');
      }
    }
  }

  /**
   * 获取媒体资源路径
   * @returns {string} 媒体路径
   */
  getMediaPath() {
    // 从现有的CSS或JS路径推断媒体路径
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    for (const stylesheet of stylesheets) {
      const href = stylesheet.href;
      if (href.includes('/luci-static/design/')) {
        return href.replace(/\/design\/.*$/, '');
      }
    }
    // 默认路径
    return '/luci-static';
  }
}

// 添加必要的CSS动画
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
  
  .cbi-value.focused {
    transform: translateY(-1px);
    transition: transform 0.2s ease;
  }
`;
document.head.appendChild(style);

// 创建主题管理器实例
const themeManager = new ThemeManager();

// 全局暴露
window.ThemeManager = themeManager;

// 向后兼容
window.ThemeDesign = {
  showNotification: window.ThemeUtils.showNotification,
  scrollToElement: window.ThemeUtils.scrollToElement,
  toggleTheme: () => {
    const current = window.ThemeUtils.getThemePreference();
    const newTheme = current === 'dark' ? 'light' : 'dark';
    window.ThemeUtils.setTheme(newTheme);
  }
};