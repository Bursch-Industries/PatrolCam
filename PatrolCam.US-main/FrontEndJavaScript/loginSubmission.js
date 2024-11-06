// Elements
const passwordInput = document.getElementById('password');
const toggleButton = document.getElementById('toggleButton');
const rememberMe = document.getElementById('remember');
const errorBox = document.getElementById('error-box');
const usernameInput = document.getElementById('username');

// Toggle Password Visibility
const toggleVisible = () => {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
};
toggleButton.addEventListener('click', toggleVisible);

<<<<<<< Updated upstream


=======
// Load saved password if "Remember Me" is checked
>>>>>>> Stashed changes
window.onload = function() {
    const savedPassword = localStorage.getItem('password');
    if (savedPassword) {
        passwordInput.value = savedPassword;
        rememberMe.checked = true;
    }
};

// Form Submission Handling
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

<<<<<<< Updated upstream
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('password');
=======
    // Clear previous error messages
    errorBox.style.display = 'none';
    usernameInput.style.border = '';
    passwordInput.style.border = '';
>>>>>>> Stashed changes

    // Get the values from the input fields
    const email = emailInput.value;
    const password = passwordInput.value;
    let errors = [];

<<<<<<< Updated upstream
    // Clear previous error messages
    document.getElementById('missing-info-error').style.display = 'none';
    document.getElementById('username-error').style.display = 'none';
    document.getElementById('password-error').style.display = 'none';
    //errorMessage.textContent = '';


    // Check input for empty fields
    if (email === '' || password === '') {
        
        emailInput.style.border = '2px solid red';
        passwordInput.style.border = '2px solid red';
        document.getElementById('missing-info-error').style.display = 'block';
        return;
    } 


    // Check password regex (8 characters, one upper, one lower, one special)
    /* if (password != "^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$") {
=======
    // Check for empty fields
    if (!username) {
        errors.push("Please enter your email address.");
        usernameInput.style.border = '2px solid red';
    } else if (!isValidEmail(username)) {
        errors.push("Invalid email format.");
>>>>>>> Stashed changes
        usernameInput.style.border = '2px solid red';
    }

    if (!password) {
        errors.push("Please enter your password.");
        passwordInput.style.border = '2px solid red';
    }

    // Check password strength (minimum 8 characters and specific character requirements)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (password && !passwordRegex.test(password)) {
        errors.push("Password must be at least 8 characters and include one letter, one number, and one special character.");
        passwordInput.style.border = '2px solid red';
    }

    // Display errors if any exist
    if (errors.length > 0) {
        errorBox.innerHTML = errors.join("<br>");
        errorBox.style.display = 'block';
        return;
    }

    // Send login request to the server
    try {
<<<<<<< Updated upstream
        // If username and password exist, POST to server API
=======
>>>>>>> Stashed changes
        const response = await fetch('/login/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const data = await response.json();
            
            if (data.message.includes('invalid-credentials')) {
<<<<<<< Updated upstream
                emailInput.style.border = '2px solid red';
                document.getElementById('username-error').style.display = 'block';
=======
                errors.push("Username and password do not match our records.");
                usernameInput.style.border = '2px solid red';
>>>>>>> Stashed changes
                passwordInput.style.border = '2px solid red';
            } else {
                errors.push(data.message);
            }

            // Display the server error messages
            errorBox.innerHTML = errors.join("<br>");
            errorBox.style.display = 'block';
            return;
        }
<<<<<<< Updated upstream
        
        // If the user has checked the "Remember Password" box, store the password in the browser Local Storage. 
        if(document.getElementById('remember').checked) {
            localStorage.setItem('password', password)
        } else {
            localStorage.removeItem('password') // Remove the password from Local Storage if the form is submitted without the box checked
=======

        // Handle "Remember Me" functionality
        if (rememberMe.checked) {
            localStorage.setItem('password', password);
        } else {
            localStorage.removeItem('password');
>>>>>>> Stashed changes
        }

        // Redirect to dashboard on successful login
        window.location.href = '/dashboard'; // Adjust the URL as necessary

    } catch (error) {
        console.error('Error:', error.message);
        errorBox.innerHTML = 'An unexpected error occurred. Please try again later.';
        errorBox.style.display = 'block';
    }
});

// Utility function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
