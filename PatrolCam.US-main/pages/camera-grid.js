// Get elements
const gridIcon = document.getElementById('grid-icon');
const gridContainer = document.getElementById('grid-container');
const iframes = gridContainer.querySelectorAll('iframe');

let currentIndex = 0; // To keep track of current displayed iframe

// Function to update iframe display
function updateIframeDisplay() {
    // Reset the grid to show all iframes after the 4th one
    if (currentIndex >= iframes.length) {
        iframes.forEach((iframe) => {
            iframe.style.display = 'block'; // Show all frames
            iframe.style.width = '100%'; // Reset width
            iframe.style.height = '300px'; // Reset height
        });
        currentIndex = 0; // Reset index
    } else {
        // Hide all frames except the current one
        iframes.forEach((iframe, index) => {
            if (index === currentIndex) {
                iframe.style.display = 'block';
                iframe.style.width = '100%'; // Full width
                iframe.style.height = '600px'; 
            } else {
                iframe.style.display = 'none'; // Hide other frames
            }
        });
        currentIndex++; // Move to next iframe
    }
}

// Add event listener to the grid icon
gridIcon.addEventListener('click', updateIframeDisplay);
