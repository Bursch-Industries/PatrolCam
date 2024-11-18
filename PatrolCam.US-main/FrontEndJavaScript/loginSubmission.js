// Elements
const passwordInput = document.getElementById('password');
const toggleButton = document.getElementById('toggleButton');
const rememberMe = document.getElementById('remember');
const errorBox = document.getElementById('error-box');
const emailInput = document.getElementById('loginEmail'); // Updated to match HTML

// Toggle Password Visibility
const toggleVisible = () => {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
};
toggleButton.addEventListener('click', toggleVisible);

// Load saved password if "Remember Me" is checked
window.onload = function() {
    const savedPassword = localStorage.getItem('rememberMe');
    if (savedPassword) {
        passwordInput.value = savedPassword;
        rememberMe.checked = true;
    }
};

// Form Submission Handling
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Clear previous error messages
    errorBox.style.display = 'none';
    emailInput.style.border = '';
    passwordInput.style.border = '';

    // Get the values from the input fields
    const email = emailInput.value;
    const password = passwordInput.value;

    let rememberMeBool = false;
    let rememberMeValue = '';
    let errors = [];

    // Check for empty fields
    if (!email) {
        errors.push("Please enter your email address.");
        emailInput.style.border = '2px solid red';

    } 
    
    if (!password) {
        errors.push("Please enter your password.");
        passwordInput.style.border = '2px solid red';
    }

    // Display errors if any exist
    if (errors.length > 0) {
        errorBox.innerHTML = errors.join("<br>");
        errorBox.style.display = 'block';
        return;
    }

    if(localStorage.getItem('rememberMe')){
        rememberMeValue = localStorage.getItem('rememberMe');
    }

    if (rememberMe.checked) {
        rememberMeBool = true; 
    } 

    // Send login request to the server
    try {
        const response = await fetch('/login/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, rememberMeBool, rememberMeValue }),
        });

        if (!response.ok) {
            const data = await response.json();
            
            if (data.message.includes('invalid-credentials')) {
                errors.push("Username and password do not match our records.");
                emailInput.style.border = '2px solid red';
                passwordInput.style.border = '2px solid red';
            } else {
                errors.push(data.message);
            }

            // Display the server error messages
            errorBox.innerHTML = errors.join("<br>");
            errorBox.style.display = 'block';
            return;
        }

        const data = await response.json();

        console.log('response received')

        // Handle "Remember Me" functionality
        if (rememberMe.checked && JSON.stringify(data.message)) {
            localStorage.setItem('rememberMe', data.message);
        } else {
            localStorage.removeItem('rememberMe');
        }

        // Redirect to dashboard on successful login
        window.location.href = '/dashboard'; // Adjust the URL as necessary

    } catch (error) {
        console.error('Error:', error.message);
        errorBox.innerHTML = 'An unexpected error occurred. Please try again later.';
        errorBox.style.display = 'block';
    }
});

