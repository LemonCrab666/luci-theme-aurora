/**
 * LuCI Authentication System - 认证系统模块
 * 现代化重构的登录认证系统
 */

import { createElement as E, showNotification } from './utils.js';

export class AuthenticationHandler {
  constructor() {
    this.form = null;
    this.submitButton = null;
    this.dialog = null;
    this.isLoading = false;
  }

  /**
   * 初始化认证系统
   */
  init() {
    this.setupForm();
    this.setupEventListeners();
    this.focusPasswordInput();
  }

  /**
   * 设置表单元素
   */
  setupForm() {
    this.form = document.querySelector('form');
    this.submitButton = document.querySelector('button.important, button[type="submit"]');
    
    if (!this.form || !this.submitButton) {
      console.warn('Authentication form elements not found');
      return;
    }
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    if (!this.form || !this.submitButton) return;

    // 回车键提交
    this.form.addEventListener('keypress', (ev) => {
      if (ev.key === 'Enter' && !this.isLoading) {
        ev.preventDefault();
        this.handleSubmit();
      }
    });

    // 按钮点击提交
    this.submitButton.addEventListener('click', (ev) => {
      ev.preventDefault();
      if (!this.isLoading) {
        this.handleSubmit();
      }
    });

    // 表单字段验证
    const inputs = this.form.querySelectorAll('input[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateInput(input));
      input.addEventListener('input', () => this.clearInputError(input));
    });
  }

  /**
   * 聚焦密码输入框
   */
  focusPasswordInput() {
    const passwordInput = document.querySelector('input[type="password"]');
    if (passwordInput) {
      // 延迟聚焦，确保页面完全加载
      setTimeout(() => {
        passwordInput.focus();
      }, 100);
    }
  }

  /**
   * 处理表单提交
   */
  async handleSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.setLoading(true);
    
    try {
      await this.showLoginDialog();
      await this.submitForm();
    } catch (error) {
      console.error('Login error:', error);
      this.showError('登录过程中发生错误，请重试');
    }
  }

  /**
   * 验证表单
   * @returns {boolean} 验证结果
   */
  validateForm() {
    const requiredInputs = this.form.querySelectorAll('input[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
      if (!this.validateInput(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * 验证单个输入框
   * @param {HTMLInputElement} input - 输入框元素
   * @returns {boolean} 验证结果
   */
  validateInput(input) {
    const value = input.value.trim();
    const isValid = value.length > 0;

    if (isValid) {
      this.clearInputError(input);
    } else {
      this.showInputError(input, '此字段为必填项');
    }

    return isValid;
  }

  /**
   * 显示输入框错误
   * @param {HTMLInputElement} input - 输入框元素
   * @param {string} message - 错误消息
   */
  showInputError(input, message) {
    input.classList.add('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
    
    // 移除现有错误消息
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // 添加新的错误消息
    const errorDiv = E('div', {
      class: 'error-message text-sm text-red-600 mt-1'
    }, [message]);
    
    input.parentElement.appendChild(errorDiv);
  }

  /**
   * 清除输入框错误
   * @param {HTMLInputElement} input - 输入框元素
   */
  clearInputError(input) {
    input.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
    
    const errorMessage = input.parentElement.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  /**
   * 显示登录对话框
   */
  async showLoginDialog() {
    if (typeof ui === 'undefined' || !ui.showModal) {
      console.warn('UI modal system not available');
      return;
    }

    const formElements = Array.from(document.querySelectorAll('section > *'));
    
    this.dialog = ui.showModal(
      _('授权验证'),
      formElements,
      'login'
    );

    // 增强对话框样式
    if (this.dialog) {
      this.dialog.classList.add(
        'transition-all', 'duration-300', 'transform',
        'bg-white', 'dark:bg-gray-800',
        'rounded-lg', 'shadow-2xl'
      );
    }
  }

  /**
   * 显示加载状态
   * @param {boolean} loading - 是否加载中
   */
  setLoading(loading) {
    this.isLoading = loading;

    if (loading) {
      // 隐藏所有对话框内容
      if (this.dialog) {
        this.dialog.querySelectorAll('*').forEach(node => {
          node.style.display = 'none';
        });

        // 显示加载动画
        const loadingDiv = E('div', {
          class: 'flex items-center justify-center p-8'
        }, [
          E('div', {
            class: 'spinning w-6 h-6 mr-3'
          }),
          E('span', {
            class: 'text-gray-700 dark:text-gray-300'
          }, [_('正在登录…')])
        ]);

        this.dialog.appendChild(loadingDiv);
      }

      // 禁用提交按钮
      if (this.submitButton) {
        this.submitButton.disabled = true;
        this.submitButton.classList.add('opacity-50', 'cursor-not-allowed');
      }
    } else {
      // 恢复提交按钮
      if (this.submitButton) {
        this.submitButton.disabled = false;
        this.submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }
  }

  /**
   * 提交表单
   */
  async submitForm() {
    return new Promise((resolve, reject) => {
      // 添加表单提交监听器
      const handleSubmit = () => {
        this.form.removeEventListener('submit', handleSubmit);
        resolve();
      };

      const handleError = (error) => {
        this.form.removeEventListener('error', handleError);
        reject(error);
      };

      this.form.addEventListener('submit', handleSubmit);
      this.form.addEventListener('error', handleError);

      // 提交表单
      try {
        this.form.submit();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 显示错误消息
   * @param {string} message - 错误消息
   */
  showError(message) {
    this.setLoading(false);
    showNotification(message, 'error');
  }

  /**
   * 重置表单
   */
  reset() {
    this.setLoading(false);
    
    if (this.form) {
      this.form.reset();
      
      // 清除所有错误状态
      const inputs = this.form.querySelectorAll('input');
      inputs.forEach(input => this.clearInputError(input));
    }
  }
}

// 创建并导出实例
export const authHandler = new AuthenticationHandler();

// 全局暴露给LuCI系统
if (typeof window !== 'undefined') {
  window.AuthenticationHandler = AuthenticationHandler;
}

// 自动初始化（如果在登录页面）
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('form') && document.querySelector('input[type="password"]')) {
      authHandler.init();
    }
  });
}
