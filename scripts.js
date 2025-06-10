// filepath: c:\Production\carousel-website\scripts.js
document.addEventListener('DOMContentLoaded', () => {
    // Image cycling
    let currentSlide = 0;
    const slides = document.querySelectorAll('.kpi-slide');
    const cycleTime = 10000;

    function cycleImages() {
        slides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 0) {
        slides[0].classList.add('active');
        setInterval(cycleImages, cycleTime);
    }

    // Time display
    function updateTime() {
        const options = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true
        };
        document.getElementById('current-time').textContent = 
            new Date().toLocaleTimeString('en-US', options);
    }
    setInterval(updateTime, 1000);
    updateTime();

    // Fullscreen functionality
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    fullscreenBtn.addEventListener('click', toggleFullscreen);
});