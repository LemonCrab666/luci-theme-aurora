/**
 * LuCI Utilities - 工具函数模块
 * 提供通用的工具函数和帮助方法
 */

/**
 * 创建DOM元素的简化函数
 * @param {string} tag - HTML标签名
 * @param {Object} attrs - 元素属性
 * @param {Array|string} children - 子元素或文本内容
 * @returns {HTMLElement} 创建的DOM元素
 */
export function createElement(tag, attrs = {}, children = []) {
  const element = document.createElement(tag);
  
  // 设置属性
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'class') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // 添加子元素
  if (typeof children === 'string') {
    element.textContent = children;
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        element.appendChild(child);
      }
    });
  }
  
  return element;
}

/**
 * 显示通知消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型: success, error, warning, info
 * @param {number} duration - 显示时长（毫秒）
 * @returns {HTMLElement} 通知元素
 */
export function showNotification(message, type = 'info', duration = 3000) {
  const typeClasses = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  const notification = createElement('div', {
    class: `
      fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm
      transition-all duration-300 transform translate-x-full
      ${typeClasses[type] || typeClasses.info}
    `
  }, [message]);

  document.body.appendChild(notification);

  // 动画显示
  requestAnimationFrame(() => {
    notification.classList.remove('translate-x-full');
  });

  // 自动隐藏
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, duration);

  return notification;
}

/**
 * 平滑滚动到指定元素
 * @param {string|HTMLElement} selector - 选择器或元素
 * @param {number} offset - 偏移量
 * @param {string} behavior - 滚动行为
 */
export function scrollToElement(selector, offset = 0, behavior = 'smooth') {
  const element = typeof selector === 'string' 
    ? document.querySelector(selector) 
    : selector;

  if (element) {
    const top = element.offsetTop - offset;
    window.scrollTo({
      top: top,
      behavior: behavior
    });
  }
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(this, args);
  };
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 限制时间（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(func, limit) {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 深拷贝对象
 * @param {any} obj - 要拷贝的对象
 * @returns {any} 拷贝后的对象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {};
    Object.keys(obj).forEach(key => {
      clonedObj[key] = deepClone(obj[key]);
    });
    return clonedObj;
  }
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @param {number} decimals - 小数位数
 * @returns {string} 格式化后的文件大小
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * 检查是否为移动设备
 * @returns {boolean} 是否为移动设备
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth <= 768;
}

/**
 * 获取系统主题偏好
 * @returns {string} 'dark' 或 'light'
 */
export function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

/**
 * 设置主题
 * @param {string} theme - 主题名称: 'dark', 'light', 'auto'
 */
export function setTheme(theme) {
  const html = document.documentElement;
  
  if (theme === 'auto') {
    const systemTheme = getSystemTheme();
    html.setAttribute('data-darkmode', systemTheme === 'dark' ? 'true' : 'false');
  } else {
    html.setAttribute('data-darkmode', theme === 'dark' ? 'true' : 'false');
  }
  
  // 保存用户偏好
  localStorage.setItem('theme-preference', theme);
}

/**
 * 获取用户主题偏好
 * @returns {string} 主题偏好
 */
export function getThemePreference() {
  return localStorage.getItem('theme-preference') || 'auto';
}

/**
 * 初始化主题系统
 */
export function initThemeSystem() {
  const preference = getThemePreference();
  setTheme(preference);
  
  // 监听系统主题变化
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (getThemePreference() === 'auto') {
        setTheme('auto');
      }
    });
  }
}

/**
 * 验证表单字段
 * @param {HTMLFormElement} form - 表单元素
 * @returns {boolean} 验证结果
 */
export function validateForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;

  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.classList.add('border-red-500');
      isValid = false;
    } else {
      field.classList.remove('border-red-500');
    }
  });

  return isValid;
}

/**
 * 动态加载CSS
 * @param {string} href - CSS文件路径
 * @returns {Promise} 加载Promise
 */
export function loadCSS(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

/**
 * 动态加载JavaScript
 * @param {string} src - JS文件路径
 * @returns {Promise} 加载Promise
 */
export function loadJS(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// 全局暴露给LuCI系统
if (typeof window !== 'undefined') {
  window.ThemeUtils = {
    createElement,
    showNotification,
    scrollToElement,
    debounce,
    throttle,
    deepClone,
    formatFileSize,
    isMobile,
    getSystemTheme,
    setTheme,
    getThemePreference,
    initThemeSystem,
    validateForm,
    loadCSS,
    loadJS
  };
}
