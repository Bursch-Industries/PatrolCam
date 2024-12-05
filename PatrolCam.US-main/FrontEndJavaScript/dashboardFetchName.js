window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/register/getCurrentUserFirstName', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });;
        const data = await response.json();

        console.log(JSON.stringify(data));
        document.getElementById('nameTag').textContent = data.name;
        console.log('no error')
    } catch (error) {
        console.error('Error fetching user name:', error);
    }
});