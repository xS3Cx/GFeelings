// GF Mod Menu JavaScript
class GFModMenu {
    constructor() {
        this.isMenuVisible = false;
        this.currentSubmenu = null;
        this.selectedIndex = 0;
        this.switchStyle = 'classic'; // classic, checkbox, toggle, globe, snowflake, leaf, ant, brain
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
        
        // Menu starts hidden
        const menu = document.getElementById('mainMenu');
        if (menu) {
            menu.classList.remove('visible');
        }
        
        // Initialize counter and selection indicator
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
        // Use the demo-animation.gif file directly
        const themeUrl = 'demo-animation.gif';
        
        // Set CSS variable
        document.documentElement.style.setProperty('--animated-theme', `url('${themeUrl}') repeat`);
        
        // Also set directly on header and footer elements
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
        
        
        // Get menu width from the .menu element (not .menu-container)
        const menu = document.querySelector('.menu');
        const menuWidth = menu ? menu.offsetWidth : 300;
        
        
        // Create info bar dynamically
        const infoBar = document.createElement('div');
        infoBar.id = 'infoBar';
        infoBar.className = 'info-bar';
        infoBar.style.cssText = `
            position: absolute;
            width: 300px;
            min-height: 30px;
            background: linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(20, 20, 20, 0.9) 100%);
            backdrop-filter: blur(10px);
            border: none;
            outline: none;
            display: flex;
            align-items: center;
            padding: 5px 15px;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            z-index: 9999;
            pointer-events: none;
        `;

        // Create info icon
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
        
        // Apply left gradient color to the icon
        infoIcon.style.setProperty('--icon-color', 'var(--gradient-left)');
        
        // Set filter to match new left gradient color (#016fff)
        infoIcon.style.filter = 'brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(10000%) hue-rotate(210deg) brightness(100%) contrast(100%)';

        // Create info text
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
        
        
        // Update position after creation
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
        
        
        
        
        
        // Position info bar exactly like footer - same position and width
        const top = footerRect ? footerRect.bottom + 15 : menuRect.bottom + 15;
        const left = menuRect.left;
        
        this.infoBar.style.top = `${top}px`;
        this.infoBar.style.left = `${left}px`;
        this.infoBar.style.width = `${this.menuWidth}px`;
        
        
    }

    setupMenuButtonDrag(menuButton) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        // Load saved position
        const savedLeft = localStorage.getItem('menuButtonLeft');
        const savedTop = localStorage.getItem('menuButtonTop');
        
        if (savedLeft && savedTop) {
            menuButton.style.left = savedLeft;
            menuButton.style.top = savedTop;
        }
        
        menuButton.addEventListener('mousedown', (e) => {
            // Don't start drag on right click
            if (e.button !== 0) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(menuButton.style.left) || 20;
            startTop = parseInt(menuButton.style.top) || 20;
            
            menuButton.style.cursor = 'grabbing';
            menuButton.style.userSelect = 'none';
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;
            
            // Keep button within screen bounds
            const buttonWidth = menuButton.offsetWidth;
            const buttonHeight = menuButton.offsetHeight;
            const maxLeft = window.innerWidth - buttonWidth - 20;
            const maxTop = window.innerHeight - buttonHeight - 20;
            
            newLeft = Math.max(20, Math.min(newLeft, maxLeft));
            newTop = Math.max(20, Math.min(newTop, maxTop));
            
            menuButton.style.left = `${newLeft}px`;
            menuButton.style.top = `${newTop}px`;
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                menuButton.style.cursor = 'pointer';
                menuButton.style.userSelect = 'auto';
                
                // Save position
                localStorage.setItem('menuButtonLeft', menuButton.style.left);
                localStorage.setItem('menuButtonTop', menuButton.style.top);
            }
        });
        
        // Handle touch events for mobile
        menuButton.addEventListener('touchstart', (e) => {
            isDragging = true;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startLeft = parseInt(menuButton.style.left) || 20;
            startTop = parseInt(menuButton.style.top) || 20;
            
            menuButton.style.cursor = 'grabbing';
            menuButton.style.userSelect = 'none';
            
            e.preventDefault();
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;
            
            // Keep button within screen bounds
            const buttonWidth = menuButton.offsetWidth;
            const buttonHeight = menuButton.offsetHeight;
            const maxLeft = window.innerWidth - buttonWidth - 20;
            const maxTop = window.innerHeight - buttonHeight - 20;
            
            newLeft = Math.max(20, Math.min(newLeft, maxLeft));
            newTop = Math.max(20, Math.min(newTop, maxTop));
            
            menuButton.style.left = `${newLeft}px`;
            menuButton.style.top = `${newTop}px`;
            
            e.preventDefault();
        });
        
        document.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                menuButton.style.cursor = 'pointer';
                menuButton.style.userSelect = 'auto';
                
                // Save position
                localStorage.setItem('menuButtonLeft', menuButton.style.left);
                localStorage.setItem('menuButtonTop', menuButton.style.top);
            }
        });
    }

    bindEvents() {
        // Menu button toggle and drag functionality
        const menuButton = document.getElementById('menuButton');
        
        menuButton.addEventListener('click', () => {
            this.toggleMenu();
        });
        
        // Add drag functionality to menu button
        this.setupMenuButtonDrag(menuButton);
        
        // Add click event for main menu label to go back
        const mainMenuLabel = document.querySelector('.main-menu-label');
        if (mainMenuLabel) {
            mainMenuLabel.addEventListener('click', () => {
                if (this.currentSubmenu !== null) {
                    this.goBack();
                }
            });
        }

        // Back button
        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.goBack();
            });
        }

        // Submenu navigation
        document.querySelectorAll('.sub-menu-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                if (this.isMenuVisible) {
                    this.openSubmenu(index);
                }
            });
            
            // Add hover events for info bar and selection indicator
            item.addEventListener('mouseenter', () => {
                if (this.isMenuVisible) {
                    this.updateInfoBarForItem(item);
                    this.updateSubMenuHoverWidth(item);
                    this.updateSelectionIndicatorForHover(item);
                    // Show hover effect only on this item
                    item.style.setProperty('--hover-opacity', '1');
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (this.isMenuVisible) {
                    this.hideInfoBar();
                    this.resetSubMenuHoverWidth(item);
                    this.resetSelectionIndicator();
                    // Hide hover effect
                    item.style.removeProperty('--hover-opacity');
                }
            });
        });

        // Theme toggle button
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                if (this.isMenuVisible) {
                    this.toggleTheme();
                }
            });
            
            // Add hover events for theme toggle button
            themeToggleBtn.addEventListener('mouseenter', () => {
                if (this.isMenuVisible) {
                    this.updateInfoBarForItem(themeToggleBtn);
                    this.updateSubMenuHoverWidth(themeToggleBtn);
                    this.updateSelectionIndicatorForHover(themeToggleBtn);
                    themeToggleBtn.style.setProperty('--hover-opacity', '1');
                }
            });
            
            themeToggleBtn.addEventListener('mouseleave', () => {
                if (this.isMenuVisible) {
                    this.hideInfoBar();
                    this.resetSubMenuHoverWidth(themeToggleBtn);
                    this.resetSelectionIndicator();
                    themeToggleBtn.style.removeProperty('--hover-opacity');
                }
            });
        }

        // Switch interactions
        document.querySelectorAll('.switch-item').forEach(switchItem => {
            this.setupSwitchEvents(switchItem);
            
            // Add hover events for info bar and selection indicator
            switchItem.addEventListener('mouseenter', () => {
                if (this.isMenuVisible) {
                    this.updateInfoBarForItem(switchItem);
                    this.updateSwitchHoverWidth(switchItem);
                    this.updateSelectionIndicatorForHover(switchItem);
                    // Show hover effect only on this item
                    switchItem.style.setProperty('--hover-opacity', '1');
                }
            });
            
            switchItem.addEventListener('mouseleave', () => {
                if (this.isMenuVisible) {
                    this.hideInfoBar();
                    this.resetSwitchHoverWidth(switchItem);
                    this.resetSelectionIndicator();
                    // Hide hover effect
                    switchItem.style.removeProperty('--hover-opacity');
                }
            });
        });
        
        // Setup hover events for submenu switches (for switches that exist in DOM)
        this.setupSubmenuHoverEvents();

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });

        // Update info bar position when window resizes or menu moves
        window.addEventListener('resize', () => {
            this.updateInfoBarPosition();
        });

        // Update info bar position when menu visibility changes
        const observer = new MutationObserver(() => {
            this.updateInfoBarPosition();
        });
        
        if (menu) {
            observer.observe(menu, {
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }
        


        // Window resize
        window.addEventListener('resize', () => {
            this.updateLayout();
            this.updateInfoBarPosition();
        });
    }

    setupSwitchEvents(switchItem) {
        const switchType = switchItem.className.split(' ')[1]; // offset-switch, slider-switch, etc.
        
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
        
        // Load saved state
        const savedState = localStorage.getItem(switchKey);
        if (savedState === 'true') {
            this.toggleSwitch(switchItem, true);
        }

        switchItem.addEventListener('click', () => {
            const isOn = switchItem.classList.contains('on');
            this.toggleSwitch(switchItem, !isOn);
            localStorage.setItem(switchKey, (!isOn).toString());
            
            // Play sound effect
            this.playSound('switch');
        });

        // Add info tooltip on long press
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
        
        // Load saved value
        const savedValue = localStorage.getItem(switchKey);
        if (savedValue) {
            slider.value = savedValue;
            valueElement.textContent = savedValue;
        } else {
            // Use default value from HTML
            const defaultValue = slider.value || slider.min || 0;
            valueElement.textContent = defaultValue;
        }
        
        // Update slider gradient with current value
        this.updateSliderGradient(slider, slider.value, switchKey);
        
        // Setup event listeners for slider
        this.setupSliderEventListeners(slider, switchKey, switchItem);
        
        
    }

    setupSliderEventListeners(slider, switchKey, switchItem) {
        const valueElement = switchItem.querySelector('.switch-value');
        
        // Update gradient on input (while dragging)
        slider.addEventListener('input', (e) => {
            
            const value = e.target.value;
            valueElement.textContent = value;
            localStorage.setItem(switchKey, value);
            
            // Update slider gradient
            this.updateSliderGradient(slider, value, switchKey);
            
            // Update menu width if this is the menu width slider
            if (switchKey === 'menu_width') {
                this.updateMenuWidth(parseInt(value));
            } else if (switchKey === 'gif_blur') {
                this.updateGIFBlur();
            }
        });

        // Also update gradient on change (after dragging)
        slider.addEventListener('change', (e) => {
            const value = e.target.value;
            this.updateSliderGradient(slider, value, switchKey);
        });

        // Update gradient on mousemove for smooth updates
        slider.addEventListener('mousemove', (e) => {
            const value = e.target.value;
            this.updateSliderGradient(slider, value, switchKey);
        });

        // Update gradient on touchmove for mobile
        slider.addEventListener('touchmove', (e) => {
            const value = e.target.value;
            this.updateSliderGradient(slider, value, switchKey);
        });

        // Update gradient on mouseover for continuous updates
        slider.addEventListener('mouseover', (e) => {
            const value = e.target.value;
            this.updateSliderGradient(slider, value, switchKey);
        });

        // Update gradient on mouseenter for continuous updates
        slider.addEventListener('mouseenter', (e) => {
            const value = e.target.value;
            this.updateSliderGradient(slider, value, switchKey);
        });

        // Add visual feedback
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
        
        
        
        // Get or create gradient background element
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
        
        // Make sure gradient background covers the full width
        gradientBg.style.width = '100%';

        // Get or create gray overlay element
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
        
        // Update gray overlay position and width (from left side of thumb to right)
        const offset = 5; // 5% offset to the left
        const adjustedPercentage = Math.max(0, percentage - offset);
        grayOverlay.style.left = `${adjustedPercentage}%`;
        grayOverlay.style.width = `${100 - adjustedPercentage}%`;
        
        
        // Check if this is an RGB slider
        if (switchKey === 'custom_left' || switchKey === 'custom_right' || switchKey === 'custom_menu_color') {
            // For RGB sliders, use hue-based gradient
            const hue = (percentage / 100) * 360;
            const color = `hsl(${hue}, 100%, 50%)`;
            // Full gradient
            gradientBg.style.background = `linear-gradient(90deg, ${color} 0%, ${color} 100%)`;
            
        } else {
            // For regular sliders, use theme gradient
            const leftColor = getComputedStyle(document.documentElement).getPropertyValue('--gradient-left').trim();
            const rightColor = getComputedStyle(document.documentElement).getPropertyValue('--gradient-right').trim();
            // Full gradient
            gradientBg.style.background = `linear-gradient(90deg, ${leftColor} 0%, ${rightColor} 100%)`;
            
        }
    }

    initializeSliderGradients() {
        
        // Initialize gradients for all existing sliders
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
        
        // Load saved value
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

        // Toggle switch state
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
            
            // Visual feedback
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

        // Apply switch style
        this.applySwitchStyle(switchItem);
    }

    applySwitchStyle(switchItem) {
        // Remove all switch style classes
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

        // Add current switch style
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
            this.hideInfoBar(); // Hide info bar when menu closes
            this.resetScrollIndicatorWidth(); // Reset scroll indicator width
        } else {
            menu.classList.add('visible');
            this.isMenuVisible = true;
            // Update counter and selection indicator when menu becomes visible
            this.updateSelectionIndicator();
            this.updateCounter();
            // Re-setup hover events for main menu items
            this.setupMainMenuHoverEvents();
            // Update info bar position when menu becomes visible (like GFInterface)
            setTimeout(() => {
                this.updateInfoBarPosition();
            }, 100);
        }
    }

    toggleTheme() {
        const body = document.body;
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        
        if (this.isLightMode) {
            // Switch to dark mode
            body.classList.remove('light-mode');
            this.isLightMode = false;
            if (themeToggleBtn) {
                themeToggleBtn.querySelector('.sub-menu-text').textContent = '🌙 Light Mode';
            }
            
        } else {
            // Switch to light mode
            body.classList.add('light-mode');
            this.isLightMode = true;
            if (themeToggleBtn) {
                themeToggleBtn.querySelector('.sub-menu-text').textContent = '☀️ Dark Mode';
            }
            
        }
        
        // Save theme preference
        localStorage.setItem('gfTheme', this.isLightMode ? 'light' : 'dark');
    }

    openSubmenu(index) {
        const mainScrollView = document.getElementById('mainScrollView');
        
        if (!mainScrollView) return;
        
        
        
        // Clear main scroll view
        mainScrollView.innerHTML = '';
        
        // Show submenu content in the same scroll view
        const targetSubmenu = document.querySelector(`.submenu-content[data-submenu="${index}"]`);
        if (targetSubmenu) {
            // Clone the submenu content and append to main scroll view
            const clonedContent = targetSubmenu.cloneNode(true);
            clonedContent.classList.add('active');
            clonedContent.style.display = 'block';
            mainScrollView.appendChild(clonedContent);
            
        }
        
        this.currentSubmenu = index;
        this.selectedIndex = 0;
        
        // Update header title
        this.updateHeaderTitle(index);
        
        // Keep the same indicator (no need to switch)
        this.updateSelectionIndicator();
        this.updateCounter();
        
        // Add hover events for switch items in submenu
        this.setupSubmenuHoverEvents();
        
        // Update info bar position for submenu (like GFInterface)
        setTimeout(() => {
            this.updateInfoBarPosition();
        }, 50);
    }

    goBack() {
        const mainScrollView = document.getElementById('mainScrollView');
        
        if (!mainScrollView) return;
        
        // Clear main scroll view
        mainScrollView.innerHTML = '';
        
        // Restore original main menu items
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
        
        // Reset header title to "Main Menu"
        this.updateHeaderTitle(null);
        
        // Re-add event listeners for main menu items
        this.setupMainMenuHoverEvents();
        
        // Re-add click event listeners for sub-menu items
        document.querySelectorAll('.sub-menu-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.openSubmenu(index);
            });
        });
        
        this.updateSelectionIndicator();
        this.updateCounter();
        this.hideInfoBar(); // Hide info bar when going back
        this.resetScrollIndicatorWidth(); // Reset scroll indicator width
        
        // Update info bar position for main menu (like GFInterface)
        setTimeout(() => {
            this.updateInfoBarPosition();
        }, 50);
    }

    updateSelectionIndicator() {
        const items = this.currentSubmenu !== null 
            ? document.querySelectorAll('.submenu-content.active .switch-item')
            : document.querySelectorAll('.sub-menu-item');
        
        // Reset all indicators
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
        
        // Reset all indicators first
        document.querySelectorAll('.sub-menu-item, .switch-item').forEach(item => {
            item.style.setProperty('--indicator-opacity', '0');
        });
        
        // Show indicator on hovered item
        hoveredItem.style.setProperty('--indicator-opacity', '1');
    }

    resetSelectionIndicator() {
        // Reset all indicators
        document.querySelectorAll('.sub-menu-item, .switch-item').forEach(item => {
            item.style.setProperty('--indicator-opacity', '0');
        });
        
        // Only show keyboard selection if not hovering
        if (!document.querySelector('.sub-menu-item:hover, .switch-item:hover')) {
            this.updateSelectionIndicator();
        }
    }

    setupSubmenuHoverEvents() {
        
        // Add hover events for switch items in the active submenu
        const activeSubmenu = document.querySelector('.submenu-content.active');
        if (!activeSubmenu) {
            
            return;
        }
        
        const switchItems = activeSubmenu.querySelectorAll('.switch-item');
        
        switchItems.forEach((switchItem, index) => {
            // Initialize slider gradients for this submenu
            const slider = switchItem.querySelector('.slider-input');
            if (slider) {
                const switchKey = switchItem.dataset.switch;
                const value = slider.value || slider.min || 0;
                this.updateSliderGradient(slider, value, switchKey);
                
                // Add event listeners for slider
                this.setupSliderEventListeners(slider, switchKey, switchItem);
            }
            
            // Add hover events for selection indicator and info bar
            switchItem.addEventListener('mouseenter', () => {
                
                this.updateInfoBarForItem(switchItem);
                this.updateSelectionIndicatorForHover(switchItem);
                
                // Update hover width based on switch type
                if (switchItem.classList.contains('function-selector')) {
                    this.updateFunctionSelectorHoverWidth(switchItem);
                } else {
                    this.updateSwitchHoverWidth(switchItem);
                }
                
                switchItem.style.setProperty('--hover-opacity', '1');
                // Update counter for hovered item
                this.updateCounterForHover(index);
            });
            
            switchItem.addEventListener('mousemove', (e) => {
                this.updateSelectionIndicatorForHover(switchItem);
            });
            
            switchItem.addEventListener('mouseleave', () => {
                this.hideInfoBar();
                this.resetSelectionIndicator();
                
                // Reset hover width based on switch type
                if (switchItem.classList.contains('function-selector')) {
                    this.resetFunctionSelectorHoverWidth(switchItem);
                } else {
                    this.resetSwitchHoverWidth(switchItem);
                }
                
                switchItem.style.removeProperty('--hover-opacity');
                // Reset counter to keyboard selection
                this.updateCounter();
            });
            
            // Add click event for switch toggle
            switchItem.addEventListener('click', (e) => {
                // Don't toggle if clicking on slider
                if (e.target.closest('.slider-input')) {
                    return;
                }
                
                // Handle function selector clicks
                if (switchItem.classList.contains('function-selector')) {
                    this.handleFunctionSelectorClick(e, switchItem);
                    return;
                }
                
                this.toggleSwitch(switchItem);
            });
        });
        
        // Add mousemove event to scrollview for continuous hover updates
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
        // Add hover events for main menu items
        const mainMenuItems = document.querySelectorAll('.sub-menu-item');
        mainMenuItems.forEach((subMenuItem, index) => {
            // Add hover events for selection indicator and info bar
            subMenuItem.addEventListener('mouseenter', () => {
                if (this.isMenuVisible) {
                    this.updateInfoBarForItem(subMenuItem);
                    this.updateSelectionIndicatorForHover(subMenuItem);
                    this.updateSubMenuHoverWidth(subMenuItem);
                    subMenuItem.style.setProperty('--hover-opacity', '1');
                    // Update counter for hovered item
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
                    // Reset counter to keyboard selection
                    this.updateCounter();
                }
            });
        });
        
        // Add mousemove event to scrollview for continuous hover updates
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
            // Update indicator position when scrolling
            this.updateSelectionIndicator();
            
            // Update hover indicator if mouse is over an item
            const hoveredItem = document.querySelector('.sub-menu-item:hover, .switch-item:hover');
            if (hoveredItem) {
                this.updateSelectionIndicatorForHover(hoveredItem);
            }
        });
        
        // Initial scrollbar update
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
        // Handle global keyboard shortcuts
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
        
        // Apply to all switches
        document.querySelectorAll('.switch-item').forEach(switchItem => {
            this.applySwitchStyle(switchItem);
        });
        
        localStorage.setItem('switch_style', this.switchStyle);
    }

    updateMenuWidth(width) {
        this.menuWidth = width;
        const menu = document.querySelector('.menu'); // Use same selector as updateInfoBarPosition
        const contentView = document.getElementById('contentScrollView');
        
        if (menu) {
            menu.style.width = `${width}px`;
        }
        if (contentView) {
            contentView.style.width = `${width + 15}px`;
        }
        
        // Update info bar width and position after menu width change
        if (this.infoBar) {
            this.infoBar.style.width = `${width}px`;
            // Update position after menu has been updated
            setTimeout(() => {
                this.updateInfoBarPosition();
            }, 10);
        }
        
        localStorage.setItem('menu_width', width.toString());
    }

    loadSettings() {
        // Load saved settings
        this.isLightMode = localStorage.getItem('gfTheme') === 'light';
        this.switchStyle = localStorage.getItem('switch_style') || 'classic';
        this.isAnimatedMenu = localStorage.getItem('animated_menu') !== 'false';
        this.menuWidth = parseInt(localStorage.getItem('menu_width')) || 300;
        
        // Apply settings
        document.body.classList.toggle('light-mode', this.isLightMode);
        this.updateMenuWidth(this.menuWidth);
        
        // Update theme toggle button text
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        if (themeToggleBtn) {
            if (this.isLightMode) {
                themeToggleBtn.querySelector('.sub-menu-text').textContent = '☀️ Dark Mode';
            } else {
                themeToggleBtn.querySelector('.sub-menu-text').textContent = '🌙 Light Mode';
            }
        }
        
        // Set default ON states for switches that should be ON by default
        if (!localStorage.getItem('switch_enable_animated_menu')) {
            localStorage.setItem('switch_enable_animated_menu', 'ON');
        }
        if (!localStorage.getItem('switch_controller_support')) {
            localStorage.setItem('switch_controller_support', 'ON');
        }
        
        // Apply switch styles and load saved states
        document.querySelectorAll('.switch-item').forEach(switchItem => {
            this.applySwitchStyle(switchItem);
            this.loadSwitchState(switchItem);
        });
        
        // Load function selector states
        this.loadFunctionSelectorStates();
        
        // Load GIF blur state
        this.updateGIFBlur();
    }

    loadSwitchState(switchItem) {
        const switchKey = switchItem.dataset.switch;
        if (!switchKey) return;
        
        const savedStatus = localStorage.getItem(`switch_${switchKey}`);
        const statusElement = switchItem.querySelector('.switch-status');
        if (statusElement) {
            // Use saved status or default to what's in HTML
            const finalStatus = savedStatus || statusElement.textContent.trim();
            statusElement.textContent = finalStatus;
            this.updateSwitchVisual(statusElement, finalStatus);
            
            // Add 'on' class if switch is ON
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
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'info-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-header">${switchItem.querySelector('.switch-label').textContent}</div>
            <div class="tooltip-content">${description}</div>
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = switchItem.getBoundingClientRect();
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.bottom + 5}px`;
        
        // Remove after 3 seconds
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
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after 2 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    playSound(type) {
        // Create audio context for sound effects
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
        // Handle responsive layout updates
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }

    // Info Bar Functions
    showInfoBar(text) {
        
        
        if (this.infoBar && this.infoText) {
            this.infoText.textContent = text;
            // Update info bar position before showing (like GFInterface)
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
        
        // Create a temporary span to measure actual text width
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
        
        // Get the actual text width
        const textWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
        
        // Add padding for better visual appearance
        const padding = 20; // 10px on each side
        const dynamicWidth = textWidth + padding;
        
        // Apply dynamic width to the pseudo-element
        switchItem.style.setProperty('--hover-width', `${dynamicWidth}px`);
    }

    resetSwitchHoverWidth(switchItem) {
        // Reset hover width
        switchItem.style.removeProperty('--hover-width');
    }

    updateSubMenuHoverWidth(subMenuItem) {
        const text = subMenuItem.querySelector('.sub-menu-text');
        if (!text) return;
        
        // Create a temporary span to measure actual text width
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
        
        // Get the actual text width
        const textWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
        
        // Add padding for better visual appearance
        const padding = 20; // 10px on each side
        const dynamicWidth = textWidth + padding;
        
        // Apply dynamic width to the pseudo-element
        subMenuItem.style.setProperty('--hover-width', `${dynamicWidth}px`);
    }

    resetSubMenuHoverWidth(subMenuItem) {
        // Reset hover width
        subMenuItem.style.removeProperty('--hover-width');
    }

    updateSwitchHoverWidth(switchItem) {
        const text = switchItem.querySelector('.switch-label');
        if (!text) return;
        
        // Create a temporary span to measure actual text width
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
        
        // Get the actual text width
        const textWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
        
        // Add padding for better visual appearance
        const padding = 20; // 10px on each side
        const dynamicWidth = textWidth + padding;
        
        // Apply dynamic width to the pseudo-element
        switchItem.style.setProperty('--hover-width', `${dynamicWidth}px`);
    }

    resetSwitchHoverWidth(switchItem) {
        // Reset hover width
        switchItem.style.removeProperty('--hover-width');
    }

    updateInfoBarForItem(item) {
        
        const descriptions = {
            // Main menu items
            'Remote Server': 'Navigate to Remote Server settings and configurations',
            'Gamepad Menu': 'Navigate to Gamepad settings and light bar controls',
            'Theme Menu': 'Navigate to Theme selection and customization',
            'Colors Menu': 'Navigate to Color selection and customization',
            'Toggle Styles Menu': 'Navigate to Toggle style selection',
            'Animation Menu': 'Navigate to Animation settings and controls',
            'Configure Menu': 'Navigate to Menu configuration and settings',
            
            // Remote Server submenu
            'remote_control': 'Enable ESP in web browser. Server starts once per session.',
            
            // Gamepad Menu submenu
            'controller_support': 'Enable gamepad detection and support',
            'light_red': 'Sets controller light bar to red',
            'light_green': 'Sets controller light bar to green',
            'light_blue': 'Sets controller light bar to blue',
            'light_yellow': 'Sets controller light bar to yellow',
            'light_purple': 'Sets controller light bar to purple',
            'light_cyan': 'Sets controller light bar to cyan',
            'light_white': 'Sets controller light bar to white',
            'rgb_cycle': 'Enables smooth RGB color cycling',
            
            // Theme Menu submenu
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
            
            // Colors Menu submenu
            'red_color': 'Solid red menu color',
            'green_color': 'Solid green menu color',
            'blue_color': 'Solid blue menu color',
            'yellow_color': 'Solid yellow menu color',
            'purple_color': 'Solid purple menu color',
            'cyan_color': 'Solid cyan menu color',
            'white_color': 'Solid white menu color',
            'black_color': 'Solid black menu color',
            'custom_menu_color': 'Customize menu color with RGB slider',
            
            // Toggle Styles Menu submenu
            'classic_switch': 'Classic ON/OFF style',
            'checkbox': 'Checkbox style',
            'toggle': 'Toggle style',
            'globe_switch': 'Globe icon with gradient',
            'snowflake_switch': 'Snowflake icon with gradient',
            'leaf_switch': 'Leaf icon with gradient',
            'ant_switch': 'Ant icon with gradient',
            'brain_switch': 'Brain icon with gradient',
            
            // Animation Menu submenu
            'enable_animated_menu': 'Enable animations in header and footer',
            'animation_type': 'Select animation type using D-Pad left/right',
            'gif_blur': 'Add blur effect to GIF animations',
            
            // Configure Menu submenu
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
        
        // Update the status text
        statusElement.textContent = newStatus;
        
        // Update visual styling based on status
        this.updateSwitchVisual(statusElement, newStatus);
        
        // Add visual feedback
        switchItem.style.transform = 'scale(0.95)';
        setTimeout(() => {
            switchItem.style.transform = 'scale(1)';
        }, 100);
        
        // Save to localStorage
        const switchKey = switchItem.dataset.switch;
        if (switchKey) {
            localStorage.setItem(`switch_${switchKey}`, newStatus);
        }
        
        // Handle special switches
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
                // Toggle animated background
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
                // Update GIF blur effect
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
                // Show notification for regular switches
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
        
        // Add click to dismiss
        notification.addEventListener('click', () => {
            this.hideCustomNotification(notification);
        });
        
        return notification;
    }

    displayCustomNotification(notification) {
        // Play notification sound (simulated)
        this.playNotificationSound();
        
        // Add to active notifications array
        if (!this.activeNotifications) {
            this.activeNotifications = [];
        }
        this.activeNotifications.push(notification);
        
        // Calculate position relative to menu
        const menu = document.querySelector('.menu');
        const menuRect = menu ? menu.getBoundingClientRect() : null;
        
        if (menuRect) {
            const x = menuRect.right + 16; // 16px gap from menu
            const y = this.calculateNotificationY();
            
            notification.style.position = 'fixed';
            notification.style.left = `${x}px`;
            notification.style.top = `${y}px`;
            notification.style.transform = `translateX(100%)`;
        } else {
            // Fallback to right side of screen
            notification.style.top = `${this.calculateNotificationY()}px`;
            notification.style.transform = `translateX(100%)`;
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Animate progress line
        setTimeout(() => {
            const progressLine = notification.querySelector('.notification-progress-line');
            if (progressLine) progressLine.style.transform = 'scaleX(0.01)';
        }, 100);
        
        // Auto hide after 2.5 seconds
        setTimeout(() => {
            this.hideCustomNotification(notification);
        }, 2500);
    }

    playNotificationSound() {
        // Create a simple notification sound using Web Audio API
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
            // Fallback: silent notification
            
        }
    }

    hideCustomNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            // Remove from active notifications
            const index = this.activeNotifications.indexOf(notification);
            if (index > -1) {
                this.activeNotifications.splice(index, 1);
            }
            
            // Reposition remaining notifications
            this.repositionCustomNotifications();
        }, 350);
    }

    calculateNotificationY() {
        const menu = document.querySelector('.menu');
        if (!menu) return 20;
        
        const menuRect = menu.getBoundingClientRect();
        const baseY = menuRect.top; // Start from same position as menu header
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
        
        const menu = document.querySelector('.menu');
        const menuRect = menu ? menu.getBoundingClientRect() : null;
        
        if (menuRect) {
            const x = menuRect.right + 16;
            const baseY = menuRect.top; // Start from same height as menu header
            let currentY = baseY;
            
            for (const notification of this.activeNotifications) {
                notification.style.left = `${x}px`;
                notification.style.top = `${currentY}px`;
                currentY += notification.offsetHeight + 10;
            }
        } else {
            // Fallback to right side of screen
            const baseY = 20;
            let currentY = baseY;
            
            for (const notification of this.activeNotifications) {
                notification.style.top = `${currentY}px`;
                currentY += notification.offsetHeight + 10;
            }
        }
    }



    loadFunctionSelectorStates() {
        // Load function selector states
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
            
            // Show notification
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
            
            // Show notification
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
        
        // Create a temporary span to measure actual text width
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
        
        // Get the actual text width
        const textWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
        
        // Add padding for better visual appearance
        const padding = 20; // 10px on each side
        const dynamicWidth = textWidth + padding;
        
        // Apply dynamic width to the pseudo-element
        switchItem.style.setProperty('--hover-width', `${dynamicWidth}px`);
    }

    resetFunctionSelectorHoverWidth(switchItem) {
        // Reset hover width
        switchItem.style.removeProperty('--hover-width');
    }

    updateGIFBlur() {
        const blurValue = localStorage.getItem('gif_blur') || 0;
        const gifElements = document.querySelectorAll('.header-gif-bg, .footer-gif-bg');
        
        gifElements.forEach(element => {
            // Combine saturate(0) with blur - preserve saturation while adding blur
            if (blurValue > 0) {
                element.style.filter = `saturate(0) blur(${blurValue}px)`;
            } else {
                element.style.filter = `saturate(0)`;
            }
        });
        
        
    }
}

// Initialize the menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gfMenu = new GFModMenu();
});

// Add CSS for tooltips and notifications
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

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet); 
