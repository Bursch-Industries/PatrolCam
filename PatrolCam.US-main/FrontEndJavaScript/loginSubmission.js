document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Get the values from the input fields
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Clear previous error messages
    //errorMessage.textContent = '';

    if (username === '' || password === '') {
        
        usernameInput.style.border = '2px solid red';
        passwordInput.style.border = '2px solid red';
        console.log('missing username or password')
        return;
    } 
    
    if (password != "^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$") {
        usernameInput.style.border = '2px solid red';
        passwordInput.style.border = '2px solid red';
        console.log('password must contain one uppercase, one lowercase, one special character, etc...');
        return;
    }

    try {
        const response = await fetch('/login/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
            const data = await response.json();
           // errorMessage.textContent = data.message; // Display error message

            if (data.message.includes('invalid-credentials')) {
                usernameInput.style.border = '2px solid red';
                document.getElementById('username-error').style.display = 'block';
                passwordInput.style.border = '2px solid red';
                document.getElementById('passworde-error').style.display = 'block';
            }   

            return; // Stop further execution
        }
        console.log('Login successful:');
        window.location.href = '/dashboard'; // Adjust the URL as necessary
        
        
    } catch (error) {
        console.error('Error:', error.message);
        //errorMessage.textContent = 'An unexpected error occurred.';
    }
});