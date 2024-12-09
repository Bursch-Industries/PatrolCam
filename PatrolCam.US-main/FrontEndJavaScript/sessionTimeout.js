// Periodically checks for a session and redirects the page when session is not found
function checkSession() {
    fetch('/checkSession')
        .then(response => {
            if (response.status === 401) {
                // Session expired, redirect to login
                window.location.href = '/login'; // Adjust the URL as necessary
            }
        })
        .catch(error => {
            console.error('Error checking session:', error);
        });
}

// Check the session at regular intervals (e.g., every minute)
setInterval(checkSession, 60000); 