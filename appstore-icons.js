// App Store Icons Fetcher
// Fetches game icons from the App Store API using bundle IDs

const GAME_BUNDLES = {
    "Combat Master": "com.AlfaBravo.CombatMaster",
    "1v1 LoL": "lol.onevone", 
    "Guns of Boom": "com.gameinsight.gobios",
    "Kuboom": "com.Nobodyshot.kuboom",
    "The Walking Zombies": "com.aldagames.zombieshooter",
    "Hitman Blood Money": "com.feralinteractive.hitmanbloodmoney-ios"
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

class AppStoreIconFetcher {
    constructor() {
        this.cache = new Map();
        this.gameDataCache = new Map();
        this.baseUrl = 'https://itunes.apple.com/lookup';
        this.proxyUrl = 'https://api.allorigins.win/raw?url=';
    }

    async fetchGameData(bundleId) {
        // Check cache first
        if (this.gameDataCache.has(bundleId)) {
            return this.gameDataCache.get(bundleId);
        }

        try {
            // Try direct API call first
            const response = await fetch(`${this.baseUrl}?bundleId=${bundleId}&country=us`);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const app = data.results[0];
                const gameData = {
                    iconUrl: app.artworkUrl512 || app.artworkUrl256 || app.artworkUrl100,
                    trackName: app.trackName,
                    artistName: app.artistName,
                    version: app.version,
                    releaseDate: app.releaseDate,
                    fileSizeBytes: app.fileSizeBytes,
                    averageUserRating: app.averageUserRating,
                    userRatingCount: app.userRatingCount,
                    price: app.price,
                    currency: app.currency,
                    genres: app.genres,
                    description: app.description,
                    languageCodesISO2A: app.languageCodesISO2A,
                    contentAdvisoryRating: app.contentAdvisoryRating,
                    minimumOsVersion: app.minimumOsVersion,
                    supportedDevices: app.supportedDevices,
                    screenshotUrls: app.screenshotUrls,
                    ipadScreenshotUrls: app.ipadScreenshotUrls
                };
                
                // Cache the result
                this.gameDataCache.set(bundleId, gameData);
                return gameData;
            }
            
            return null;
            
        } catch (error) {
            console.warn(`Direct API call failed for ${bundleId}, trying proxy...`, error);
            
            // Try proxy as fallback
            try {
                const proxyResponse = await fetch(`${this.proxyUrl}${encodeURIComponent(`${this.baseUrl}?bundleId=${bundleId}&country=us`)}`);
                const proxyData = await proxyResponse.json();
                
                if (proxyData.results && proxyData.results.length > 0) {
                    const app = proxyData.results[0];
                    const gameData = {
                        iconUrl: app.artworkUrl512 || app.artworkUrl256 || app.artworkUrl100,
                        trackName: app.trackName,
                        artistName: app.artistName,
                        version: app.version,
                        releaseDate: app.releaseDate,
                        fileSizeBytes: app.fileSizeBytes,
                        averageUserRating: app.averageUserRating,
                        userRatingCount: app.userRatingCount,
                        price: app.price,
                        currency: app.currency,
                        genres: app.genres,
                        description: app.description,
                        languageCodesISO2A: app.languageCodesISO2A,
                        contentAdvisoryRating: app.contentAdvisoryRating,
                        minimumOsVersion: app.minimumOsVersion,
                        supportedDevices: app.supportedDevices,
                        screenshotUrls: app.screenshotUrls,
                        ipadScreenshotUrls: app.ipadScreenshotUrls
                    };
                    
                    // Cache the result
                    this.gameDataCache.set(bundleId, gameData);
                    return gameData;
                }
            } catch (proxyError) {
                console.error(`Proxy also failed for ${bundleId}:`, proxyError);
            }
            
            return null;
        }
    }

    async fetchGameIcon(bundleId) {
        const gameData = await this.fetchGameData(bundleId);
        return gameData ? gameData.iconUrl : this.getFallbackIcon(bundleId);
    }

    getFallbackIcon(bundleId) {
        // Return a default game icon if API fails
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiByeD0iODAiIGZpbGw9InVybCgjZ3JhZGllbnQpIi8+CjxyZWN0IHdpZHRoPSI0ODAiIGhlaWdodD0iNDgwIiB4PSIxNiIgeT0iMTYiIHJ4PSI2NCIgZmlsbD0iIzFhMWExYSIvPgo8cGF0aCBkPSJNMjU2IDEyOGMtNzAuNyAwLTEyOCA1Ny4zLTEyOCAxMjhzNTcuMyAxMjggMTI4IDEyOCAxMjgtNTcuMyAxMjgtMTI4LTU3LjMtMTI4LTEyOC0xMjh6IiBmaWxsPSIjNjk2OWZmIi8+CjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgeD0iMjI0IiB5PSIyMjQiIHJ4PSI4IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgeD0iMzI4IiB5PSIyMjQiIHJ4PSI4IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgeD0iMjc2IiB5PSIzMjgiIHJ4PSI4IiBmaWxsPSIjZmZmIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50IiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2OTY5ZmY7c3RvcC1vcGFjaXR5OjEiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojYzI5ZmZmO3N0b3Atb3BhY2l0eToxIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+';
    }

    async fetchAllGameData() {
        const gameData = {};
        
        for (const [gameName, bundleId] of Object.entries(GAME_BUNDLES)) {
            try {
                const data = await this.fetchGameData(bundleId);
                gameData[gameName] = data;
            } catch (error) {
                console.error(`Error fetching data for ${gameName}:`, error);
                gameData[gameName] = null;
            }
        }
        
        return gameData;
    }

    // Method to update game slide images and data
    async updateGameSlideImages() {
        const gameData = await this.fetchAllGameData();
        
        // Update each game slide with the fetched data
        Object.entries(gameData).forEach(([gameName, data]) => {
            const gameSlide = document.querySelector(`[data-game="${gameName}"]`);
            if (gameSlide && data) {
                // Update icon
                const imgElement = gameSlide.querySelector('.mod-image');
                if (imgElement && data.iconUrl) {
                    this.createRoundedIcon(imgElement, data.iconUrl, gameName);
                }
                
                // Update game metadata
                this.updateGameMetadata(gameSlide, data, gameName);
            }
        });
    }

    // Method to update game metadata
    updateGameMetadata(gameSlide, data, gameName) {
        const gameMeta = gameSlide.querySelector('.game-meta');
        if (!gameMeta) return;

        // Clear existing content
        gameMeta.innerHTML = '';

        // Add bundle ID
        const bundleId = GAME_BUNDLES[gameName];
        if (bundleId) {
            const bundleElement = document.createElement('p');
            bundleElement.innerHTML = `<strong>Bundle ID:</strong> ${bundleId}`;
            gameMeta.appendChild(bundleElement);
        }

        // Add App Store version
        if (data.version) {
            const versionElement = document.createElement('p');
            versionElement.innerHTML = `<strong>App Store Version:</strong> ${data.version}`;
            gameMeta.appendChild(versionElement);
        }

        // Add developer
        if (data.artistName) {
            const developerElement = document.createElement('p');
            developerElement.innerHTML = `<strong>Developer:</strong> ${data.artistName}`;
            gameMeta.appendChild(developerElement);
        }

        // Add release date
        if (data.releaseDate) {
            const releaseDate = new Date(data.releaseDate);
            const releaseElement = document.createElement('p');
            releaseElement.innerHTML = `<strong>Release Date:</strong> ${releaseDate.toLocaleDateString()}`;
            gameMeta.appendChild(releaseElement);
        }

        // Add file size
        if (data.fileSizeBytes) {
            const fileSizeMB = (parseInt(data.fileSizeBytes) / (1024 * 1024)).toFixed(1);
            const sizeElement = document.createElement('p');
            sizeElement.innerHTML = `<strong>File Size:</strong> ${fileSizeMB} MB`;
            gameMeta.appendChild(sizeElement);
        }

        // Add rating
        if (data.averageUserRating) {
            const ratingElement = document.createElement('p');
            const stars = '★'.repeat(Math.round(data.averageUserRating)) + '☆'.repeat(5 - Math.round(data.averageUserRating));
            ratingElement.innerHTML = `<strong>Rating:</strong> ${stars} (${data.averageUserRating.toFixed(1)})`;
            gameMeta.appendChild(ratingElement);
        }

        // Add price
        if (data.price !== undefined) {
            const priceElement = document.createElement('p');
            const priceText = data.price === 0 ? 'Free' : `${data.price} ${data.currency || 'USD'}`;
            priceElement.innerHTML = `<strong>Price:</strong> ${priceText}`;
            gameMeta.appendChild(priceElement);
        }

        // Add genres
        if (data.genres && data.genres.length > 0) {
            const genresElement = document.createElement('p');
            genresElement.innerHTML = `<strong>Genres:</strong> ${data.genres.slice(0, 3).join(', ')}`;
            gameMeta.appendChild(genresElement);
        }

        // Add supported devices
        if (data.supportedDevices && data.supportedDevices.length > 0) {
            const devicesElement = document.createElement('p');
            const deviceTypes = data.supportedDevices.map(device => {
                if (device.includes('iPhone')) return 'iPhone';
                if (device.includes('iPad')) return 'iPad';
                if (device.includes('iPod')) return 'iPod';
                return device;
            });
            const uniqueDevices = [...new Set(deviceTypes)];
            devicesElement.innerHTML = `<strong>Devices:</strong> ${uniqueDevices.join(', ')}`;
            gameMeta.appendChild(devicesElement);
        }

        // Update the features title with game title and supported version
        this.updateFeaturesTitle(gameSlide, gameName);
    }

    // Method to update features title with game title and supported version
    updateFeaturesTitle(gameSlide, gameName) {
        const featuresTitle = gameSlide.querySelector('.features-title');
        if (!featuresTitle) return;

        const cheatVersion = GAME_CHEAT_VERSIONS[gameName] || 'Unknown';
        featuresTitle.textContent = `${gameName.toUpperCase()} | CHEAT FEATURES | FOR: ${cheatVersion}`;
    }

    // Method to create rounded icon using canvas
    createRoundedIcon(imgElement, iconUrl, gameName) {
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
            console.warn(`Failed to load image for ${gameName}, using fallback`);
            // Use fallback icon if image fails to load
            imgElement.src = this.getFallbackIcon();
            imgElement.alt = `${gameName} Icon (Fallback)`;
        }.bind(this);
        
        // Try to load the image
        img.src = iconUrl;
    }

    // Method to get icon for specific game
    async getGameIcon(gameName) {
        const bundleId = GAME_BUNDLES[gameName];
        if (!bundleId) {
            console.error(`No bundle ID found for game: ${gameName}`);
            return this.getFallbackIcon();
        }
        
        return await this.fetchGameIcon(bundleId);
    }

    // Method to test API connectivity
    async testAPIConnectivity() {
        console.log('Testing App Store API connectivity...');
        
        try {
            const testBundleId = 'com.apple.Pages';
            const response = await fetch(`${this.baseUrl}?bundleId=${testBundleId}&country=us`);
            
            if (response.ok) {
                console.log('✅ Direct API connection successful');
                return true;
            } else {
                console.warn('⚠️ Direct API connection failed, will use proxy fallback');
                return false;
            }
        } catch (error) {
            console.warn('⚠️ Direct API connection failed, will use proxy fallback:', error);
            return false;
        }
    }

    // Method to initialize with connectivity test
    async initialize() {
        console.log('Initializing App Store Icon Fetcher...');
        await this.testAPIConnectivity();
        console.log('App Store Icon Fetcher initialized');
    }
}

// Create global instance
window.appStoreIconFetcher = new AppStoreIconFetcher();

// Auto-update game icons when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize with connectivity test
    await window.appStoreIconFetcher.initialize();
    
    // Update game icons after a short delay to ensure sliders are initialized
    setTimeout(() => {
        window.appStoreIconFetcher.updateGameSlideImages();
    }, 1000);
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppStoreIconFetcher;
} 