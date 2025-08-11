// Global variables for Feature Slider
let currentFeatureSlide = 0;
let totalFeatureSlides = 0;
let featureSliderTrack, featureSlides, featureDots, featurePrevBtn, featureNextBtn;

// Global variables for Game Slider
let currentGameSlide = 0;
let totalGameSlides = 0;
let gameSliderTrack, gameSlides, gameDots, gamePrevBtn, gameNextBtn;

// State management
let isShowingGames = false;
window.isShowingGames = isShowingGames;

// Feature Slider functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize feature slider elements
    featureSliderTrack = document.getElementById('featureSliderTrack');
    featureSlides = document.querySelectorAll('.feature-slide');
    featureDots = document.querySelectorAll('.feature-dot');
    featurePrevBtn = document.getElementById('featurePrevBtn');
    featureNextBtn = document.getElementById('featureNextBtn');
    
    totalFeatureSlides = featureSlides.length;
    
    // Initialize game slider elements
    gameSliderTrack = document.getElementById('gameSliderTrack');
    gameSlides = document.querySelectorAll('.game-slide');
    gameDots = document.querySelectorAll('.game-dot');
    gamePrevBtn = document.getElementById('gamePrevBtn');
    gameNextBtn = document.getElementById('gameNextBtn');
    
    totalGameSlides = gameSlides.length;
    
    // Initialize both sliders
    initFeatureSlider();
    initGameSlider();
    
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
    
    // Game Slider Functions
    function initGameSlider() {
        if (totalGameSlides === 0) return;
        
        const slideWidth = 100 / totalGameSlides;
        gameSlides.forEach(slide => {
            slide.style.width = `${slideWidth}%`;
        });
        
        updateGameSlider();
        updateGameDots();
    }
    
    function updateGameSlider() {
        if (totalGameSlides === 0) return;
        
        const slideWidth = gameSlides[0].offsetWidth;
        gameSliderTrack.style.transform = `translateX(-${currentGameSlide * slideWidth}px)`;
        
        // Update active slide class
        gameSlides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentGameSlide);
        });
        
        // Update slider track width
        gameSliderTrack.style.width = `${totalGameSlides * 100}%`;
    }
    
    function updateGameDots() {
        gameDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentGameSlide);
        });
    }
    
    function nextGameSlide() {
        currentGameSlide = (currentGameSlide + 1) % totalGameSlides;
        updateGameSlider();
        updateGameDots();
    }
    
    function prevGameSlide() {
        currentGameSlide = (currentGameSlide - 1 + totalGameSlides) % totalGameSlides;
        updateGameSlider();
        updateGameDots();
    }
    
    function goToGameSlide(slideIndex) {
        currentGameSlide = slideIndex;
        updateGameSlider();
        updateGameDots();
    }
    
    // Event listeners for Feature Slider
    if (featureNextBtn) {
        featureNextBtn.addEventListener('click', nextFeatureSlide);
    }
    
    if (featurePrevBtn) {
        featurePrevBtn.addEventListener('click', prevFeatureSlide);
    }
    
    // Event listeners for Game Slider
    if (gameNextBtn) {
        gameNextBtn.addEventListener('click', nextGameSlide);
    }
    
    if (gamePrevBtn) {
        gamePrevBtn.addEventListener('click', prevGameSlide);
    }
    
    // Dot navigation for Feature Slider
    featureDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToFeatureSlide(index));
    });
    
    // Dot navigation for Game Slider
    gameDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToGameSlide(index));
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            if (isShowingGames) {
                nextGameSlide();
            } else {
                nextFeatureSlide();
            }
        } else if (e.key === 'ArrowLeft') {
            if (isShowingGames) {
                prevGameSlide();
            } else {
                prevFeatureSlide();
            }
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
                if (isShowingGames) {
                    nextGameSlide();
                } else {
                    nextFeatureSlide();
                }
            } else {
                // Swipe right
                if (isShowingGames) {
                    prevGameSlide();
                } else {
                    prevFeatureSlide();
                }
            }
        }
    }
    
    // Add touch events to both sliders
    if (featureSliderTrack) {
        featureSliderTrack.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        featureSliderTrack.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
    }
    
    if (gameSliderTrack) {
        gameSliderTrack.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        gameSliderTrack.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        updateFeatureSlider();
        updateGameSlider();
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
    
    // Initialize game icons after slider initialization
    if (window.appStoreIconFetcher) {
        setTimeout(() => {
            window.appStoreIconFetcher.updateGameSlideImages();
        }, 1500);
    }


    });

// Supported Games button functionality
document.addEventListener('DOMContentLoaded', function() {
    const supportedGamesBtn = document.getElementById('supportedGamesBtn');
    const featureSlider = document.getElementById('featureSlider');
    const gameSlider = document.getElementById('gameSlider');
    const featureHeader = document.querySelector('.feature-header');
    const gameHeader = document.querySelector('.game-header');
    
    if (supportedGamesBtn) {
        supportedGamesBtn.addEventListener('click', function() {
            isShowingGames = !isShowingGames;
            window.isShowingGames = isShowingGames;
            
            if (isShowingGames) {
                // Switch to games view
                featureSlider.style.display = 'none';
                gameSlider.style.display = 'block';
                featureHeader.style.display = 'none';
                gameHeader.style.display = 'block';
                
                // Reset game slider to first slide
                currentGameSlide = 0;
                updateGameSlider();
                updateGameDots();
                
                // Update game icons when switching to games view
                if (window.appStoreIconFetcher) {
                    setTimeout(() => {
                        window.appStoreIconFetcher.updateGameSlideImages();
                    }, 500);
                }
                
            } else {
                // Switch back to features view
                featureSlider.style.display = 'block';
                gameSlider.style.display = 'none';
                featureHeader.style.display = 'block';
                gameHeader.style.display = 'none';
                
                // Reset feature slider to first slide
                currentFeatureSlide = 0;
                updateFeatureSlider();
                updateFeatureDots();
            }
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

window.updateGameSlider = function() {
    if (totalGameSlides === 0) return;
    
    const slideWidth = gameSlides[0].offsetWidth;
    gameSliderTrack.style.transform = `translateX(-${currentGameSlide * slideWidth}px)`;
    
    // Update active slide class
    gameSlides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentGameSlide);
    });
    
    // Update slider track width
    gameSliderTrack.style.width = `${totalGameSlides * 100}%`;
};

window.updateFeatureDots = function() {
    featureDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentFeatureSlide);
    });
};

window.updateGameDots = function() {
    gameDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentGameSlide);
    });
};
