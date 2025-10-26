class GFModMenu {
    constructor() {
        this.isMenuVisible = true;
        this.currentSubmenu = null;
        this.selectedIndex = 0;
        this.isLightMode = false;
        this.isAnimatedMenu = true;
        this.menuWidth = 300;
        this.init();
    }
    init() {
        this.loadLogo();
        this.loadAnimatedTheme();
        this.createInfoBar();
        this.bindEvents();
        this.loadSettings();
        this.setupScrollbars();
        this.setupKeyboardNavigation();
        this.setupMainMenuHoverEvents();
        this.initializeSliderGradients();
        const menu = document.getElementById('mainMenu');
        if (menu) {
            menu.classList.add('visible');
        }
        this.updateSelectionIndicator();
        this.updateCounter();
    }
    loadLogo() {
        const logoElement = document.getElementById('menuLogo');
        if (logoElement) {
            logoElement.src = 'logo.png';
        }
    }
    loadAnimatedTheme() {
        const themeUrl = 'demo-animation.gif';
        document.documentElement.style.setProperty('--animated-theme', `url('${themeUrl}') repeat`);
        const headerBg = document.querySelector('.header-gif-bg');
        const footerBg = document.querySelector('.footer-gif-bg');
        if (headerBg) {
            headerBg.style.setProperty('background', `url('${themeUrl}') no-repeat`, 'important');
            headerBg.style.setProperty('background-size', 'cover', 'important');
            headerBg.style.setProperty('background-position', 'center', 'important');
            headerBg.style.setProperty('background-attachment', 'fixed', 'important');
            headerBg.style.setProperty('filter', 'saturate(0) blur(2px)', 'important');
        }
        if (footerBg) {
            footerBg.style.setProperty('background', `url('${themeUrl}') no-repeat`, 'important');
            footerBg.style.setProperty('background-size', 'cover', 'important');
            footerBg.style.setProperty('background-position', 'center', 'important');
            footerBg.style.setProperty('background-attachment', 'fixed', 'important');
            footerBg.style.setProperty('filter', 'saturate(0) blur(2px)', 'important');
        }
    }
    createInfoBar() {
        const menu = document.querySelector('.menu');
        const menuWidth = menu ? menu.offsetWidth : 300;
        const infoBar = document.createElement('div');
        infoBar.id = 'infoBar';
        infoBar.className = 'info-bar';
        infoBar.style.cssText = `
            position: absolute;
            width: 300px;
            min-height: 30px;
            background: linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(20, 20, 20, 0.9) 100%);
            backdrop-filter: blur(10px);
            outline: none;
            display: flex;
            align-items: center;
            padding: 5px 15px;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            z-index: 9999;
            pointer-events: none;
            transform-origin: right center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        `;
        const infoIcon = document.createElement('img');
        infoIcon.className = 'info-icon';
        infoIcon.src = 'shield-icon.png';
        infoIcon.style.cssText = `
            width: 20px;
            height: 20px;
            margin-right: 10px;
            filter: brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(10000%) hue-rotate(210deg) brightness(100%) contrast(100%);
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        infoIcon.style.setProperty('--icon-color', 'var(--gradient-left)');
        infoIcon.style.filter = 'brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(10000%) hue-rotate(210deg) brightness(100%) contrast(100%)';
        const infoText = document.createElement('div');
        infoText.id = 'infoText';
        infoText.className = 'info-text';
        infoText.textContent = 'Select a feature to see its description';
        infoText.style.cssText = `
            color: white;
            font-size: 13px;
            font-weight: 500;
            line-height: 1.4;
            flex: 1;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
        `;
        infoBar.appendChild(infoIcon);
        infoBar.appendChild(infoText);
        document.body.appendChild(infoBar);
        this.infoBar = infoBar;
        this.infoText = infoText;
        setTimeout(() => {
            this.updateInfoBarPosition();
        }, 100);
    }
    updateInfoBarPosition() {
        if (!this.infoBar) {
            return;
        }
        const menu = document.querySelector('.menu');
        if (!menu) {
            return;
        }
        const menuRect = menu.getBoundingClientRect();
        const footer = document.querySelector('.menu-footer');
        const footerRect = footer ? footer.getBoundingClientRect() : null;
        const top = footerRect ? footerRect.bottom + 15 : menuRect.bottom + 15;
        const left = menuRect.left;
        this.infoBar.style.top = `${top}px`;
        this.infoBar.style.left = `${left}px`;
        this.infoBar.style.width = `${this.menuWidth}px`;
    }
    bindEvents() {
        const mainMenuLabel = document.querySelector('.main-menu-label');
        if (mainMenuLabel) {
            mainMenuLabel.addEventListener('click', () => {
                if (this.currentSubmenu !== null) {
                    this.goBack();
                }
            });
        }
        const menuLogo = document.getElementById('menuLogo');
        if (menuLogo) {
            menuLogo.addEventListener('click', () => {
                this.toggleMenu();
            });
        }
        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.goBack();
            });
        }
        document.querySelectorAll('.sub-menu-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                if (this.isMenuVisible) {
                    this.openSubmenu(index);
                }
            });
            item.addEventListener('mouseenter', () => {
                if (this.isMenuVisible) {
                    this.updateInfoBarForItem(item);
                    this.updateSubMenuHoverWidth(item);
                    this.updateSelectionIndicatorForHover(item);
                    item.style.setProperty('--hover-opacity', '1');
                }
            });
            item.addEventListener('mouseleave', () => {
                if (this.isMenuVisible) {
                    this.hideInfoBar();
                    this.resetSubMenuHoverWidth(item);
                    this.resetSelectionIndicator();
                    item.style.removeProperty('--hover-opacity');
                }
            });
        });
        document.querySelectorAll('.switch-item').forEach(switchItem => {
            this.setupSwitchEvents(switchItem);
            switchItem.addEventListener('mouseenter', () => {
                if (this.isMenuVisible) {
                    this.updateInfoBarForItem(switchItem);
                    this.updateSwitchHoverWidth(switchItem);
                    this.updateSelectionIndicatorForHover(switchItem);
                    switchItem.style.setProperty('--hover-opacity', '1');
                }
            });
            switchItem.addEventListener('mouseleave', () => {
                if (this.isMenuVisible) {
                    this.hideInfoBar();
                    this.resetSwitchHoverWidth(switchItem);
                    this.resetSelectionIndicator();
                    switchItem.style.removeProperty('--hover-opacity');
                }
            });
        });
        this.setupSubmenuHoverEvents();
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });
        window.addEventListener('resize', () => {
            this.updateInfoBarPosition();
        });
        const observer = new MutationObserver(() => {
            this.updateInfoBarPosition();
        });
        if (menu) {
            observer.observe(menu, {
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }
        window.addEventListener('resize', () => {
            this.updateLayout();
            this.updateInfoBarPosition();
        });
    }
    setupSwitchEvents(switchItem) {
        switch(switchType) {
            case 'offset-switch':
                this.setupOffsetSwitch(switchItem);
                break;
            case 'slider-switch':
                this.setupSliderSwitch(switchItem);
                break;
            case 'textfield-switch':
                this.setupTextFieldSwitch(switchItem);
                break;
            case 'function-switch':
                this.setupFunctionSwitch(switchItem);
                break;
        }
    }
    setupOffsetSwitch(switchItem) {
        const statusElement = switchItem.querySelector('.switch-status');
        const switchKey = switchItem.dataset.switch;
        const savedState = localStorage.getItem(switchKey);
        if (savedState === 'true') {
            this.toggleSwitch(switchItem, true);
        }
        switchItem.addEventListener('click', () => {
            const isOn = switchItem.classList.contains('on');
            this.toggleSwitch(switchItem, !isOn);
            localStorage.setItem(switchKey, (!isOn).toString());
            this.playSound('switch');
        });
        let pressTimer;
        switchItem.addEventListener('mousedown', () => {
            pressTimer = setTimeout(() => {
                this.showInfo(switchItem);
            }, 500);
        });
        switchItem.addEventListener('mouseup', () => {
            clearTimeout(pressTimer);
        });
        switchItem.addEventListener('mouseleave', () => {
            clearTimeout(pressTimer);
        });
    }
    setupSliderSwitch(switchItem) {
        const slider = switchItem.querySelector('.slider-input');
        const valueElement = switchItem.querySelector('.switch-value');
        const switchKey = switchItem.dataset.switch;
        const savedValue = localStorage.getItem(switchKey);
        if (savedValue) {
            slider.value = savedValue;
            valueElement.textContent = savedValue;
        } else {
            const defaultValue = slider.value || slider.min || 0;
            valueElement.textContent = defaultValue;
        }
        this.updateSliderGradient(slider, slider.value, switchKey);
        this.setupSliderEventListeners(slider, switchKey, switchItem);
    }
    setupSliderEventListeners(slider, switchKey, switchItem) {
        const valueElement = switchItem.querySelector('.switch-value');
        slider.addEventListener('input', (e) => {
            const value = e.target.value;
            valueElement.textContent = value;
            localStorage.setItem(switchKey, value);
            this.updateSliderGradient(slider, value, switchKey);
            if (switchKey === 'menu_width') {
                this.updateMenuWidth(parseInt(value));
            } else if (switchKey === 'gif_blur') {
                this.updateGIFBlur();
            }
        });
        slider.addEventListener('change', (e) => {
            const value = e.target.value;
            this.updateSliderGradient(slider, value, switchKey);
        });
        slider.addEventListener('mousemove', (e) => {
            const value = e.target.value;
            this.updateSliderGradient(slider, value, switchKey);
        });
        slider.addEventListener('touchmove', (e) => {
            const value = e.target.value;
            this.updateSliderGradient(slider, value, switchKey);
        });
        slider.addEventListener('mouseover', (e) => {
            const value = e.target.value;
            this.updateSliderGradient(slider, value, switchKey);
        });
        slider.addEventListener('mouseenter', (e) => {
            const value = e.target.value;
            this.updateSliderGradient(slider, value, switchKey);
        });
        slider.addEventListener('mousedown', () => {
            switchItem.style.transform = 'scale(0.98)';
        });
        slider.addEventListener('mouseup', () => {
            switchItem.style.transform = 'scale(1)';
        });
    }
    updateSliderGradient(slider, value, switchKey) {
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const percentage = ((value - min) / (max - min)) * 100;
        let gradientBg = slider.parentNode.querySelector('.slider-gradient-bg');
        if (!gradientBg) {
            gradientBg = document.createElement('div');
            gradientBg.className = 'slider-gradient-bg';
            gradientBg.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                height: 18px;
                border-radius: 9px;
                pointer-events: none;
                z-index: 1;
            `;
            slider.parentNode.style.position = 'relative';
            slider.parentNode.insertBefore(gradientBg, slider);
        }
        gradientBg.style.width = '100%';
        let grayOverlay = slider.parentNode.querySelector('.slider-gray-overlay');
        if (!grayOverlay) {
            grayOverlay = document.createElement('div');
            grayOverlay.className = 'slider-gray-overlay';
            grayOverlay.style.cssText = `
                position: absolute;
                top: 0;
                height: 18px;
                border-radius: 9px;
                background: #212121;
                pointer-events: none;
                z-index: 5;
                box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5), 0 0 5px rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(0, 0, 0, 0.8);
            `;
            slider.parentNode.insertBefore(grayOverlay, slider);
        }
        const adjustedPercentage = Math.max(0, percentage - offset);
        grayOverlay.style.left = `${adjustedPercentage}%`;
        grayOverlay.style.width = `${100 - adjustedPercentage}%`;
        if (switchKey === 'custom_left' || switchKey === 'custom_right' || switchKey === 'custom_menu_color') {
            const hue = (percentage / 100) * 360;
            const color = `hsl(${hue}, 100%, 50%)`;
            gradientBg.style.background = `linear-gradient(90deg, ${color} 0%, ${color} 100%)`;
        } else {
            const leftColor = getComputedStyle(document.documentElement).getPropertyValue('--gradient-left').trim();
            const rightColor = getComputedStyle(document.documentElement).getPropertyValue('--gradient-right').trim();
            gradientBg.style.background = `linear-gradient(90deg, ${leftColor} 0%, ${rightColor} 100%)`;
        }
    }
    initializeSliderGradients() {
        const sliders = document.querySelectorAll('.slider-input');
        sliders.forEach(slider => {
            const switchItem = slider.closest('.switch-item');
            if (switchItem) {
                const switchKey = switchItem.dataset.switch;
                const value = slider.value || slider.min || 0;
                this.updateSliderGradient(slider, value, switchKey);
            }
        });
    }
    setupTextFieldSwitch(switchItem) {
        const textField = switchItem.querySelector('.switch-textfield');
        const statusElement = switchItem.querySelector('.switch-status');
        const switchKey = switchItem.dataset.switch;
        const savedValue = localStorage.getItem(switchKey);
        if (savedValue) {
            textField.value = savedValue;
        }
        textField.addEventListener('input', (e) => {
            localStorage.setItem(switchKey, e.target.value);
        });
        textField.addEventListener('focus', () => {
            textField.select();
        });
        switchItem.addEventListener('click', (e) => {
            if (e.target !== textField) {
                const isOn = switchItem.classList.contains('on');
                this.toggleSwitch(switchItem, !isOn);
                localStorage.setItem(switchKey + '_enabled', (!isOn).toString());
            }
        });
    }
    setupFunctionSwitch(switchItem) {
        const button = switchItem.querySelector('.switch-button');
        const switchKey = switchItem.dataset.switch;
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.executeFunction(switchKey);
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        });
    }
    toggleSwitch(switchItem, isOn) {
        const statusElement = switchItem.querySelector('.switch-status');
        if (isOn) {
            switchItem.classList.add('on');
            if (statusElement) {
                statusElement.textContent = 'ON';
                statusElement.classList.add('on');
            }
        } else {
            switchItem.classList.remove('on');
            if (statusElement) {
                statusElement.textContent = 'OFF';
                statusElement.classList.remove('on');
            }
        }
        this.applySwitchStyle(switchItem);
    }
    applySwitchStyle(switchItem) {
        switchItem.classList.remove(
            'switch-style-classic',
            'switch-style-checkbox',
            'switch-style-toggle',
            'switch-style-globe',
            'switch-style-snowflake',
            'switch-style-leaf',
            'switch-style-ant',
            'switch-style-brain'
        );
        switchItem.classList.add(`switch-style-${this.switchStyle}`);
    }
    toggleMenu() {
        const menu = document.getElementById('mainMenu');
        const backButton = document.getElementById('backButton');
        if (!menu) return;
        if (this.isMenuVisible) {
            menu.classList.remove('visible');
            if (backButton) {
                backButton.classList.remove('visible');
            }
            this.isMenuVisible = false;
        } else {
            menu.classList.add('visible');
            this.isMenuVisible = true;
            this.updateSelectionIndicator();
            this.updateCounter();
            this.setupMainMenuHoverEvents();
            setTimeout(() => {
                this.updateInfoBarPosition();
            }, 100);
        }
    }
    toggleTheme() {
        const body = document.body;
        if (this.isLightMode) {
            body.classList.remove('light-mode');
            this.isLightMode = false;
        } else {
            body.classList.add('light-mode');
            this.isLightMode = true;
        }
        localStorage.setItem('gfTheme', this.isLightMode ? 'light' : 'dark');
    }
    openSubmenu(index) {
        const mainScrollView = document.getElementById('mainScrollView');
        if (!mainScrollView) return;
        mainScrollView.innerHTML = '';
        const targetSubmenu = document.querySelector(`.submenu-content[data-submenu="${index}"]`);
        if (targetSubmenu) {
            const clonedContent = targetSubmenu.cloneNode(true);
            clonedContent.classList.add('active');
            clonedContent.style.display = 'block';
            mainScrollView.appendChild(clonedContent);
        }
        this.currentSubmenu = index;
        this.selectedIndex = 0;
        this.updateHeaderTitle(index);
        this.updateSelectionIndicator();
        this.updateCounter();
        this.setupSubmenuHoverEvents();
        setTimeout(() => {
            this.updateInfoBarPosition();
        }, 50);
    }
    goBack() {
        const mainScrollView = document.getElementById('mainScrollView');
        if (!mainScrollView) return;
        mainScrollView.innerHTML = '';
        const originalItems = [
            '<div class="sub-menu-item" data-submenu="0"><span class="sub-menu-text">Remote Server</span><div class="sub-menu-arrow">▶</div></div>',
            '<div class="sub-menu-item" data-submenu="1"><span class="sub-menu-text">Gamepad Menu</span><div class="sub-menu-arrow">▶</div></div>',
            '<div class="sub-menu-item" data-submenu="2"><span class="sub-menu-text">Theme Menu</span><div class="sub-menu-arrow">▶</div></div>',
            '<div class="sub-menu-item" data-submenu="3"><span class="sub-menu-text">Colors Menu</span><div class="sub-menu-arrow">▶</div></div>',
            '<div class="sub-menu-item" data-submenu="4"><span class="sub-menu-text">Toggle Styles Menu</span><div class="sub-menu-arrow">▶</div></div>',
            '<div class="sub-menu-item" data-submenu="5"><span class="sub-menu-text">Animation Menu</span><div class="sub-menu-arrow">▶</div></div>',
            '<div class="sub-menu-item" data-submenu="6"><span class="sub-menu-text">Configure Menu</span><div class="sub-menu-arrow">▶</div></div>'
        ];
        originalItems.forEach(itemHTML => {
            mainScrollView.insertAdjacentHTML('beforeend', itemHTML);
        });
        this.currentSubmenu = null;
        this.selectedIndex = 0;
        this.updateHeaderTitle(null);
        this.setupMainMenuHoverEvents();
        document.querySelectorAll('.sub-menu-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.openSubmenu(index);
            });
        });
        this.updateSelectionIndicator();
        this.updateCounter();
        setTimeout(() => {
            this.updateInfoBarPosition();
        }, 50);
    }
    updateSelectionIndicator() {
        const items = this.currentSubmenu !== null 
            ? document.querySelectorAll('.submenu-content.active .switch-item')
            : document.querySelectorAll('.sub-menu-item');
        document.querySelectorAll('.sub-menu-item, .switch-item').forEach(item => {
            item.style.setProperty('--indicator-opacity', '0');
        });
        if (items.length > 0 && this.selectedIndex < items.length) {
            const selectedItem = items[this.selectedIndex];
            selectedItem.style.setProperty('--indicator-opacity', '1');
        }
    }
    updateSelectionIndicatorForHover(hoveredItem) {
        if (!hoveredItem) return;
        document.querySelectorAll('.sub-menu-item, .switch-item').forEach(item => {
            item.style.setProperty('--indicator-opacity', '0');
        });
        hoveredItem.style.setProperty('--indicator-opacity', '1');
    }
    resetSelectionIndicator() {
        document.querySelectorAll('.sub-menu-item, .switch-item').forEach(item => {
            item.style.setProperty('--indicator-opacity', '0');
        });
        if (!document.querySelector('.sub-menu-item:hover, .switch-item:hover')) {
            this.updateSelectionIndicator();
        }
    }
    setupSubmenuHoverEvents() {
        const activeSubmenu = document.querySelector('.submenu-content.active');
        if (!activeSubmenu) {
            return;
        }
        const switchItems = activeSubmenu.querySelectorAll('.switch-item');
        switchItems.forEach((switchItem, index) => {
            const slider = switchItem.querySelector('.slider-input');
            if (slider) {
                const switchKey = switchItem.dataset.switch;
                const value = slider.value || slider.min || 0;
                this.updateSliderGradient(slider, value, switchKey);
                this.setupSliderEventListeners(slider, switchKey, switchItem);
            }
            switchItem.addEventListener('mouseenter', () => {
                this.updateInfoBarForItem(switchItem);
                this.updateSelectionIndicatorForHover(switchItem);
                if (switchItem.classList.contains('function-selector')) {
                    this.updateFunctionSelectorHoverWidth(switchItem);
                } else {
                    this.updateSwitchHoverWidth(switchItem);
                }
                switchItem.style.setProperty('--hover-opacity', '1');
                this.updateCounterForHover(index);
            });
            switchItem.addEventListener('mousemove', (e) => {
                this.updateSelectionIndicatorForHover(switchItem);
            });
            switchItem.addEventListener('mouseleave', () => {
                this.hideInfoBar();
                this.resetSelectionIndicator();
                if (switchItem.classList.contains('function-selector')) {
                    this.resetFunctionSelectorHoverWidth(switchItem);
                } else {
                    this.resetSwitchHoverWidth(switchItem);
                }
                switchItem.style.removeProperty('--hover-opacity');
                this.updateCounter();
            });
            switchItem.addEventListener('click', (e) => {
                if (e.target.closest('.slider-input')) {
                    return;
                }
                if (switchItem.classList.contains('function-selector')) {
                    this.handleFunctionSelectorClick(e, switchItem);
                    return;
                }
                this.toggleSwitch(switchItem);
            });
        });
        const mainScrollView = document.getElementById('mainScrollView');
        if (mainScrollView) {
            mainScrollView.addEventListener('mousemove', (e) => {
                const hoveredItem = e.target.closest('.switch-item');
                if (hoveredItem) {
                    this.updateSelectionIndicatorForHover(hoveredItem);
                }
            });
        }
    }
    setupMainMenuHoverEvents() {
        const mainMenuItems = document.querySelectorAll('.sub-menu-item');
        mainMenuItems.forEach((subMenuItem, index) => {
            subMenuItem.addEventListener('mouseenter', () => {
                if (this.isMenuVisible) {
                    this.updateInfoBarForItem(subMenuItem);
                    this.updateSelectionIndicatorForHover(subMenuItem);
                    this.updateSubMenuHoverWidth(subMenuItem);
                    subMenuItem.style.setProperty('--hover-opacity', '1');
                    this.updateCounterForHover(index);
                }
            });
            subMenuItem.addEventListener('mousemove', (e) => {
                if (this.isMenuVisible) {
                    this.updateSelectionIndicatorForHover(subMenuItem);
                }
            });
            subMenuItem.addEventListener('mouseleave', () => {
                if (this.isMenuVisible) {
                    this.hideInfoBar();
                    this.resetSelectionIndicator();
                    this.resetSubMenuHoverWidth(subMenuItem);
                    subMenuItem.style.removeProperty('--hover-opacity');
                    this.updateCounter();
                }
            });
        });
        const mainScrollView = document.getElementById('mainScrollView');
        if (mainScrollView) {
            mainScrollView.addEventListener('mousemove', (e) => {
                if (this.isMenuVisible) {
                    const hoveredItem = e.target.closest('.sub-menu-item');
                    if (hoveredItem) {
                        this.updateSelectionIndicatorForHover(hoveredItem);
                    }
                }
            });
        }
    }
    updateCounter() {
        const counter = document.querySelector('.counter-label');
        if (!counter) return;
        const items = this.currentSubmenu !== null 
            ? document.querySelectorAll('.submenu-content.active .switch-item')
            : document.querySelectorAll('.sub-menu-item');
        const total = items.length;
        const current = this.selectedIndex + 1;
        counter.textContent = `${current}/${total}`;
    }
    updateCounterForHover(hoveredIndex) {
        const counter = document.querySelector('.counter-label');
        if (!counter) return;
        const items = this.currentSubmenu !== null 
            ? document.querySelectorAll('.submenu-content.active .switch-item')
            : document.querySelectorAll('.sub-menu-item');
        const total = items.length;
        const current = hoveredIndex + 1;
        counter.textContent = `${current}/${total}`;
    }
    setupScrollbars() {
        const mainScrollView = document.getElementById('mainScrollView');
        const mainScrollbar = document.getElementById('mainScrollbar');
        mainScrollView.addEventListener('scroll', () => {
            this.updateScrollbar(mainScrollView, mainScrollbar);
            this.updateSelectionIndicator();
            const hoveredItem = document.querySelector('.sub-menu-item:hover, .switch-item:hover');
            if (hoveredItem) {
                this.updateSelectionIndicatorForHover(hoveredItem);
            }
        });
        this.updateScrollbar(mainScrollView, mainScrollbar);
    }
    updateScrollbar(scrollView, scrollbar) {
        const scrollHeight = scrollView.scrollHeight;
        const clientHeight = scrollView.clientHeight;
        const scrollTop = scrollView.scrollTop;
        if (scrollHeight > clientHeight) {
            const thumbHeight = (clientHeight / scrollHeight) * clientHeight;
            const thumbTop = (scrollTop / scrollHeight) * clientHeight;
            const thumb = scrollbar.querySelector('.scrollbar-thumb');
            thumb.style.height = `${thumbHeight}px`;
            thumb.style.top = `${thumbTop}px`;
            scrollbar.classList.add('visible');
        } else {
            scrollbar.classList.remove('visible');
        }
    }
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isMenuVisible) return;
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.navigateUp();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.navigateDown();
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.activateSelected();
                    break;
                case 'Escape':
                    e.preventDefault();
                    if (this.currentSubmenu !== null) {
                        this.goBack();
                    } else {
                        this.toggleMenu();
                    }
                    break;
            }
        });
    }
    navigateUp() {
        const items = this.currentSubmenu !== null 
            ? document.querySelectorAll('.submenu-content.active .switch-item')
            : document.querySelectorAll('.sub-menu-item');
        if (this.selectedIndex > 0) {
            this.selectedIndex--;
        } else {
            this.selectedIndex = items.length - 1;
        }
        this.updateSelectionIndicator();
        this.updateCounter();
        this.scrollToSelected();
    }
    navigateDown() {
        const items = this.currentSubmenu !== null 
            ? document.querySelectorAll('.submenu-content.active .switch-item')
            : document.querySelectorAll('.sub-menu-item');
        if (this.selectedIndex < items.length - 1) {
            this.selectedIndex++;
        } else {
            this.selectedIndex = 0;
        }
        this.updateSelectionIndicator();
        this.updateCounter();
        this.scrollToSelected();
    }
    activateSelected() {
        const items = this.currentSubmenu !== null 
            ? document.querySelectorAll('.submenu-content.active .switch-item')
            : document.querySelectorAll('.sub-menu-item');
        if (items[this.selectedIndex]) {
            items[this.selectedIndex].click();
        }
    }
    scrollToSelected() {
        const items = this.currentSubmenu !== null 
            ? document.querySelectorAll('.submenu-content.active .switch-item')
            : document.querySelectorAll('.sub-menu-item');
        if (items[this.selectedIndex]) {
            items[this.selectedIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }
    handleKeyboardInput(e) {
        switch(e.key) {
            case 'F1':
                e.preventDefault();
                this.toggleMenu();
                break;
            case 'F2':
                e.preventDefault();
                this.toggleLightMode();
                break;
            case 'F3':
                e.preventDefault();
                this.cycleSwitchStyle();
                break;
        }
    }
    toggleLightMode() {
        this.isLightMode = !this.isLightMode;
        document.body.classList.toggle('light-mode', this.isLightMode);
        localStorage.setItem('light_mode', this.isLightMode.toString());
    }
    cycleSwitchStyle() {
        const styles = ['classic', 'checkbox', 'toggle', 'globe', 'snowflake', 'leaf', 'ant', 'brain'];
        const currentIndex = styles.indexOf(this.switchStyle);
        const nextIndex = (currentIndex + 1) % styles.length;
        this.switchStyle = styles[nextIndex];
        document.querySelectorAll('.switch-item').forEach(switchItem => {
            this.applySwitchStyle(switchItem);
        });
        localStorage.setItem('switch_style', this.switchStyle);
    }
    updateMenuWidth(width) {
        this.menuWidth = width;
        const contentView = document.getElementById('contentScrollView');
        if (menu) {
            menu.style.width = `${width}px`;
        }
        if (contentView) {
            contentView.style.width = `${width + 15}px`;
        }
        if (this.infoBar) {
            this.infoBar.style.width = `${width}px`;
            setTimeout(() => {
                this.updateInfoBarPosition();
            }, 10);
        }
        localStorage.setItem('menu_width', width.toString());
    }
    loadSettings() {
        this.isLightMode = localStorage.getItem('gfTheme') === 'light';
        this.switchStyle = localStorage.getItem('switch_style') || 'classic';
        this.isAnimatedMenu = localStorage.getItem('animated_menu') !== 'false';
        this.menuWidth = parseInt(localStorage.getItem('menu_width')) || 300;
        document.body.classList.toggle('light-mode', this.isLightMode);
        this.updateMenuWidth(this.menuWidth);
        if (!localStorage.getItem('switch_enable_animated_menu')) {
            localStorage.setItem('switch_enable_animated_menu', 'ON');
        }
        if (!localStorage.getItem('switch_controller_support')) {
            localStorage.setItem('switch_controller_support', 'ON');
        }
        document.querySelectorAll('.switch-item').forEach(switchItem => {
            this.applySwitchStyle(switchItem);
            this.loadSwitchState(switchItem);
        });
        this.loadFunctionSelectorStates();
        this.updateGIFBlur();
    }
    loadSwitchState(switchItem) {
        const switchKey = switchItem.dataset.switch;
        if (!switchKey) return;
        const savedStatus = localStorage.getItem(`switch_${switchKey}`);
        const statusElement = switchItem.querySelector('.switch-status');
        if (statusElement) {
            const finalStatus = savedStatus || statusElement.textContent.trim();
            statusElement.textContent = finalStatus;
            this.updateSwitchVisual(statusElement, finalStatus);
            if (finalStatus === 'ON') {
                switchItem.classList.add('on');
                statusElement.classList.add('on');
            } else {
                switchItem.classList.remove('on');
                statusElement.classList.remove('on');
            }
        }
    }
    showInfo(switchItem) {
        const switchKey = switchItem.dataset.switch;
        const descriptions = {
            'aimbot_enabled': 'Enable automatic aiming assistance',
            'esp_enabled': 'Enable player ESP (wallhacks)',
            'bhop': 'Enable automatic bunny hopping',
            'streamer_mode': 'Hide sensitive information for streaming',
            'light_mode': 'Switch between light and dark themes',
            'animated_menu': 'Enable animated background effects'
        };
        const description = descriptions[switchKey] || 'No description available';
        const tooltip = document.createElement('div');
        tooltip.className = 'info-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-header">${switchItem.querySelector('.switch-label').textContent}</div>
            <div class="tooltip-content">${description}</div>
        `;
        document.body.appendChild(tooltip);
        const rect = switchItem.getBoundingClientRect();
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.bottom + 5}px`;
        setTimeout(() => {
            tooltip.remove();
        }, 3000);
    }
    executeFunction(functionKey) {
        const functions = {
            'teleport': () => {
                this.showNotification('Teleported to spawn point');
            }
        };
        if (functions[functionKey]) {
            functions[functionKey]();
        }
    }
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
    playSound(type) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        if (type === 'switch') {
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        }
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    updateLayout() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }
    showInfoBar(text) {
        if (this.infoBar && this.infoText) {
            this.infoText.textContent = text;
            this.updateInfoBarPosition();
            this.infoBar.style.opacity = '1';
            this.infoBar.style.transform = 'translateY(0)';
        } else {
        }
    }
    hideInfoBar() {
        if (this.infoBar) {
            this.infoBar.style.opacity = '0';
            this.infoBar.style.transform = 'translateY(-10px)';
        }
    }
    updateSwitchHoverWidth(switchItem) {
        const label = switchItem.querySelector('.switch-label');
        if (!label) return;
        const tempSpan = document.createElement('span');
        tempSpan.style.cssText = `
            position: absolute;
            visibility: hidden;
            white-space: nowrap;
            font-family: inherit;
            font-size: inherit;
            font-weight: inherit;
        `;
        tempSpan.textContent = label.textContent;
        document.body.appendChild(tempSpan);
        const textWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
        const dynamicWidth = textWidth + padding;
        switchItem.style.setProperty('--hover-width', `${dynamicWidth}px`);
    }
    resetSwitchHoverWidth(switchItem) {
        switchItem.style.removeProperty('--hover-width');
    }
    updateSubMenuHoverWidth(subMenuItem) {
        const text = subMenuItem.querySelector('.sub-menu-text');
        if (!text) return;
        const tempSpan = document.createElement('span');
        tempSpan.style.cssText = `
            position: absolute;
            visibility: hidden;
            white-space: nowrap;
            font-family: inherit;
            font-size: inherit;
            font-weight: inherit;
        `;
        tempSpan.textContent = text.textContent;
        document.body.appendChild(tempSpan);
        const textWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
        const dynamicWidth = textWidth + padding;
        subMenuItem.style.setProperty('--hover-width', `${dynamicWidth}px`);
    }
    resetSubMenuHoverWidth(subMenuItem) {
        subMenuItem.style.removeProperty('--hover-width');
    }
    updateSwitchHoverWidth(switchItem) {
        const text = switchItem.querySelector('.switch-label');
        if (!text) return;
        const tempSpan = document.createElement('span');
        tempSpan.style.cssText = `
            position: absolute;
            visibility: hidden;
            white-space: nowrap;
            font-family: inherit;
            font-size: inherit;
            font-weight: inherit;
        `;
        tempSpan.textContent = text.textContent;
        document.body.appendChild(tempSpan);
        const textWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
        const dynamicWidth = textWidth + padding;
        switchItem.style.setProperty('--hover-width', `${dynamicWidth}px`);
    }
    resetSwitchHoverWidth(switchItem) {
        switchItem.style.removeProperty('--hover-width');
    }
    updateInfoBarForItem(item) {
        const descriptions = {
            'Remote Server': 'Navigate to Remote Server settings and configurations',
            'Gamepad Menu': 'Navigate to Gamepad settings and light bar controls',
            'Theme Menu': 'Navigate to Theme selection and customization',
            'Colors Menu': 'Navigate to Color selection and customization',
            'Toggle Styles Menu': 'Navigate to Toggle style selection',
            'Animation Menu': 'Navigate to Animation settings and controls',
            'Configure Menu': 'Navigate to Menu configuration and settings',
            'remote_control': 'Enable ESP in web browser. Server starts once per session.',
            'controller_support': 'Enable gamepad detection and support',
            'light_red': 'Sets controller light bar to red',
            'light_green': 'Sets controller light bar to green',
            'light_blue': 'Sets controller light bar to blue',
            'light_yellow': 'Sets controller light bar to yellow',
            'light_purple': 'Sets controller light bar to purple',
            'light_cyan': 'Sets controller light bar to cyan',
            'light_white': 'Sets controller light bar to white',
            'rgb_cycle': 'Enables smooth RGB color cycling',
            'sky': 'Blue sky gradient theme',
            'slight_ocean_view': 'Blue to purple gradient theme',
            'quepal': 'Green gradient theme',
            'sublime_light': 'Pink to blue gradient theme',
            'rainbow_blue': 'Green to blue gradient theme',
            'learning_and_leading': 'Orange to yellow gradient theme',
            'pacific_dream': 'Teal to dark blue gradient theme',
            'black_rose': 'Pink gradient theme',
            'ali': 'Orange to cyan gradient theme',
            'ukraine': 'Blue to yellow gradient theme',
            'vasily': 'Yellow to black gradient theme',
            'red_fire': 'Dark red to bright red gradient theme',
            'custom_left': 'Customize left gradient color',
            'custom_right': 'Customize right gradient color',
            'red_color': 'Solid red menu color',
            'green_color': 'Solid green menu color',
            'blue_color': 'Solid blue menu color',
            'yellow_color': 'Solid yellow menu color',
            'purple_color': 'Solid purple menu color',
            'cyan_color': 'Solid cyan menu color',
            'white_color': 'Solid white menu color',
            'black_color': 'Solid black menu color',
            'custom_menu_color': 'Customize menu color with RGB slider',
            'classic_switch': 'Classic ON/OFF style',
            'checkbox': 'Checkbox style',
            'toggle': 'Toggle style',
            'globe_switch': 'Globe icon with gradient',
            'snowflake_switch': 'Snowflake icon with gradient',
            'leaf_switch': 'Leaf icon with gradient',
            'ant_switch': 'Ant icon with gradient',
            'brain_switch': 'Brain icon with gradient',
            'enable_animated_menu': 'Enable animations in header and footer',
            'animation_type': 'Select animation type using D-Pad left/right',
            'gif_blur': 'Add blur effect to GIF animations',
            'menu_width': 'Adjust the width of the menu',
            'light_mode': 'Change header, second header, footer and infobar colors to white',
            'imgui_integration': 'Enable ImGui menu'
        };
        const switchKey = item.dataset.switch;
        const text = item.querySelector('.switch-label')?.textContent || item.querySelector('.sub-menu-text')?.textContent;
        let description = descriptions[switchKey] || descriptions[text] || 'Select a feature to see its description';
        this.showInfoBar(description);
    }
    updateHeaderTitle(submenuIndex) {
        const mainMenuLabel = document.querySelector('.main-menu-label');
        if (!mainMenuLabel) return;
        const submenuNames = {
            0: 'Remote Server',
            1: 'Gamepad Menu',
            2: 'Theme Menu',
            3: 'Colors Menu',
            4: 'Toggle Styles Menu',
            5: 'Animation Menu',
            6: 'Configure Menu'
        };
        if (submenuIndex === null) {
            mainMenuLabel.textContent = 'Main Menu';
            mainMenuLabel.title = '';
        } else {
            const submenuName = submenuNames[submenuIndex];
            if (submenuName) {
                mainMenuLabel.textContent = submenuName;
                mainMenuLabel.title = 'Click to go back to Main Menu';
            }
        }
    }
    toggleSwitch(switchItem) {
        const statusElement = switchItem.querySelector('.switch-status');
        if (!statusElement) return;
        const currentStatus = statusElement.textContent.trim();
        const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
        statusElement.textContent = newStatus;
        this.updateSwitchVisual(statusElement, newStatus);
        switchItem.style.transform = 'scale(0.95)';
        setTimeout(() => {
            switchItem.style.transform = 'scale(1)';
        }, 100);
        const switchKey = switchItem.dataset.switch;
        if (switchKey) {
            localStorage.setItem(`switch_${switchKey}`, newStatus);
        }
        this.handleSpecialSwitch(switchKey, newStatus);
    }
    updateSwitchVisual(statusElement, status) {
        if (status === 'ON') {
            statusElement.style.setProperty('background', 'linear-gradient(90deg, var(--gradient-left) 0%, var(--gradient-right) 100%)', 'important');
            statusElement.style.setProperty('color', 'white', 'important');
            statusElement.style.setProperty('box-shadow', '0 0 10px var(--gradient-right-glow)', 'important');
        } else {
            statusElement.style.setProperty('background', 'rgba(255, 255, 255, 0.1)', 'important');
            statusElement.style.setProperty('color', '#888', 'important');
            statusElement.style.setProperty('box-shadow', 'none', 'important');
        }
    }
    handleSpecialSwitch(switchKey, status) {
        switch (switchKey) {
            case 'remote_control':
                this.showCustomNotification('Remote Control', 'Enable ESP in web browser. Server starts once per session. Changes may be noticeable after game restart. Shows IP address when enabled.', status);
                break;
            case 'controller_support':
                this.showCustomNotification('Controller Support', 'Enable gamepad detection and support', status);
                break;
            case 'light_red':
                this.showCustomNotification('Light Red', 'Sets controller light bar to red', status);
                break;
            case 'light_green':
                this.showCustomNotification('Light Green', 'Sets controller light bar to green', status);
                break;
            case 'light_blue':
                this.showCustomNotification('Light Blue', 'Sets controller light bar to blue', status);
                break;
            case 'light_yellow':
                this.showCustomNotification('Light Yellow', 'Sets controller light bar to yellow', status);
                break;
            case 'light_purple':
                this.showCustomNotification('Light Purple', 'Sets controller light bar to purple', status);
                break;
            case 'light_cyan':
                this.showCustomNotification('Light Cyan', 'Sets controller light bar to cyan', status);
                break;
            case 'light_white':
                this.showCustomNotification('Light White', 'Sets controller light bar to white', status);
                break;
            case 'rgb_cycle':
                this.showCustomNotification('RGB Cycle', 'Enables smooth RGB color cycling', status);
                break;
            case 'sky':
                this.showCustomNotification('Sky', 'Blue sky gradient theme', status);
                break;
            case 'slight_ocean_view':
                this.showCustomNotification('Slight Ocean View', 'Blue to purple gradient theme', status);
                break;
            case 'quepal':
                this.showCustomNotification('Quepal', 'Green gradient theme', status);
                break;
            case 'sublime_light':
                this.showCustomNotification('Sublime Light', 'Pink to blue gradient theme', status);
                break;
            case 'rainbow_blue':
                this.showCustomNotification('Rainbow Blue', 'Green to blue gradient theme', status);
                break;
            case 'learning_and_leading':
                this.showCustomNotification('Learning and Leading', 'Orange to yellow gradient theme', status);
                break;
            case 'pacific_dream':
                this.showCustomNotification('Pacific Dream', 'Teal to dark blue gradient theme', status);
                break;
            case 'black_rose':
                this.showCustomNotification('Black Rosé', 'Pink gradient theme', status);
                break;
            case 'ali':
                this.showCustomNotification('Ali', 'Orange to cyan gradient theme', status);
                break;
            case 'ukraine':
                this.showCustomNotification('Ukraine', 'Blue to yellow gradient theme', status);
                break;
            case 'vasily':
                this.showCustomNotification('Vasily', 'Yellow to black gradient theme', status);
                break;
            case 'red_fire':
                this.showCustomNotification('Red Fire', 'Dark red to bright red gradient theme', status);
                break;
            case 'red_color':
                this.showCustomNotification('Red Color', 'Solid red menu color', status);
                break;
            case 'green_color':
                this.showCustomNotification('Green Color', 'Solid green menu color', status);
                break;
            case 'blue_color':
                this.showCustomNotification('Blue Color', 'Solid blue menu color', status);
                break;
            case 'yellow_color':
                this.showCustomNotification('Yellow Color', 'Solid yellow menu color', status);
                break;
            case 'purple_color':
                this.showCustomNotification('Purple Color', 'Solid purple menu color', status);
                break;
            case 'cyan_color':
                this.showCustomNotification('Cyan Color', 'Solid cyan menu color', status);
                break;
            case 'white_color':
                this.showCustomNotification('White Color', 'Solid white menu color', status);
                break;
            case 'black_color':
                this.showCustomNotification('Black Color', 'Solid black menu color', status);
                break;
            case 'classic_switch':
                this.showCustomNotification('Classic Switch', 'Classic ON/OFF style', status);
                this.switchStyle = 'classic';
                document.querySelectorAll('.switch-item').forEach(item => {
                    this.applySwitchStyle(item);
                });
                localStorage.setItem('switch_style', this.switchStyle);
                break;
            case 'checkbox':
                this.showCustomNotification('Checkbox', 'Checkbox style', status);
                this.switchStyle = 'checkbox';
                document.querySelectorAll('.switch-item').forEach(item => {
                    this.applySwitchStyle(item);
                });
                localStorage.setItem('switch_style', this.switchStyle);
                break;
            case 'toggle':
                this.showCustomNotification('Toggle', 'Toggle style', status);
                this.switchStyle = 'toggle';
                document.querySelectorAll('.switch-item').forEach(item => {
                    this.applySwitchStyle(item);
                });
                localStorage.setItem('switch_style', this.switchStyle);
                break;
            case 'globe_switch':
                this.showCustomNotification('Globe Switch', 'Globe icon with gradient', status);
                this.switchStyle = 'globe';
                document.querySelectorAll('.switch-item').forEach(item => {
                    this.applySwitchStyle(item);
                });
                localStorage.setItem('switch_style', this.switchStyle);
                break;
            case 'snowflake_switch':
                this.showCustomNotification('Snowflake Switch', 'Snowflake icon with gradient', status);
                this.switchStyle = 'snowflake';
                document.querySelectorAll('.switch-item').forEach(item => {
                    this.applySwitchStyle(item);
                });
                localStorage.setItem('switch_style', this.switchStyle);
                break;
            case 'leaf_switch':
                this.showCustomNotification('Leaf Switch', 'Leaf icon with gradient', status);
                this.switchStyle = 'leaf';
                document.querySelectorAll('.switch-item').forEach(item => {
                    this.applySwitchStyle(item);
                });
                localStorage.setItem('switch_style', this.switchStyle);
                break;
            case 'ant_switch':
                this.showCustomNotification('Ant Switch', 'Ant icon with gradient', status);
                this.switchStyle = 'ant';
                document.querySelectorAll('.switch-item').forEach(item => {
                    this.applySwitchStyle(item);
                });
                localStorage.setItem('switch_style', this.switchStyle);
                break;
            case 'brain_switch':
                this.showCustomNotification('Brain Switch', 'Brain icon with gradient', status);
                this.switchStyle = 'brain';
                document.querySelectorAll('.switch-item').forEach(item => {
                    this.applySwitchStyle(item);
                });
                localStorage.setItem('switch_style', this.switchStyle);
                break;
            case 'enable_animated_menu':
                this.isAnimatedMenu = status === 'ON';
                const headerBg = document.querySelector('.menu-header .header-gif-bg');
                const footerBg = document.querySelector('.menu-footer .footer-gif-bg');
                if (headerBg) headerBg.style.display = status === 'ON' ? 'block' : 'none';
                if (footerBg) footerBg.style.display = status === 'ON' ? 'block' : 'none';
                this.showCustomNotification('Enable Animated Menu', 'Enable animations in header and footer', status);
                break;
            case 'animation_type':
                this.showCustomNotification('Animation Type', 'Select animation type using D-Pad left/right', status);
                break;
            case 'gif_blur':
                this.showCustomNotification('GIF Blur', 'Add blur effect to GIF animations', status);
                this.updateGIFBlur();
                break;
            case 'menu_width':
                this.showCustomNotification('Menu Width', 'Adjust the width of the menu', status);
                break;
            case 'light_mode':
                document.body.classList.toggle('light-mode', status === 'ON');
                this.isLightMode = status === 'ON';
                this.showCustomNotification('Light Mode', 'Change header, second header, footer and infobar colors to white', status);
                break;
            case 'imgui_integration':
                this.showCustomNotification('ImGui Integration', 'Enable ImGui menu', status);
                break;
            case 'custom_left':
                this.showCustomNotification('Custom Left', 'Customize left gradient color', status);
                break;
            case 'custom_right':
                this.showCustomNotification('Custom Right', 'Customize right gradient color', status);
                break;
            case 'custom_menu_color':
                this.showCustomNotification('Custom Menu Color', 'Customize menu color with RGB slider', status);
                break;
            default:
                const switchLabel = document.querySelector(`[data-switch="${switchKey}"] .switch-label`)?.textContent || switchKey;
                const statusText = status === 'ON' ? 'Enabled' : 'Disabled';
                this.showCustomNotification(switchLabel, `${switchLabel} has been ${statusText.toLowerCase()}`, status);
                break;
        }
    }
    showCustomNotification(functionName, description, status = 'ON') {
        const title = `GoodFeelings ⥃ ${functionName}`;
        const notification = this.createCustomNotification(title, description, status);
        this.displayCustomNotification(notification);
    }
    createCustomNotification(title, description, status) {
        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        const container = document.createElement('div');
        container.className = 'notification-container';
        const iconBar = document.createElement('div');
        iconBar.className = 'notification-icon-bar';
        const icon = document.createElement('div');
        icon.className = 'notification-icon';
        icon.style.mask = 'url("logo.png") center center / 30px 30px no-repeat';
        icon.style.webkitMask = 'url("logo.png") center center / 30px 30px no-repeat';
        icon.style.background = 'linear-gradient(135deg, var(--gradient-left) 0%, var(--gradient-right) 100%)';
        iconBar.appendChild(icon);
        const content = document.createElement('div');
        content.className = 'notification-content';
        const titleEl = document.createElement('div');
        titleEl.className = 'notification-title';
        titleEl.textContent = title;
        const statusEl = document.createElement('div');
        statusEl.className = 'notification-status';
        statusEl.textContent = status;
        statusEl.style.color = status === 'ON' ? 'var(--gradient-right)' : '#888';
        const progressLine = document.createElement('div');
        progressLine.className = 'notification-progress-line';
        const descriptionEl = document.createElement('div');
        descriptionEl.className = 'notification-description';
        descriptionEl.textContent = description;
        content.appendChild(titleEl);
        content.appendChild(statusEl);
        content.appendChild(progressLine);
        content.appendChild(descriptionEl);
        container.appendChild(iconBar);
        container.appendChild(content);
        notification.appendChild(container);
        notification.addEventListener('click', () => {
            this.hideCustomNotification(notification);
        });
        return notification;
    }
    displayCustomNotification(notification) {
        this.playNotificationSound();
        if (!this.activeNotifications) {
            this.activeNotifications = [];
        }
        if (!this.notificationQueue) {
            this.notificationQueue = [];
        }
        if (this.activeNotifications.length < 5) {
            this.showNotification(notification);
        } else {
            this.notificationQueue.push(notification);
        }
    }
    showNotification(notification) {
        this.activeNotifications.push(notification);
        const y = this.calculateNotificationY();
        notification.style.position = 'fixed';
        notification.style.right = '20px';
        notification.style.top = `${y}px`;
        notification.style.transform = `translateX(100%)`;
        document.body.appendChild(notification);
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        setTimeout(() => {
            const progressLine = notification.querySelector('.notification-progress-line');
            if (progressLine) progressLine.style.transform = 'scaleX(0.01)';
        }, 100);
        setTimeout(() => {
            this.hideCustomNotification(notification);
        }, 2500);
    }
    processNotificationQueue() {
        if (this.notificationQueue.length > 0 && this.activeNotifications.length < 5) {
            const nextNotification = this.notificationQueue.shift();
            this.showNotification(nextNotification);
        }
    }
    playNotificationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
        }
    }
    hideCustomNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            const index = this.activeNotifications.indexOf(notification);
            if (index > -1) {
                this.activeNotifications.splice(index, 1);
            }
            this.repositionCustomNotifications();
            this.processNotificationQueue();
        }, 350);
    }
    calculateNotificationY() {
        let y = baseY;
        if (this.activeNotifications) {
            for (const notification of this.activeNotifications) {
                y += notification.offsetHeight + 10;
            }
        }
        return y;
    }
    repositionCustomNotifications() {
        if (!this.activeNotifications) return;
        let currentY = baseY;
        for (const notification of this.activeNotifications) {
            notification.style.right = '20px';
            notification.style.top = `${currentY}px`;
            currentY += notification.offsetHeight + 10;
        }
    }
    loadFunctionSelectorStates() {
        const functionSelectors = {
            'animation_type': ['Anime', 'Feel Good']
        };
        for (const [switchKey, functions] of Object.entries(functionSelectors)) {
            const currentIndex = parseInt(localStorage.getItem(`function_${switchKey}`)) || 0;
            const switchItem = document.querySelector(`[data-switch="${switchKey}"]`);
            if (switchItem && switchItem.classList.contains('function-selector')) {
                const functionValue = switchItem.querySelector('.function-value');
                if (functionValue) {
                    functionValue.textContent = functions[currentIndex];
                    this.updateFunctionSelectorArrows(switchItem, currentIndex, functions.length);
                }
            }
        }
    }
    handleFunctionSelectorClick(e, switchItem) {
        const arrowLeft = e.target.closest('.arrow-left');
        const arrowRight = e.target.closest('.arrow-right');
        if (arrowLeft) {
            this.selectPreviousFunction(switchItem);
        } else if (arrowRight) {
            this.selectNextFunction(switchItem);
        }
    }
    selectNextFunction(switchItem) {
        const switchKey = switchItem.dataset.switch;
        const functions = switchItem.dataset.functions.split(',').map(f => f.trim());
        const currentIndex = parseInt(localStorage.getItem(`function_${switchKey}`)) || 0;
        if (currentIndex < functions.length - 1) {
            const nextIndex = currentIndex + 1;
            localStorage.setItem(`function_${switchKey}`, nextIndex.toString());
            const functionValue = switchItem.querySelector('.function-value');
            if (functionValue) {
                functionValue.textContent = functions[nextIndex];
                this.updateFunctionSelectorArrows(switchItem, nextIndex, functions.length);
            }
            this.showCustomNotification(switchKey.replace(/_/g, ' '), `Current: ${functions[nextIndex]}`, 'ON');
        }
    }
    selectPreviousFunction(switchItem) {
        const switchKey = switchItem.dataset.switch;
        const currentIndex = parseInt(localStorage.getItem(`function_${switchKey}`)) || 0;
        const functions = switchItem.dataset.functions.split(',').map(f => f.trim());
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            localStorage.setItem(`function_${switchKey}`, prevIndex.toString());
            const functionValue = switchItem.querySelector('.function-value');
            if (functionValue) {
                functionValue.textContent = functions[prevIndex];
                this.updateFunctionSelectorArrows(switchItem, prevIndex, functions.length);
            }
            this.showCustomNotification(switchKey.replace(/_/g, ' '), `Current: ${functions[prevIndex]}`, 'ON');
        }
    }
    updateFunctionSelectorArrows(switchItem, currentIndex, totalFunctions) {
        const arrowLeft = switchItem.querySelector('.arrow-left');
        const arrowRight = switchItem.querySelector('.arrow-right');
        if (arrowLeft) {
            arrowLeft.classList.toggle('disabled', currentIndex === 0);
        }
        if (arrowRight) {
            arrowRight.classList.toggle('disabled', currentIndex === totalFunctions - 1);
        }
    }
    updateFunctionSelectorHoverWidth(switchItem) {
        const label = switchItem.querySelector('.switch-label');
        if (!label) return;
        const tempSpan = document.createElement('span');
        tempSpan.style.cssText = `
            position: absolute;
            visibility: hidden;
            white-space: nowrap;
            font-family: inherit;
            font-size: inherit;
            font-weight: inherit;
        `;
        tempSpan.textContent = label.textContent;
        document.body.appendChild(tempSpan);
        const textWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
        const dynamicWidth = textWidth + padding;
        switchItem.style.setProperty('--hover-width', `${dynamicWidth}px`);
    }
    resetFunctionSelectorHoverWidth(switchItem) {
        switchItem.style.removeProperty('--hover-width');
    }
    updateGIFBlur() {
        const blurValue = localStorage.getItem('gif_blur') || 0;
        const gifElements = document.querySelectorAll('.header-gif-bg, .footer-gif-bg');
        gifElements.forEach(element => {
            if (blurValue > 0) {
                element.style.filter = `saturate(0) blur(${blurValue}px)`;
            } else {
                element.style.filter = `saturate(0)`;
            }
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    window.gfMenu = new GFModMenu();
});
const additionalStyles = `
.info-tooltip {
    position: fixed;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 10px;
    border-radius: 5px;
    font-size: 12px;
    max-width: 200px;
    z-index: 10000;
    pointer-events: none;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
}
.info-tooltip.show {
    opacity: 1;
    transform: translateY(0);
}
.tooltip-header {
    font-weight: 600;
    margin-bottom: 5px;
    color: #4ECDC4;
}
.tooltip-content {
    line-height: 1.4;
}
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 500;
    z-index: 10000;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
}
.notification.show {
    opacity: 1;
    transform: translateX(0);
}
body.mobile .menu {
    width: 90vw;
    max-width: 300px;
}
body.mobile .content-scroll-view {
    width: 90vw;
    max-width: 315px;
}
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet); 
