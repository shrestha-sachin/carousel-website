async function initSlideshow(line) {
    const loading = document.getElementById('loading');
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`/api/get-images.php?line=${line}`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Invalid response format');
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        // ... rest of your slideshow code ...

    } catch (error) {
        console.error('Fetch error:', error);
        loading.innerHTML = `
            <div class="text-red-400 text-center p-4">
                <p class="font-bold">Configuration Error</p>
                <p class="mt-2">${error.message}</p>
                <p class="mt-4 text-sm">Verify:</p>
                <ul class="text-xs list-disc list-inside">
                    <li>API endpoint exists (check URL)</li>
                    <li>PHP is enabled on server</li>
                    <li>Directory permissions (755 for folders)</li>
                    <li>Valid images in correct format</li>
                </ul>
            </div>
        `;
    }
}