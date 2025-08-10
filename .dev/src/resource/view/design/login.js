/**
 * LuCI Login Page - 登录页面专用入口
 * 轻量化的登录页面脚本
 */

import { initThemeSystem } from '../../utils.js';
import { authHandler } from '../../auth.js';

// 登录页面初始化
document.addEventListener('DOMContentLoaded', () => {
  // 初始化主题系统
  initThemeSystem();
  
  // 初始化认证处理器
  authHandler.init();
  
  // 添加登录页面特有的样式增强
  enhanceLoginPage();
});

/**
 * 增强登录页面
 */
function enhanceLoginPage() {
  const form = document.querySelector('form');
  if (!form) return;

  // 添加登录页面样式类
  document.body.classList.add('login-page');
  
  // 增强输入框样式
  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    input.classList.add(
      'transition-all', 'duration-200',
      'focus:scale-105', 'focus:shadow-lg'
    );
    
    // 添加输入框图标
    addInputIcon(input);
  });
  
  // 增强提交按钮
  const submitBtn = form.querySelector('button[type="submit"], .cbi-button-positive');
  if (submitBtn) {
    submitBtn.classList.add(
      'transform', 'hover:scale-105', 'active:scale-95',
      'shadow-lg', 'hover:shadow-xl'
    );
  }
}

/**
 * 为输入框添加图标
 * @param {HTMLInputElement} input - 输入框元素
 */
function addInputIcon(input) {
  const wrapper = input.parentElement;
  if (!wrapper || wrapper.querySelector('.input-icon')) return;

  const iconClass = input.type === 'password' ? 'lock' : 'user';
  const icon = document.createElement('div');
  icon.className = `input-icon absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${iconClass}`;
  icon.innerHTML = getIconSVG(iconClass);
  
  wrapper.style.position = 'relative';
  input.style.paddingLeft = '2.5rem';
  wrapper.insertBefore(icon, input);
}

/**
 * 获取图标SVG
 * @param {string} type - 图标类型
 * @returns {string} SVG HTML
 */
function getIconSVG(type) {
  const icons = {
    user: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
    </svg>`,
    lock: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
    </svg>`
  };
  
  return icons[type] || icons.user;
}

// 添加登录页面专用样式
const loginStyles = document.createElement('style');
loginStyles.textContent = `
  .login-page {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }
  
  .login-page .modal {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.9);
  }
  
  .login-page [data-darkmode="true"] .modal {
    background: rgba(31, 41, 55, 0.9);
  }
  
  .input-icon svg {
    transition: all 0.2s ease;
  }
  
  .cbi-value-field:focus-within .input-icon svg {
    color: #3b82f6;
    transform: translateY(-50%) scale(1.1);
  }
`;
document.head.appendChild(loginStyles);


