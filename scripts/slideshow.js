// scripts/slideshow.js
let currentImageIndex = 0;
let imageUrls = [];
let slideshowInterval;

async function initSlideshow(imageFolderPath) {
    try {
        // First try to auto-discover images (works if directory listing is enabled)
        const autoDiscovered = await tryAutoDiscoverImages(imageFolderPath);
        
        // If auto-discovery failed, use manual list
        imageUrls = autoDiscovered.length > 0 ? autoDiscovered : getManualImageList(imageFolderPath);
        
        if (imageUrls.length === 0) {
            showErrorMessage('No production metrics available');
            return;
        }
        
        startSlideshow();
    } catch (error) {
        console.error('Error initializing slideshow:', error);
        showErrorMessage('Error loading production data');
    }
}

async function tryAutoDiscoverImages(folderPath) {
    try {
        const response = await fetch(folderPath);
        if (!response.ok) return [];
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        return Array.from(doc.querySelectorAll('a[href]'))
            .map(link => link.getAttribute('href'))
            .filter(href => 
                /\.(jpg|jpeg|png|gif|webp)$/i.test(href) && 
                !href.includes('..') &&
                !href.startsWith('?')
            )
            .map(href => folderPath + href);
    } catch {
        return []; // Return empty array if auto-discovery fails
    }
}

function getManualImageList(folderPath) {
    // MANUAL OVERRIDE: Add your actual image filenames here
    return [
        `${folderPath}production_graph.jpg`,
        `${folderPath}kpi_dashboard.png`,
        `${folderPath}shift_metrics.webp`
        // Add more images as needed
    ].filter(url => {
        // Basic validation to prevent 404s
        const ext = url.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
    });
}

function startSlideshow() {
    document.getElementById('loading').style.display = 'none';
    preloadImages().then(() => {
        showNextImage();
        slideshowInterval = setInterval(showNextImage, 10000);
    });
}

async function preloadImages() {
    const preloadPromises = imageUrls.map(url => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = resolve; // Continue even if some fail
        });
    });
    await Promise.all(preloadPromises);
}

function showNextImage() {
    const container = document.getElementById('kpi-slideshow');
    
    if (imageUrls.length === 0) return;
    
    const img = document.createElement('img');
    img.src = imageUrls[currentImageIndex];
    img.className = 'absolute inset-0 w-full h-full object-contain animate-fade';
    img.alt = `Production metric ${currentImageIndex + 1}`;
    
    img.onerror = () => {
        console.warn('Failed to load:', imageUrls[currentImageIndex]);
        // Remove broken image from rotation
        imageUrls.splice(currentImageIndex, 1);
        if (imageUrls.length === 0) {
            showErrorMessage('No valid images available');
            clearInterval(slideshowInterval);
        } else {
            currentImageIndex = currentImageIndex % imageUrls.length;
            showNextImage();
        }
    };
    
    container.innerHTML = '';
    container.appendChild(img);
    currentImageIndex = (currentImageIndex + 1) % imageUrls.length;
}

function showErrorMessage(message) {
    const loadingEl = document.getElementById('loading');
    loadingEl.textContent = message;
    loadingEl.style.display = 'flex';
}
