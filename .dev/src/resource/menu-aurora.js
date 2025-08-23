'use strict';
'require baseclass';
'require ui';

return baseclass.extend({
	__init__() {
		ui.menu.load().then(L.bind(this.render, this));
		this.initMobileMenu();
	},

	initMobileMenu() {
		const menuToggle = document.getElementById('mobile-menu-btn');
		const overlay = document.getElementById('mobile-menu-overlay');
		
		if (menuToggle && overlay) {
			menuToggle.addEventListener('click', (e) => {
				e.stopPropagation();
				const isOpen = overlay.classList.contains('mobile-menu-open');
				
				if (isOpen) {
					this.closeMobileMenu();
				} else {
					this.openMobileMenu();
				}
			});

			// Close mobile menu when clicking overlay
			overlay.addEventListener('click', (e) => {
				if (e.target === overlay) {
					this.closeMobileMenu();
				}
			});

			// Close mobile menu when pressing Escape key
			document.addEventListener('keydown', (e) => {
				if (e.key === 'Escape' && overlay.classList.contains('mobile-menu-open')) {
					this.closeMobileMenu();
				}
			});
		}
	},

	openMobileMenu() {
		const overlay = document.getElementById('mobile-menu-overlay');
		const menuToggle = document.getElementById('mobile-menu-btn');
		
		overlay.classList.add('mobile-menu-open');
		menuToggle.classList.add('active');
		menuToggle.setAttribute('aria-expanded', 'true');
		
		// Prevent body scrolling
		document.body.style.overflow = 'hidden';
	},

	closeMobileMenu() {
		const overlay = document.getElementById('mobile-menu-overlay');
		const menuToggle = document.getElementById('mobile-menu-btn');
		
		overlay.classList.remove('mobile-menu-open');
		menuToggle.classList.remove('active');
		menuToggle.setAttribute('aria-expanded', 'false');
		
		// Restore body scrolling
		document.body.style.overflow = '';
	},

	renderMobileMenu(tree, url, level) {
		const mobileNavList = document.querySelector('#mobile-nav-list');
		const children = ui.menu.getChildren(tree);

		if (!mobileNavList || children.length === 0) return;

		// Clear existing mobile menu items on first render
		if (!level) {
			mobileNavList.innerHTML = '';
		}

		children.forEach(child => {
			const submenu = ui.menu.getChildren(child);
			const hasSubmenu = submenu.length > 0;
			const linkUrl = hasSubmenu ? '#' : L.url(url, child.name);
			
			const li = E('li', { 'class': 'mobile-nav-item' }, [
				E('a', { 
					'class': 'mobile-nav-link',
					'href': linkUrl,
					'data-has-submenu': hasSubmenu ? 'true' : 'false'
				}, [_(child.title)])
			]);

			// Add submenu items if they exist
			if (hasSubmenu && level < 1) {
				const submenuUl = E('ul', { 'class': 'mobile-nav-submenu' });
				submenu.forEach(subchild => {
					const subLi = E('li', { 'class': 'mobile-nav-subitem' }, [
						E('a', { 
							'class': 'mobile-nav-sublink',
							'href': L.url(url, child.name, subchild.name)
						}, [_(subchild.title)])
					]);
					submenuUl.appendChild(subLi);
				});
				li.appendChild(submenuUl);
			}

			mobileNavList.appendChild(li);
		});
	},

	render(tree) {
		let node = tree;
		let url = '';

		this.renderModeMenu(tree);

		if (L.env.dispatchpath.length >= 3) {
			for (var i = 0; i < 3 && node; i++) {
				node = node.children[L.env.dispatchpath[i]];
				url = url + (url ? '/' : '') + L.env.dispatchpath[i];
			}

			if (node)
				this.renderTabMenu(node, url);
		}
	},

	renderTabMenu(tree, url, level) {
		const container = document.querySelector('#tabmenu');
		const ul = E('ul', { 'class': 'tabs' });
		const children = ui.menu.getChildren(tree);
		let activeNode = null;

		children.forEach(child => {
			const isActive = (L.env.dispatchpath[3 + (level || 0)] == child.name);
			const activeClass = isActive ? ' active' : '';
			const className = 'tabmenu-item-%s %s'.format(child.name, activeClass);

			ul.appendChild(E('li', { 'class': className }, [
				E('a', { 'href': L.url(url, child.name) }, [ _(child.title) ] )]));

			if (isActive)
				activeNode = child;
		});

		if (ul.children.length == 0)
			return E([]);

		container.appendChild(ul);
		container.style.display = '';

		if (activeNode)
			this.renderTabMenu(activeNode, url + '/' + activeNode.name, (level || 0) + 1);

		return ul;
	},

	renderMainMenu(tree, url, level) {
		const ul = level ? E('ul', { 'class': 'dropdown-menu' }) : document.querySelector('#topmenu');
		const children = ui.menu.getChildren(tree);

		if (children.length == 0 || level > 1)
			return E([]);

		children.forEach(child => {
			const submenu = this.renderMainMenu(child, url + '/' + child.name, (level || 0) + 1);
			const subclass = (!level && submenu.firstElementChild) ? 'dropdown' : '';
			const linkclass = (!level && submenu.firstElementChild) ? 'menu' : 'menu';
			const linkurl = submenu.firstElementChild ? '#' : L.url(url, child.name);

			const li = E('li', { 'class': subclass }, [
				E('a', { 'class': linkclass, 'href': linkurl }, [
					_(child.title),
				]),
				submenu
			]);

			ul.appendChild(li);
		});

		// Show navigation for desktop
		ul.style.display = '';

		return ul;
	},

	renderModeMenu(tree) {
		const ul = document.querySelector('#modemenu');
		const children = ui.menu.getChildren(tree);

		children.forEach((child, index) => {
			const isActive = L.env.requestpath.length
				? child.name === L.env.requestpath[0]
				: index === 0;

			ul.appendChild(E('li', { 'class': isActive ? 'active' : '' }, [
				E('a', { 'href': L.url(child.name) }, [ _(child.title) ])
			]));

			if (isActive) {
				// Render desktop menu
				this.renderMainMenu(child, child.name);
				// Render mobile menu
				this.renderMobileMenu(child, child.name);
			}
		});

		if (ul.children.length > 1)
			ul.style.display = '';
	}
});