// filepath: c:\Production\carousel-website\scripts\utils.js
function startTimeUpdates() {
    function updateTime() {
        const options = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        };
        const timeElements = document.querySelectorAll('#current-time');
        timeElements.forEach(el => {
            el.textContent = new Date().toLocaleTimeString('en-US', options);
        });
    }
    
    setInterval(updateTime, 1000);
    updateTime();
}