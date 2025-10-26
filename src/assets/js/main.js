let currentFeatureSlide = 0;
let totalFeatureSlides = 0;
let featureSliderTrack, featureSlides, featureDots, featurePrevBtn, featureNextBtn;
let isShowingSliders = false;
document.addEventListener('DOMContentLoaded', function() {
    const heroLogo = document.getElementById('hero-logo');
    const navLogo = document.getElementById('nav-logo');
    
    // Detect if we're in LiveDemo subdirectory
    const isLiveDemo = window.location.pathname.includes('/LiveDemo/');
    const logoPath = isLiveDemo ? '../../assets/images/ui/logo.png' : '../assets/images/ui/logo.png';
    
    if (heroLogo) {
        heroLogo.src = logoPath;
    }
    if (navLogo) {
        navLogo.src = logoPath;
    }
    const sliderContainers = document.querySelectorAll('.slider-container');
    sliderContainers.forEach(container => {
        container.style.transform = 'translateZ(0)';
        container.style.transform = '';
    });
    const blurPreload = document.querySelector('.blur-preload');
    if (blurPreload) {
        blurPreload.style.transform = 'translateZ(0)';
        blurPreload.style.transform = '';
        sliderContainers.forEach(container => {
            container.style.visibility = 'visible';
            container.style.opacity = '1';
            container.style.backdropFilter = 'blur(15px)';
            container.style.webkitBackdropFilter = 'blur(15px)';
        });
    }
    featureSliderTrack = document.getElementById('featureSliderTrack');
    featureSlides = document.querySelectorAll('.feature-slide');
    featureDots = document.querySelectorAll('.feature-dot');
    featurePrevBtn = document.getElementById('featurePrevBtn');
    featureNextBtn = document.getElementById('featureNextBtn');
    totalFeatureSlides = featureSlides.length;
    initFeatureSlider();
    setTimeout(() => {
        if (typeof updateFeatureSlider === 'function') {
            updateFeatureSlider();
            updateFeatureDots();
        }
    }, 100);
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
        featureSlides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentFeatureSlide);
        });
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
    if (featureNextBtn) {
        featureNextBtn.addEventListener('click', nextFeatureSlide);
    }
    if (featurePrevBtn) {
        featurePrevBtn.addEventListener('click', prevFeatureSlide);
    }
    featureDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToFeatureSlide(index));
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            nextFeatureSlide();
        } else if (e.key === 'ArrowLeft') {
            prevFeatureSlide();
        }
    });
    let startX = 0;
    let endX = 0;
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextFeatureSlide();
            } else {
                prevFeatureSlide();
            }
        }
    }
    if (featureSliderTrack) {
        featureSliderTrack.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        featureSliderTrack.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
    }
    window.addEventListener('resize', function() {
        updateFeatureSlider();
    });
    let controllerAnimationInterval;
    function startControllerAnimation() {
        const image1 = document.querySelector('.controller-image[data-image="1"]');
        const image2 = document.querySelector('.controller-image[data-image="2"]');
        if (!image1 || !image2) return;
        image1.style.visibility = 'visible';
        image2.style.visibility = 'hidden';
        image1.classList.remove('fade-out');
        image1.classList.add('fade-in');
        image2.classList.remove('fade-in');
        image2.classList.add('fade-out');
        controllerAnimationInterval = setInterval(() => {
            if (image1.style.visibility === 'visible') {
                image1.style.visibility = 'hidden';
                image1.classList.remove('fade-in');
                image1.classList.add('fade-out');
                setTimeout(() => {
                    image2.style.visibility = 'visible';
                    image2.classList.remove('fade-out');
                    image2.classList.add('fade-in');
                }, 200);
            } else {
                image2.style.visibility = 'hidden';
                image2.classList.remove('fade-in');
                image2.classList.add('fade-out');
                setTimeout(() => {
                    image1.style.visibility = 'visible';
                    image1.classList.remove('fade-out');
                    image1.classList.add('fade-in');
                }, 200);
            }
        });
    }
    function stopControllerAnimation() {
        if (controllerAnimationInterval) {
            clearInterval(controllerAnimationInterval);
            controllerAnimationInterval = null;
        }
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
    function checkControllerSlide() {
        if (currentFeatureSlide === 0) {
            startControllerAnimation();
        } else {
            stopControllerAnimation();
        }
    }
    setTimeout(checkControllerSlide, 1000);
    const liveDemoBtn = document.getElementById('liveDemoBtn');
    const supportedGamesBtn = document.getElementById('supportedGamesBtn');
    const heroSection = document.getElementById('heroSection');
    if (supportedGamesBtn) {
        supportedGamesBtn.addEventListener('click', function(e) {
            e.preventDefault();
        });
    }
    const topLogoLink = document.getElementById('topLogo');
    function returnToMainScreen() {
        const discoverPage = document.getElementById('discoverPage');
        if (discoverPage) {
            discoverPage.classList.remove('show');
        }
        const heroSection = document.getElementById('heroSection');
        if (heroSection) {
            heroSection.style.visibility = 'visible';
            heroSection.classList.remove('fade-out');
            heroSection.classList.add('fade-in');
        }
        isShowingSliders = false;
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    if (topLogoLink) {
        topLogoLink.addEventListener('click', function(e) {
            e.preventDefault();
            returnToMainScreen();
        });
    }
});
window.updateFeatureSlider = function() {
    if (totalFeatureSlides === 0) return;
    const slideWidth = featureSlides[0].offsetWidth;
    featureSliderTrack.style.transform = `translateX(-${currentFeatureSlide * slideWidth}px)`;
    featureSlides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentFeatureSlide);
    });
    featureSliderTrack.style.width = `${totalFeatureSlides * 100}%`;
};
window.updateFeatureDots = function() {
    featureDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentFeatureSlide);
    });
};
