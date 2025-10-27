document.addEventListener('DOMContentLoaded', function() {
    const heroLogo = document.getElementById('hero-logo');
    const navLogo = document.getElementById('nav-logo');

    if (heroLogo) {
        heroLogo.src = 'src/assets/images/ui/logo.png';
        console.log('Hero logo ustawione');
    }

    if (navLogo) {
        navLogo.src = 'src/assets/images/ui/logo.png';
        console.log('Nav logo ustawione');
    }
});