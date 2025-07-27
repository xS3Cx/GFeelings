/*

TemplateMo 594 nexus flow

https://templatemo.com/tm-594-nexus-flow

*/

// JavaScript Document

// Mobile device detection and performance optimization
function isMobileDevice() {
    return window.innerWidth <= 768 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Debounce function to prevent multiple rapid clicks
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization for mobile devices
function optimizeForMobile() {
    if (isMobileDevice()) {
        // Disable heavy animations
        document.body.classList.add('mobile-optimized');
        
        // Reduce audio quality on mobile
        const audio = document.getElementById('backgroundAudio');
        if (audio) {
            audio.volume = 0.1; // Lower volume on mobile
        }
        
        // Disable autoplay on mobile to save battery
        if (audio && audio.autoplay) {
            audio.removeAttribute('autoplay');
        }
    }
}

// Audio Background Management
function initializeVideoBackground() {
    const audio = document.getElementById('backgroundAudio');
    if (!audio) return;

    // Set volume to 20%
    audio.volume = 0.2;

    // Try to start playing immediately
    audio.play().then(() => {
        console.log('Audio started playing automatically');
    }).catch(error => {
        console.log('Autoplay blocked, waiting for user interaction');
        // If autoplay is blocked, start on first user interaction
        document.addEventListener('click', function() {
            if (audio.paused) {
                audio.play().then(() => {
                    console.log('Audio started playing after user interaction');
                }).catch(error => {
                    console.error('Error playing audio:', error);
                });
            }
        }, { once: true });
    });

    // Ensure audio loads properly
    audio.addEventListener('load', function() {
        console.log('Audio loaded successfully');
    });

    audio.addEventListener('error', function() {
        console.error('Failed to load audio');
    });
}

// Slow down GIF animation using canvas with real frame control
function slowDownGif() {
    const gifUrl = 'https://i.pinimg.com/originals/37/6e/f8/376ef85c22039b9470aa24a7855851fe.gif';
    
    // Create a new image to load the GIF
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = function() {
        // Create canvas for cyber-bg
        const cyberBg = document.querySelector('.cyber-bg');
        if (cyberBg) {
            const canvas1 = document.createElement('canvas');
            const ctx1 = canvas1.getContext('2d');
            canvas1.width = window.innerWidth;
            canvas1.height = window.innerHeight;
            
            let lastTime1 = 0;
            const frameDelay1 = 5000; // 5 seconds between frames (very slow)
            
            function animate1(currentTime) {
                if (currentTime - lastTime1 > frameDelay1) {
                    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
                    ctx1.drawImage(img, 0, 0, canvas1.width, canvas1.height);
                    lastTime1 = currentTime;
                }
                requestAnimationFrame(animate1);
            }
            
            cyberBg.appendChild(canvas1);
            requestAnimationFrame(animate1);
        }
        
        // Create canvas for cyber-gradient
        const cyberGradient = document.querySelector('.cyber-gradient');
        if (cyberGradient) {
            const canvas2 = document.createElement('canvas');
            const ctx2 = canvas2.getContext('2d');
            canvas2.width = window.innerWidth;
            canvas2.height = window.innerHeight;
            
            let lastTime2 = 0;
            const frameDelay2 = 8000; // 8 seconds between frames (even slower)
            
            function animate2(currentTime) {
                if (currentTime - lastTime2 > frameDelay2) {
                    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
                    ctx2.drawImage(img, 0, 0, canvas2.width, canvas2.height);
                    lastTime2 = currentTime;
                }
                requestAnimationFrame(animate2);
            }
            
            cyberGradient.appendChild(canvas2);
            requestAnimationFrame(animate2);
        }
    };
    
    img.src = gifUrl;
}

// Initialize mobile menu functionality
        function initializeMobileMenu() {
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
            const mobileMenuClose = document.getElementById('mobileMenuClose');
            const mobileMenuLinks = document.querySelectorAll('.mobile-menu-nav a');
            const mobileMenuCta = document.querySelector('.mobile-menu-cta');
            const mobileMenuCtaButton = document.querySelector('.mobile-menu-cta a');
            const mobileMenuLogo = document.querySelector('.mobile-menu-logo');

            // Check if essential elements exist
            if (!mobileMenuBtn || !mobileMenu || !mobileMenuOverlay || !mobileMenuClose) {
                return;
            }

            function openMobileMenu() {
                mobileMenuBtn.classList.add('active');
                mobileMenu.classList.add('active');
                mobileMenuOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Reset and trigger animations for links
                mobileMenuLinks.forEach((link, index) => {
                    if (link) {
                        link.style.animation = 'none';
                        link.style.opacity = '0';
                        link.style.transform = 'translateX(20px)';
                        
                        // Apply animation with delay
                        setTimeout(() => {
                            if (link) {
                                link.style.animation = `slideInLeft 0.4s ease forwards`;
                            }
                        }, 250 + (index * 100));
                    }
                });
                
                // Animate CTA button
                if (mobileMenuCta) {
                    mobileMenuCta.style.animation = 'none';
                    mobileMenuCta.style.opacity = '0';
                    mobileMenuCta.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        if (mobileMenuCta) {
                            mobileMenuCta.style.animation = 'slideInUp 0.4s ease forwards';
                        }
                    }, 100);
                }
            }

            function closeMobileMenu() {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }

            // Toggle mobile menu
            mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (mobileMenu.classList.contains('active')) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }
            });

            // Close mobile menu
            mobileMenuClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeMobileMenu();
            });
            
            mobileMenuOverlay.addEventListener('click', (e) => {
                e.stopPropagation();
                closeMobileMenu();
            });

            // Close menu when clicking on navigation links
            mobileMenuLinks.forEach(link => {
                if (link) {
                    link.addEventListener('click', () => {
                        closeMobileMenu();
                    });
                }
            });

            // Close menu when clicking on CTA button
            if (mobileMenuCtaButton) {
                mobileMenuCtaButton.addEventListener('click', (e) => {
                    if (mobileMenuCtaButton.getAttribute('href') === '#') {
                        e.preventDefault();
                    }
                    closeMobileMenu();
                });
            }

            // Close menu when clicking on logo
            if (mobileMenuLogo) {
                mobileMenuLogo.addEventListener('click', () => {
                    closeMobileMenu();
                });
            }

            // Close mobile menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            });

            // Prevent body scroll when menu is open
            if (mobileMenu) {
                mobileMenu.addEventListener('touchmove', (e) => {
                    e.stopPropagation();
                });
            }
        }

        // Initialize mobile menu when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                // Optimize for mobile devices first
                optimizeForMobile();
                
                initializeMobileMenu();
                initializeVideoBackground();
                initializeReposSection();
                // slowDownGif(); // Disabled to keep GIF background visible
            });
        } else {
            // Optimize for mobile devices first
            optimizeForMobile();
            
            initializeMobileMenu();
            initializeVideoBackground();
            initializeReposSection();
            // slowDownGif(); // Disabled to keep GIF background visible
        }

        // Generate Matrix Rain Effect (disabled on mobile for performance)
        function generateMatrixRain() {
            // Skip on mobile devices for better performance
            if (window.innerWidth <= 768) {
                return;
            }
            
            const matrixRain = document.getElementById('matrixRain');
            const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
            const columns = Math.floor(window.innerWidth / 20);
            
            for (let i = 0; i < columns; i++) {
                const column = document.createElement('div');
                column.className = 'matrix-column';
                column.style.left = `${i * 20}px`;
                column.style.animationDuration = `${Math.random() * 5 + 10}s`;
                column.style.animationDelay = `${Math.random() * 5}s`;
                
                // Generate random characters for the column
                let text = '';
                const charCount = Math.floor(Math.random() * 20 + 10);
                for (let j = 0; j < charCount; j++) {
                    text += characters[Math.floor(Math.random() * characters.length)] + ' ';
                }
                column.textContent = text;
                
                matrixRain.appendChild(column);
            }
        }

        // Generate Floating Particles (disabled on mobile for performance)
        function generateParticles() {
            // Skip on mobile devices for better performance
            if (window.innerWidth <= 768) {
                return;
            }
            
            const particlesContainer = document.getElementById('particlesContainer');
            const particleCount = window.innerWidth <= 1024 ? 25 : 50; // Reduce on tablets
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 20}s`;
                particle.style.animationDuration = `${Math.random() * 10 + 20}s`;
                
                particlesContainer.appendChild(particle);
            }
        }

        // Generate Data Streams (disabled on mobile for performance)
        function generateDataStreams() {
            // Skip on mobile devices for better performance
            if (window.innerWidth <= 768) {
                return;
            }
            
            const dataStreams = document.getElementById('dataStreams');
            const streamCount = window.innerWidth <= 1024 ? 5 : 10; // Reduce on tablets
            
            for (let i = 0; i < streamCount; i++) {
                const stream = document.createElement('div');
                stream.className = 'data-stream';
                stream.style.top = `${Math.random() * 100}%`;
                stream.style.left = `-300px`;
                stream.style.animationDelay = `${Math.random() * 5}s`;
                stream.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
                
                dataStreams.appendChild(stream);
            }
        }

        // Initialize background effects (with mobile optimization)
        // Only generate effects on desktop for better performance
        if (window.innerWidth > 768) {
            generateMatrixRain();
            generateParticles();
            generateDataStreams();
        }

        // Regenerate matrix rain on window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const matrixRain = document.getElementById('matrixRain');
                matrixRain.innerHTML = '';
                generateMatrixRain();
            }, 250);
        });

        // Interactive mouse glow effect (disabled on mobile for performance)
        let mouseTimer;
        document.addEventListener('mousemove', (e) => {
            // Skip on mobile devices for better performance
            if (window.innerWidth <= 768) {
                return;
            }
            
            if (!mouseTimer) {
                mouseTimer = setTimeout(() => {
                    const mouseX = e.clientX;
                    const mouseY = e.clientY;
                    
                    // Move orbs slightly based on mouse position
                    const orbs = document.querySelectorAll('.orb');
                    orbs.forEach((orb, index) => {
                        const speed = (index + 1) * 0.02;
                        const x = (mouseX - window.innerWidth / 2) * speed;
                        const y = (mouseY - window.innerHeight / 2) * speed;
                        orb.style.transform = `translate(${x}px, ${y}px)`;
                    });
                    
                    // Make nearby particles glow brighter (desktop only)
                    if (window.innerWidth > 768) {
                        const particles = document.querySelectorAll('.particle');
                        particles.forEach(particle => {
                            const rect = particle.getBoundingClientRect();
                            const particleX = rect.left + rect.width / 2;
                            const particleY = rect.top + rect.height / 2;
                            const distance = Math.sqrt(Math.pow(mouseX - particleX, 2) + Math.pow(mouseY - particleY, 2));
                            
                            if (distance < 150) {
                                const brightness = 1 - (distance / 150);
                                particle.style.boxShadow = `0 0 ${20 + brightness * 30}px rgba(0, 255, 255, ${0.5 + brightness * 0.5})`;
                                particle.style.transform = `scale(${1 + brightness * 0.5})`;
                            } else {
                                particle.style.boxShadow = '';
                                particle.style.transform = '';
                            }
                        });
                    }
                    
                    mouseTimer = null;
                }, 16); // ~60fps
            }
        });



        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                // Only prevent default and scroll if href is more than just '#'
                if (href && href.length > 1) {
                    e.preventDefault();
                    if (href === '#top') {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    } else {
                        const target = document.querySelector(href);
                        if (target) {
                            target.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    }
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('nav');
            if (window.scrollY > 100) {
                nav.style.background = '#000000';
                nav.style.boxShadow = 'none';
            } else {
                nav.style.background = '#000000';
                nav.style.boxShadow = 'none';
            }
        });

        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-up').forEach(el => {
            observer.observe(el);
        });

        // Button effects
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.boxShadow = '0 0 30px rgba(185, 147, 214, 0.6)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.boxShadow = '';
            });
        });

        // Stats counter animation
        const animateStats = () => {
            const stats = document.querySelectorAll('.stat-number');
            stats.forEach(stat => {
                const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
                let count = 0;
                const increment = target / 100;
                const timer = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        clearInterval(timer);
                        count = target;
                    }
                    const suffix = stat.textContent.replace(/[\d]/g, '');
                    stat.textContent = Math.floor(count) + suffix;
                }, 20);
            });
        };

        // Trigger stats animation when section is visible
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }

        // Glitch effect on hover for feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.animation = 'glitch1 0.3s ease-in-out';
                setTimeout(() => {
                    this.style.animation = '';
                }, 300);
            });
        });



        // Contact form submission
        document.querySelector('.btn-submit').addEventListener('click', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (name && email && message) {
                // Simulate form submission
                this.textContent = 'TRANSMITTING...';
                this.style.background = 'linear-gradient(135deg, var(--primary-cyan), var(--primary-pink))';
                
                setTimeout(() => {
                    this.textContent = 'TRANSMISSION COMPLETE';
                    this.style.background = 'var(--primary-cyan)';
                    
                    // Clear form
                    document.getElementById('name').value = '';
                    document.getElementById('email').value = '';
                    document.getElementById('message').value = '';
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        this.textContent = 'Transmit Message';
                        this.style.background = '';
                    }, 3000);
                }, 2000);
            }
        });

        // GitHub Repositories Section Functionality
        function initializeReposSection() {
            console.log('Initializing repos section...');
            const heroContent = document.getElementById('heroContent');
                    const repositoriesSection = document.getElementById('repositoriesSection');
        const tweaksSection = document.getElementById('tweaksSection');
        const moddingToolsSection = document.getElementById('moddingToolsSection');
            const reposBtn = document.getElementById('reposBtn');
            const mobileReposBtn = document.getElementById('mobileReposBtn');
                    const tweaksBtn = document.getElementById('tweaksBtn');
        const mobileTweaksBtn = document.getElementById('mobileTweaksBtn');
        const moddingToolsBtn = document.getElementById('moddingToolsBtn');
        const mobileModdingToolsBtn = document.getElementById('mobileModdingToolsBtn');
        const modsBtn = document.getElementById('modsBtn');
        const mobileModsBtn = document.getElementById('mobileModsBtn');
        const backBtn = document.getElementById('backToHome');
        const backBtnFromTweaks = document.getElementById('backToHomeFromTweaks');
                const backBtnFromModdingTools = document.getElementById('backToHomeFromModdingTools');
        const modsSection = document.getElementById('modsSection');
        const backBtnFromMods = document.getElementById('backToHomeFromMods');
        const ourModsBtn = document.getElementById('ourModsBtn');
        const thirdPartyBtn = document.getElementById('thirdPartyBtn');
        const ourModsContent = document.getElementById('ourModsContent');
        const thirdPartyContent = document.getElementById('thirdPartyContent');
        const sourcesSection = document.getElementById('sourcesSection');
        const backBtnFromSources = document.getElementById('backToHomeFromSources');
        const sourceCodeBtn = document.getElementById('sourceCodeBtn');
        const menusBtn = document.getElementById('menusBtn');
        const sourceCodeContent = document.getElementById('sourceCodeContent');
        const menusContent = document.getElementById('menusContent');
        const reposList = document.getElementById('reposList');
            const loadingSpinner = document.getElementById('reposLoading');
            const filterButtons = document.querySelectorAll('.filter-btn');
            const tweaksFilterButtons = document.querySelectorAll('#tweaksSection .filter-btn');

            console.log('Section elements:', { heroContent, repositoriesSection, reposBtn, mobileReposBtn, backBtn, reposList, loadingSpinner });

            let allRepos = []; // Store all repositories
            let currentFilter = 'all'; // Current active filter
            let currentTweaksFilter = 'all'; // Current active tweaks filter

            // Show repositories function (optimized for mobile)
            function showRepositories() {
                console.log('Showing repositories...');
                
                // Optimize for mobile - reduce animation time
                const animationTime = isMobileDevice() ? 100 : 300;
                
                // Animate hero content out
                heroContent.classList.add('hide');
                
                setTimeout(() => {
                    // Batch DOM operations for better performance
                    const sectionsToHide = [heroContent, tweaksSection, moddingToolsSection, modsSection, sourcesSection];
                    sectionsToHide.forEach(section => {
                        if (section) section.style.display = 'none';
                    });
                    
                    repositoriesSection.style.display = 'block';
                    repositoriesSection.classList.remove('hide');
                    loadRepositories();
                }, animationTime);
            }

            // Show home function (optimized for mobile)
            function showHome() {
                // Optimize for mobile - reduce animation time
                const animationTime = isMobileDevice() ? 100 : 300;
                
                // Batch add hide classes
                const sectionsToHide = [repositoriesSection, tweaksSection, moddingToolsSection, modsSection, sourcesSection];
                sectionsToHide.forEach(section => {
                    if (section) section.classList.add('hide');
                });
                
                setTimeout(() => {
                    // Batch DOM operations for better performance
                    sectionsToHide.forEach(section => {
                        if (section) section.style.display = 'none';
                    });
                    
                    heroContent.style.display = 'block';
                    heroContent.classList.remove('hide');
                    
                    if (reposList) reposList.style.display = 'none';
                    if (loadingSpinner) loadingSpinner.style.display = 'flex';
                }, animationTime);
            }

            // Show tweaks function (optimized for mobile)
        function showTweaks() {
            console.log('Showing tweaks...');
            
            // Optimize for mobile - reduce animation time
            const animationTime = isMobileDevice() ? 100 : 300;
            
            // Animate hero content out
            heroContent.classList.add('hide');
            
            setTimeout(() => {
                // Batch DOM operations for better performance
                const sectionsToHide = [heroContent, repositoriesSection, moddingToolsSection, modsSection, sourcesSection];
                sectionsToHide.forEach(section => {
                    if (section) section.style.display = 'none';
                });
                
                tweaksSection.style.display = 'block';
                tweaksSection.classList.remove('hide');
            }, animationTime);
        }

        function showModdingTools() {
            console.log('Showing modding tools...');
            
            // Optimize for mobile - reduce animation time
            const animationTime = isMobileDevice() ? 100 : 300;
            
            // Animate hero content out
            heroContent.classList.add('hide');
            
            setTimeout(() => {
                // Batch DOM operations for better performance
                const sectionsToHide = [heroContent, repositoriesSection, tweaksSection, modsSection, sourcesSection];
                sectionsToHide.forEach(section => {
                    if (section) section.style.display = 'none';
                });
                
                moddingToolsSection.style.display = 'block';
                moddingToolsSection.classList.remove('hide');
            }, animationTime);
        }

        function showMods() {
            console.log('Showing mods...');
            
            // Optimize for mobile - reduce animation time
            const animationTime = isMobileDevice() ? 100 : 300;
            
            // Animate hero content out
            heroContent.classList.add('hide');
            
            setTimeout(() => {
                // Batch DOM operations for better performance
                const sectionsToHide = [heroContent, repositoriesSection, tweaksSection, moddingToolsSection, sourcesSection];
                sectionsToHide.forEach(section => {
                    if (section) section.style.display = 'none';
                });
                
                modsSection.style.display = 'block';
                modsSection.classList.remove('hide');
            }, animationTime);
        }

        function showSources() {
            console.log('Showing sources...');
            
            // Optimize for mobile - reduce animation time
            const animationTime = isMobileDevice() ? 100 : 300;
            
            // Animate hero content out
            heroContent.classList.add('hide');
            
            setTimeout(() => {
                // Batch DOM operations for better performance
                const sectionsToHide = [heroContent, repositoriesSection, tweaksSection, moddingToolsSection, modsSection];
                sectionsToHide.forEach(section => {
                    if (section) section.style.display = 'none';
                });
                
                sourcesSection.style.display = 'block';
                sourcesSection.classList.remove('hide');
            }, animationTime);
        }

            // Filter repositories based on current filter
            function filterRepositories() {
                let filteredRepos = [];
                
                switch(currentFilter) {
                    case 'all':
                        filteredRepos = allRepos;
                        break;
                    case 'forks':
                        filteredRepos = allRepos.filter(repo => repo.fork === true);
                        break;
                    case 'me':
                        filteredRepos = allRepos.filter(repo => repo.fork === false);
                        break;
                    default:
                        filteredRepos = allRepos;
                }
                
                displayRepositories(filteredRepos);
            }

            // Update active filter button
            function updateActiveFilter(activeButton) {
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                activeButton.classList.add('active');
            }

            // Filter tweaks based on current filter
            function filterTweaks() {
                const tweakCards = document.querySelectorAll('#tweaksSection .tweak-card');
                
                tweakCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (currentTweaksFilter === 'all' || category === currentTweaksFilter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }

            // Update active tweaks filter button
            function updateActiveTweaksFilter(activeButton) {
                tweaksFilterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                activeButton.classList.add('active');
            }

            // Load repositories from GitHub API (optimized)
            async function loadRepositories() {
                try {
                    // Show loading immediately
                    if (loadingSpinner) loadingSpinner.style.display = 'flex';
                    if (reposList) reposList.style.display = 'none';
                    
                    // Add timeout for mobile devices
                    const timeout = isMobileDevice() ? 10000 : 15000;
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), timeout);
                    
                    const response = await fetch('https://api.github.com/users/xS3Cx/repos?sort=updated&per_page=50', {
                        signal: controller.signal
                    });
                    
                    clearTimeout(timeoutId);
                    const repos = await response.json();

                    if (response.ok) {
                        allRepos = repos; // Store all repositories
                        filterRepositories(); // Apply current filter
                    } else {
                        throw new Error('Failed to fetch repositories');
                    }
                } catch (error) {
                    console.error('Error loading repositories:', error);
                    if (error.name === 'AbortError') {
                        displayError('Request timed out. Please check your connection and try again.');
                    } else {
                        displayError('Failed to load repositories. Please try again later.');
                    }
                }
            }

            // Display repositories in the modal (optimized for mobile)
            function displayRepositories(repos) {
                if (loadingSpinner) loadingSpinner.style.display = 'none';
                if (reposList) reposList.style.display = 'grid';

                if (repos.length === 0) {
                    reposList.innerHTML = `
                        <div style="text-align: center; color: var(--text-primary); padding: 40px; grid-column: 1 / -1;">
                            <p style="color: var(--primary-pink); font-size: 18px; margin-bottom: 10px;">📁 No repositories found</p>
                            <p>No repositories match the current filter.</p>
                        </div>
                    `;
                    return;
                }

                // Optimize animation delay for mobile
                const animationDelay = isMobileDevice() ? 0.05 : 0.1;
                
                // Use DocumentFragment for better performance
                const fragment = document.createDocumentFragment();
                
                repos.forEach((repo, index) => {
                    const repoCard = document.createElement('div');
                    repoCard.className = 'repo-card';
                    repoCard.style.animationDelay = `${(index + 1) * animationDelay}s`;
                    
                    repoCard.innerHTML = `
                        <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
                        <p class="repo-description">${repo.description || 'No description available'}</p>
                        <div class="repo-meta">
                            ${repo.language ? `<span class="repo-language">${repo.language}</span>` : ''}
                            <div class="repo-stats">
                                <div class="repo-stat">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    ${repo.stargazers_count}
                                </div>
                                <div class="repo-stat">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                    ${repo.forks_count}
                                </div>
                            </div>
                        </div>
                    `;
                    
                    fragment.appendChild(repoCard);
                });
                
                reposList.innerHTML = '';
                reposList.appendChild(fragment);
            }

            // Display error message
            function displayError(message) {
                loadingSpinner.style.display = 'none';
                reposList.style.display = 'block';
                reposList.innerHTML = `
                    <div style="text-align: center; color: var(--text-primary); padding: 40px;">
                        <p style="color: var(--primary-pink); font-size: 18px; margin-bottom: 10px;">⚠️ Error</p>
                        <p>${message}</p>
                    </div>
                `;
            }

            // Event listeners (optimized with debounce)
            if (reposBtn) {
                console.log('Adding click listener to reposBtn');
                const debouncedShowRepos = debounce(showRepositories, 300);
                reposBtn.addEventListener('click', function(e) {
                    console.log('Repos button clicked!');
                    e.preventDefault();
                    debouncedShowRepos();
                });
            }

            if (mobileReposBtn) {
                const debouncedShowRepos = debounce(showRepositories, 300);
                mobileReposBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    debouncedShowRepos();
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobileMenu');
                    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenuBtn.classList.remove('active');
                        mobileMenu.classList.remove('active');
                        mobileMenuOverlay.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            }

            if (backBtn) {
                backBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    showHome();
                });
            }

            if (backBtnFromTweaks) {
                backBtnFromTweaks.addEventListener('click', function(e) {
                    e.preventDefault();
                    showHome();
                });
            }

            if (backBtnFromModdingTools) {
                backBtnFromModdingTools.addEventListener('click', function(e) {
                    e.preventDefault();
                    showHome();
                });
            }

            if (backBtnFromMods) {
                backBtnFromMods.addEventListener('click', function(e) {
                    e.preventDefault();
                    showHome();
                });
            }

            if (backBtnFromSources) {
                backBtnFromSources.addEventListener('click', function(e) {
                    e.preventDefault();
                    showHome();
                });
            }

            // Add event listeners for filter buttons
            filterButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const filter = this.getAttribute('data-filter');
                    currentFilter = filter;
                    updateActiveFilter(this);
                    filterRepositories();
                });
            });

            // Add event listeners for tweaks filter buttons
            tweaksFilterButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const filter = this.getAttribute('data-filter');
                    currentTweaksFilter = filter;
                    updateActiveTweaksFilter(this);
                    filterTweaks();
                });
            });

            // Add event listeners for tweaks buttons (optimized)
            if (tweaksBtn) {
                const debouncedShowTweaks = debounce(showTweaks, 300);
                tweaksBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    debouncedShowTweaks();
                });
            }

            if (mobileTweaksBtn) {
                const debouncedShowTweaks = debounce(showTweaks, 300);
                mobileTweaksBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    debouncedShowTweaks();
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobileMenu');
                    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenuBtn.classList.remove('active');
                        mobileMenu.classList.remove('active');
                        mobileMenuOverlay.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            }

            // Add event listeners for modding tools buttons (optimized)
            if (moddingToolsBtn) {
                const debouncedShowModdingTools = debounce(showModdingTools, 300);
                moddingToolsBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    debouncedShowModdingTools();
                });
            }

            if (mobileModdingToolsBtn) {
                const debouncedShowModdingTools = debounce(showModdingTools, 300);
                mobileModdingToolsBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    debouncedShowModdingTools();
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobileMenu');
                    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenuBtn.classList.remove('active');
                        mobileMenu.classList.remove('active');
                        mobileMenuOverlay.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            }

            // Add event listeners for mods buttons (optimized)
            if (modsBtn) {
                const debouncedShowMods = debounce(showMods, 300);
                modsBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    debouncedShowMods();
                });
            }

            if (mobileModsBtn) {
                const debouncedShowMods = debounce(showMods, 300);
                mobileModsBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    debouncedShowMods();
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobileMenu');
                    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenuBtn.classList.remove('active');
                        mobileMenu.classList.remove('active');
                        mobileMenuOverlay.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            }

            // Add event listeners for sources buttons (optimized)
            const sourcesBtn = document.getElementById('sourcesBtn');
            const mobileSourcesBtn = document.getElementById('mobileSourcesBtn');
            
            if (sourcesBtn) {
                const debouncedShowSources = debounce(showSources, 300);
                sourcesBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    debouncedShowSources();
                });
            }

            if (mobileSourcesBtn) {
                const debouncedShowSources = debounce(showSources, 300);
                mobileSourcesBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    debouncedShowSources();
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobileMenu');
                    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenuBtn.classList.remove('active');
                        mobileMenu.classList.remove('active');
                        mobileMenuOverlay.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            }

            // Add event listeners for mods content buttons
            if (ourModsBtn) {
                ourModsBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    showOurMods();
                });
            }

            if (thirdPartyBtn) {
                thirdPartyBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    showThirdParty();
                });
            }

            // Function to show Our Mods content
            function showOurMods() {
                ourModsBtn.classList.add('active');
                thirdPartyBtn.classList.remove('active');
                ourModsContent.style.display = 'block';
                thirdPartyContent.style.display = 'none';
            }

            // Function to show 3rd Party content
            function showThirdParty() {
                thirdPartyBtn.classList.add('active');
                ourModsBtn.classList.remove('active');
                thirdPartyContent.style.display = 'block';
                ourModsContent.style.display = 'none';
            }

            // Add event listeners for sources content buttons
            if (sourceCodeBtn) {
                sourceCodeBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    showSourceCode();
                });
            }

            if (menusBtn) {
                menusBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    showMenus();
                });
            }

            // Function to show Source Code content
            function showSourceCode() {
                sourceCodeBtn.classList.add('active');
                menusBtn.classList.remove('active');
                sourceCodeContent.style.display = 'block';
                menusContent.style.display = 'none';
            }

            // Function to show Menus content
            function showMenus() {
                menusBtn.classList.add('active');
                sourceCodeBtn.classList.remove('active');
                menusContent.style.display = 'block';
                sourceCodeContent.style.display = 'none';
            }

            // Go back with Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && (repositoriesSection.style.display === 'block' || tweaksSection.style.display === 'block' || moddingToolsSection.style.display === 'block' || modsSection.style.display === 'block' || sourcesSection.style.display === 'block')) {
                    showHome();
                }
            });
        }