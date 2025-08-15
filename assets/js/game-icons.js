// Local Game Icons System
// Uses locally downloaded game icons instead of App Store API

const GAME_ICONS = {
    "Combat Master": "assets/images/games/game_icons/Combat_Master.jpg",
    "1v1 LoL": "assets/images/games/game_icons/1v1_LoL.jpg",
    "Guns of Boom": "assets/images/games/game_icons/Guns_of_Boom.jpg",
    "Kuboom": "assets/images/games/game_icons/Kuboom.jpg",
    "The Walking Zombies": "assets/images/games/game_icons/The_Walking_Zombies.jpg",
    "Hitman Blood Money": "assets/images/games/game_icons/Hitman_Blood_Money.jpg"
};

// Supported cheat versions from the C++ header file
const GAME_CHEAT_VERSIONS = {
    "Combat Master": "0.25.27",
    "1v1 LoL": "4.714",
    "Guns of Boom": "30.0.232",
    "Kuboom": "7.56.3",
    "The Walking Zombies": "1.0.0",
    "Hitman Blood Money": "1.0.0"
};

class LocalGameIcons {
    constructor() {
    }

    // Method to update game slide images with local icons
    updateGameSlideImages() {
        Object.entries(GAME_ICONS).forEach(([gameName, iconPath]) => {
            const gameSlide = document.querySelector(`[data-game="${gameName}"]`);
            if (gameSlide) {
                // Update icon
                const imgElement = gameSlide.querySelector('.mod-image');
                if (imgElement) {
                    this.createRoundedIcon(imgElement, iconPath, gameName);
                }
                
                // Features titles are now static in HTML
            }
        });
    }



    // Method to create rounded icon using canvas
    createRoundedIcon(imgElement, iconPath, gameName) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 300; // Size of the icon
        const radius = 20; // Border radius
        
        canvas.width = size;
        canvas.height = size;
        
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = function() {
            // Clear canvas
            ctx.clearRect(0, 0, size, size);
            
            // Create rounded rectangle path
            ctx.beginPath();
            ctx.moveTo(radius, 0);
            ctx.lineTo(size - radius, 0);
            ctx.quadraticCurveTo(size, 0, size, radius);
            ctx.lineTo(size, size - radius);
            ctx.quadraticCurveTo(size, size, size - radius, size);
            ctx.lineTo(radius, size);
            ctx.quadraticCurveTo(0, size, 0, size - radius);
            ctx.lineTo(0, radius);
            ctx.quadraticCurveTo(0, 0, radius, 0);
            ctx.closePath();
            
            // Clip to rounded rectangle
            ctx.clip();
            
            // Calculate image dimensions to maintain aspect ratio
            const imgAspect = img.width / img.height;
            const canvasAspect = size / size;
            
            let drawWidth, drawHeight, offsetX, offsetY;
            
            if (imgAspect > canvasAspect) {
                // Image is wider than canvas
                drawHeight = size;
                drawWidth = size * imgAspect;
                offsetX = (size - drawWidth) / 2;
                offsetY = 0;
            } else {
                // Image is taller than canvas
                drawWidth = size;
                drawHeight = size / imgAspect;
                offsetX = 0;
                offsetY = (size - drawHeight) / 2;
            }
            
            // Draw the image
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            
            // Convert canvas to data URL and set as image source
            const roundedIconUrl = canvas.toDataURL('image/png');
            imgElement.src = roundedIconUrl;
            imgElement.alt = `${gameName} Icon`;
        };
        
        img.onerror = function() {
            // Use original path if canvas processing fails
            imgElement.src = iconPath;
            imgElement.alt = `${gameName} Icon`;
        };
        
        // Try to load the image
        img.src = iconPath;
    }

    // Method to get icon path for specific game
    getGameIcon(gameName) {
        return GAME_ICONS[gameName] || null;
    }
}

// Create global instance
window.localGameIcons = new LocalGameIcons();

// Auto-update game icons when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Update game icons after a short delay to ensure sliders are initialized
    setTimeout(() => {
        window.localGameIcons.updateGameSlideImages();
    }, 1000);
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocalGameIcons;
} 