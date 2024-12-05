// Fetches the first name of the logged in user and displays it on the dashboard
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/register/getCurrentUserFirstName', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });;
        const data = await response.json();
        document.getElementById('nameTag').textContent = data.name;
    } catch (error) {
        console.error('Error fetching user name:', error);
    }
});