// filepath: c:\Production\carousel-website\scripts\slideshow.js
document.addEventListener("DOMContentLoaded", () => {
    const imageContainer = document.getElementById("image-container");
    const maxImages = 20;
    const cycleTime = 10000;
    
    const imageBasePath = `../Resources/images/`;
    const imagePrefix = "image";
    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"]; // Supported extensions

    let loadedImages = [];
    let imagesTried = 0;

    function startSlideshow() {
        if (loadedImages.length === 0) {
            const p = document.createElement("p");
            p.textContent = `No images available for this line.`;
            p.className = "text-center text-white text-xl";
            imageContainer.appendChild(p);
            return;
        }

        let currentSlide = 0;
        loadedImages[currentSlide].classList.add("active");

        setInterval(() => {
            loadedImages[currentSlide].classList.remove("active");
            currentSlide = (currentSlide + 1) % loadedImages.length;
            loadedImages[currentSlide].classList.add("active");
        }, cycleTime);
    }

    function tryImageExtensions(index) {
        let attempts = 0;
        
        function attemptLoad() {
            if (attempts >= imageExtensions.length) {
                imagesTried++;
                if (imagesTried === maxImages) startSlideshow();
                return;
            }
            
            const img = new Image();
            const fileName = `${imagePrefix}${index}${imageExtensions[attempts]}`;
            img.src = imageBasePath + fileName;
            img.className = "kpi-slide";
            
            console.log(`Attempting to load: ${img.src}`);

            img.onload = () => {
                imageContainer.appendChild(img);
                loadedImages.push(img);
                imagesTried++;
                console.log(`Successfully loaded: ${img.src}`);
                if (imagesTried === maxImages) startSlideshow();
            };

            img.onerror = () => {
                attempts++;
                console.log(`Failed to load: ${img.src}, trying next extension`);
                attemptLoad();
            };
        }
        
        attemptLoad();
    }

    for (let i = 1; i <= maxImages; i++) {
        tryImageExtensions(i);
    }
});