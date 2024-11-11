// Get elements
const gridContainer = document.getElementById('grid-container');
const iframes = gridContainer.querySelectorAll('iframe');

// Function to show specific camera view or all cameras
function showCameraView(cameraId) {
    if (cameraId === "all") {
        // Show all cameras in 2x2 grid layout
        gridContainer.classList.remove("single-camera-view");
        gridContainer.style.gridTemplateColumns = "1fr 1fr";
        iframes.forEach((iframe) => {
            iframe.style.display = "block"; 
            iframe.classList.remove("single-camera-frame"); 
            iframe.style.width = ""; 
            iframe.style.height = "";
        });
    } else {
        // Show only the selected camera in a centered view
        gridContainer.classList.add("single-camera-view");
        gridContainer.style.gridTemplateColumns = "1fr"; // Single-column layout

        iframes.forEach((iframe, index) => {
            if (index + 1 === parseInt(cameraId)) {
                iframe.style.display = "block";
                iframe.classList.add("single-camera-frame"); 
                iframe.style.width = ""; 
                iframe.style.height = ""; 
            } else {
                iframe.style.display = "none";
            }
        });
    }
}

// Event listener for dropdown selection in camera_pages.html
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(".dropdown-content a").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const selectedCamera = event.target.dataset.camera;
            showCameraView(selectedCamera); // Call function based on selection
        });
    });
});
