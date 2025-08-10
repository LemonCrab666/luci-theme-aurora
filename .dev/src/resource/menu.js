/**
 * LuCI Menu System - 菜单系统模块
 * 现代化重构的菜单渲染系统
 */

import { createElement as E } from './utils.js';

export class MenuRenderer {
  constructor() {
    this.init();
  }

  /**
   * 初始化菜单系统
   */
  init() {
    if (typeof ui !== 'undefined' && ui.menu) {
      ui.menu.load().then(tree => this.render(tree));
    }
  }

  /**
   * 渲染主菜单
   * @param {Object} tree - 菜单树
   */
  render(tree) {
    let node = tree;
    let url = '';

    this.renderModeMenu(tree);

    if (L.env.dispatchpath.length >= 3) {
      for (let i = 0; i < 3 && node; i++) {
        node = node.children[L.env.dispatchpath[i]];
        url = url + (url ? '/' : '') + L.env.dispatchpath[i];
      }

      if (node) {
        this.renderTabMenu(node, url);
      }
    }
  }

  /**
   * 渲染标签菜单
   * @param {Object} tree - 菜单树节点
   * @param {string} url - 当前URL
   * @param {number} level - 菜单层级
   */
  renderTabMenu(tree, url, level = 0) {
    const container = document.querySelector('#tabmenu');
    if (!container) return;

    const ul = E('ul', { 
      class: 'flex border-b border-gray-200 dark:border-gray-700 space-x-1' 
    });
    
    const children = ui.menu.getChildren(tree);
    let activeNode = null;

    children.forEach(child => {
      const isActive = (L.env.dispatchpath[3 + level] === child.name);
      const linkClasses = [
        'block py-2 px-4 text-sm font-medium border-b-2 transition-colors duration-200',
        isActive 
          ? 'text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400'
          : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
      ].join(' ');

      const li = E('li', { 
        class: `tabmenu-item-${child.name} ${isActive ? 'active' : ''}` 
      }, [
        E('a', { 
          href: L.url(url, child.name),
          class: linkClasses
        }, [_(child.title)])
      ]);

      ul.appendChild(li);

      if (isActive) {
        activeNode = child;
      }
    });

    if (ul.children.length === 0) {
      return;
    }

    container.innerHTML = '';
    container.appendChild(ul);
    container.style.display = '';

    // 递归渲染子菜单
    if (activeNode) {
      this.renderTabMenu(activeNode, url + '/' + activeNode.name, level + 1);
    }
  }

  /**
   * 渲染主要导航菜单
   * @param {Object} tree - 菜单树节点
   * @param {string} url - 当前URL
   * @param {number} level - 菜单层级
   */
  renderMainMenu(tree, url, level = 0) {
    const ul = level 
      ? E('ul', { 
          class: 'absolute top-full left-0 z-50 mt-1 min-w-[160px] bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible transform scale-95 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600' 
        })
      : document.querySelector('#topmenu');

    if (!ul) return E([]);

    const children = ui.menu.getChildren(tree);

    if (children.length === 0 || level > 1) {
      return E([]);
    }

    children.forEach(child => {
      const submenu = this.renderMainMenu(child, url + '/' + child.name, level + 1);
      const hasSubmenu = submenu.firstElementChild;
      const linkUrl = hasSubmenu ? '#' : L.url(url, child.name);

      const linkClasses = level === 0
        ? 'block px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
        : 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-100';

      const li = E('li', { 
        class: hasSubmenu && level === 0 ? 'relative dropdown' : '' 
      }, [
        E('a', { 
          class: linkClasses + (hasSubmenu ? ' dropdown-toggle' : ''),
          href: linkUrl 
        }, [_(child.title)]),
        submenu
      ]);

      // 添加下拉菜单hover效果
      if (hasSubmenu && level === 0) {
        li.addEventListener('mouseenter', () => {
          const menu = li.querySelector('.absolute');
          if (menu) {
            menu.classList.remove('opacity-0', 'invisible', 'scale-95');
            menu.classList.add('opacity-100', 'visible', 'scale-100');
          }
        });

        li.addEventListener('mouseleave', () => {
          const menu = li.querySelector('.absolute');
          if (menu) {
            menu.classList.add('opacity-0', 'invisible', 'scale-95');
            menu.classList.remove('opacity-100', 'visible', 'scale-100');
          }
        });
      }

      ul.appendChild(li);
    });

    if (level === 0) {
      ul.style.display = '';
    }

    return ul;
  }

  /**
   * 渲染模式菜单（顶级菜单）
   * @param {Object} tree - 菜单树
   */
  renderModeMenu(tree) {
    const ul = document.querySelector('#modemenu');
    if (!ul) return;

    const children = ui.menu.getChildren(tree);

    children.forEach((child, index) => {
      const isActive = L.env.requestpath.length
        ? child.name === L.env.requestpath[0]
        : index === 0;

      const linkClasses = [
        'block px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
        isActive 
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700'
      ].join(' ');

      const li = E('li', { 
        class: isActive ? 'active' : '' 
      }, [
        E('a', { 
          href: L.url(child.name),
          class: linkClasses
        }, [_(child.title)])
      ]);

      ul.appendChild(li);

      if (isActive) {
        this.renderMainMenu(child, child.name);
      }
    });

    if (ul.children.length > 1) {
      ul.style.display = '';
    }
  }
}

// 导出单例
export const menuRenderer = new MenuRenderer();

// 全局暴露给LuCI系统
if (typeof window !== 'undefined') {
  window.MenuRenderer = MenuRenderer;
}


