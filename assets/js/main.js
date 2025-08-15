// Global variables for Feature Slider
let currentFeatureSlide = 0;
let totalFeatureSlides = 0;
let featureSliderTrack, featureSlides, featureDots, featurePrevBtn, featureNextBtn;

// State management
let isShowingSliders = false;

// Main DOM Content Loaded - All functionality in one place
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== FEATURE SLIDER FUNCTIONALITY =====
    
    // Force blur effect to be applied immediately
    const sliderContainers = document.querySelectorAll('.slider-container');
    sliderContainers.forEach(container => {
        // Force a reflow to ensure backdrop-filter is applied
        container.style.transform = 'translateZ(0)';
        container.offsetHeight; // Force reflow
        container.style.transform = '';
    });
    
    // Pre-load blur effect by forcing it on the preload element
    const blurPreload = document.querySelector('.blur-preload');
    if (blurPreload) {
        // Force blur effect to be loaded
        blurPreload.style.transform = 'translateZ(0)';
        blurPreload.offsetHeight; // Force reflow
        blurPreload.style.transform = '';
        
        // Also force it on slider containers even when hidden
        sliderContainers.forEach(container => {
            container.style.visibility = 'visible';
            container.style.opacity = '1';
            container.style.backdropFilter = 'blur(15px)';
            container.style.webkitBackdropFilter = 'blur(15px)';
            container.offsetHeight; // Force reflow
        });
    }
    
    // Initialize feature slider elements
    featureSliderTrack = document.getElementById('featureSliderTrack');
    featureSlides = document.querySelectorAll('.feature-slide');
    featureDots = document.querySelectorAll('.feature-dot');
    featurePrevBtn = document.getElementById('featurePrevBtn');
    featureNextBtn = document.getElementById('featureNextBtn');
    
    totalFeatureSlides = featureSlides.length;
    
    // Initialize feature slider
    initFeatureSlider();
    
    // Ensure proper initial state
    setTimeout(() => {
        if (typeof updateFeatureSlider === 'function') {
            updateFeatureSlider();
            updateFeatureDots();
        }
    }, 100);
    
    // Feature Slider Functions
    function initFeatureSlider() {
        if (totalFeatureSlides === 0) return;
        
        const slideWidth = 100 / totalFeatureSlides;
        featureSlides.forEach(slide => {
            slide.style.width = `${slideWidth}%`;
        });
        
        updateFeatureSlider();
        updateFeatureDots();
    }
    
    function updateFeatureSlider() {
        if (totalFeatureSlides === 0) return;
        
        const slideWidth = featureSlides[0].offsetWidth;
        featureSliderTrack.style.transform = `translateX(-${currentFeatureSlide * slideWidth}px)`;
        
        // Update active slide class
        featureSlides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentFeatureSlide);
        });
        
        // Update slider track width
        featureSliderTrack.style.width = `${totalFeatureSlides * 100}%`;
    }
    
    function updateFeatureDots() {
        featureDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentFeatureSlide);
        });
    }
    
    function nextFeatureSlide() {
        currentFeatureSlide = (currentFeatureSlide + 1) % totalFeatureSlides;
        updateFeatureSlider();
        updateFeatureDots();
        setTimeout(checkControllerSlide, 500);
    }
    
    function prevFeatureSlide() {
        currentFeatureSlide = (currentFeatureSlide - 1 + totalFeatureSlides) % totalFeatureSlides;
        updateFeatureSlider();
        updateFeatureDots();
        setTimeout(checkControllerSlide, 500);
    }
    
    function goToFeatureSlide(slideIndex) {
        currentFeatureSlide = slideIndex;
        updateFeatureSlider();
        updateFeatureDots();
        setTimeout(checkControllerSlide, 500);
    }
    
    // Event listeners for Feature Slider
    if (featureNextBtn) {
        featureNextBtn.addEventListener('click', nextFeatureSlide);
    }
    
    if (featurePrevBtn) {
        featurePrevBtn.addEventListener('click', prevFeatureSlide);
    }
    
    // Dot navigation for Feature Slider
    featureDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToFeatureSlide(index));
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            nextFeatureSlide();
        } else if (e.key === 'ArrowLeft') {
            prevFeatureSlide();
        }
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left
                nextFeatureSlide();
            } else {
                // Swipe right
                prevFeatureSlide();
            }
        }
    }
    
    // Add touch events to feature slider
    if (featureSliderTrack) {
        featureSliderTrack.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        featureSliderTrack.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        updateFeatureSlider();
    });
    
    // Controller image animation
    let controllerAnimationInterval;
    
    function startControllerAnimation() {
        const image1 = document.querySelector('.controller-image[data-image="1"]');
        const image2 = document.querySelector('.controller-image[data-image="2"]');
        if (!image1 || !image2) return;
        
        // Initialize images
        image1.style.visibility = 'visible';
        image2.style.visibility = 'hidden';
        image1.classList.remove('fade-out');
        image1.classList.add('fade-in');
        image2.classList.remove('fade-in');
        image2.classList.add('fade-out');
        
        controllerAnimationInterval = setInterval(() => {
            // Switch images with fade animation
            if (image1.style.visibility === 'visible') {
                // Fade out image1, fade in image2
                image1.style.visibility = 'hidden';
                image1.classList.remove('fade-in');
                image1.classList.add('fade-out');
                
                setTimeout(() => {
                    image2.style.visibility = 'visible';
                    image2.classList.remove('fade-out');
                    image2.classList.add('fade-in');
                }, 200);
            } else {
                // Fade out image2, fade in image1
                image2.style.visibility = 'hidden';
                image2.classList.remove('fade-in');
                image2.classList.add('fade-out');
                
                setTimeout(() => {
                    image1.style.visibility = 'visible';
                    image1.classList.remove('fade-out');
                    image1.classList.add('fade-in');
                }, 200);
            }
        }, 4000); // Switch every 4 seconds
    }
    
    function stopControllerAnimation() {
        if (controllerAnimationInterval) {
            clearInterval(controllerAnimationInterval);
            controllerAnimationInterval = null;
        }
        
        // Reset images to initial state
        const image1 = document.querySelector('.controller-image[data-image="1"]');
        const image2 = document.querySelector('.controller-image[data-image="2"]');
        if (image1 && image2) {
            image1.style.visibility = 'visible';
            image2.style.visibility = 'hidden';
            image1.classList.remove('fade-out');
            image1.classList.add('fade-in');
            image2.classList.remove('fade-in');
            image2.classList.add('fade-out');
        }
    }
    
    // Start animation when controller slide is active
    function checkControllerSlide() {
        if (currentFeatureSlide === 1) { // Controller slide is slide 2 (index 1)
            startControllerAnimation();
        } else {
            stopControllerAnimation();
        }
    }
    
    // Check on initial load
    setTimeout(checkControllerSlide, 1000);
    
    // ===== HERO NAVIGATION BUTTONS FUNCTIONALITY =====
    
    // Get all buttons from hero section
    const discoverBtn = document.getElementById('discoverBtn');
    const liveDemoBtn = document.getElementById('liveDemoBtn');
    const supportedGamesBtn = document.getElementById('supportedGamesBtn');
    const heroSection = document.getElementById('heroSection');
    const modsSection = document.getElementById('modsSection');
    
    // Discover button functionality
    if (discoverBtn) {
        discoverBtn.addEventListener('click', function() {
            isShowingSliders = !isShowingSliders;
            
            if (isShowingSliders) {
                // Animate hero section out
                if (heroSection) {
                    heroSection.classList.remove('fade-in');
                    heroSection.classList.add('fade-out');
                    setTimeout(() => {
                        heroSection.style.visibility = 'hidden';
                    }, 600);
                }
                
                // Show and animate mods section in
                if (modsSection) {
                    modsSection.style.visibility = 'visible';
                    // Immediately show slider containers with blur effect
                    const sliderContainers = document.querySelectorAll('.slider-container');
                    sliderContainers.forEach(container => {
                        container.style.visibility = 'visible';
                        container.style.opacity = '1';
                        // Force blur effect immediately
                        container.style.backdropFilter = 'blur(15px)';
                        container.style.webkitBackdropFilter = 'blur(15px)';
                        container.style.transform = 'translateZ(0)';
                        container.offsetHeight; // Force reflow
                    });
                    setTimeout(() => {
                        modsSection.classList.add('fade-in');
                    }, 50);
                }
                
                // Ensure sliders are properly initialized
                setTimeout(() => {
                    if (typeof updateFeatureSlider === 'function') {
                        updateFeatureSlider();
                        updateFeatureDots();
                    }
                    
                    // Force blur effect to be applied after sliders are visible
                    const sliderContainers = document.querySelectorAll('.slider-container');
                    sliderContainers.forEach(container => {
                        // Force a reflow to ensure backdrop-filter is applied
                        container.style.transform = 'translateZ(0)';
                        container.offsetHeight; // Force reflow
                        container.style.transform = '';
                        // Ensure blur is immediately visible
                        container.style.backdropFilter = 'blur(15px)';
                        container.style.webkitBackdropFilter = 'blur(15px)';
                    });
                }, 100);
                
                // Reset feature slider to first slide
                currentFeatureSlide = 0;
                setTimeout(() => {
                    if (typeof updateFeatureSlider === 'function') {
                        updateFeatureSlider();
                        updateFeatureDots();
                    }
                }, 100);
            } else {
                // Animate mods section out
                if (modsSection) {
                    modsSection.classList.remove('fade-in');
                    setTimeout(() => {
                        modsSection.style.visibility = 'hidden';
                    }, 600);
                }
                
                // Show and animate hero section in
                if (heroSection) {
                    heroSection.style.visibility = 'visible';
                    heroSection.classList.remove('fade-out');
                    setTimeout(() => {
                        heroSection.classList.add('fade-in');
                    }, 50);
                }
            }
        });
    }
    
    // Live Demo button functionality
    if (liveDemoBtn) {
        liveDemoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Redirect to Live Demo page
            window.location.href = 'LiveDemo/index.html';
        });
    }
    
    // Supported Games button functionality - does nothing
    if (supportedGamesBtn) {
        supportedGamesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Do nothing - button is disabled
        });
    }
    
    // ===== TOP LOGO FUNCTIONALITY =====
    
    const topLogoLink = document.getElementById('topLogo');
    
    // Function to return to main screen
    function returnToMainScreen() {
        
        // Hide mods section (sliders)
        const modsSection = document.getElementById('modsSection');
        if (modsSection) {
            modsSection.classList.remove('fade-in');
            modsSection.classList.add('fade-out');
            setTimeout(() => {
                modsSection.style.visibility = 'hidden';
            }, 300);
        }
        
        // Show hero section
        const heroSection = document.getElementById('heroSection');
        if (heroSection) {
            heroSection.style.visibility = 'visible';
            heroSection.classList.remove('fade-out');
            heroSection.classList.add('fade-in');
        }
        
        // Reset sliders to initial state
        isShowingSliders = false;
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Top logo link functionality
    if (topLogoLink) {
        topLogoLink.addEventListener('click', function(e) {
            e.preventDefault();
            returnToMainScreen();
        });
    }
});

// Make functions globally accessible
window.updateFeatureSlider = function() {
    if (totalFeatureSlides === 0) return;
    
    const slideWidth = featureSlides[0].offsetWidth;
    featureSliderTrack.style.transform = `translateX(-${currentFeatureSlide * slideWidth}px)`;
    
    // Update active slide class
    featureSlides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentFeatureSlide);
    });
    
    // Update slider track width
    featureSliderTrack.style.width = `${totalFeatureSlides * 100}%`;
};

window.updateFeatureDots = function() {
    featureDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentFeatureSlide);
    });
};
