// Elements
const passwordInput = document.getElementById('password');
const toggleButton = document.getElementById('toggleButton');
const rememberMe = document.getElementById('remember');
const errorBox = document.getElementById('error-box');
const emailInput = document.getElementById('loginEmail'); // Updated to match HTML

// Toggle Password Visibility
const toggleVisible = () => {

    if(passwordInput.value === "••••••••••••") {
        passwordInput.value = "";
    } else if(passwordInput.value == "" && localStorage.getItem('rememberMe')) {
        passwordInput.value = "••••••••••••";
    }
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
};
toggleButton.addEventListener('click', toggleVisible);

// Load saved password if "Remember Me" is checked
window.onload = function() {
    const rememberValue = localStorage.getItem('rememberMe');
    if (rememberValue) {
        passwordInput.value = "••••••••••••";
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
    
    if (!password && !localStorage.getItem('rememberMe')) { // Allow the user to log in with no password value if they have been remembered in the browser local storage
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
            } else if(data.message.includes('db-value-null')){ // Error for when the local storage thinks the user is remembered and the db has no value
                errors.push("User is no longer remembered. Please enter password to log in");
                localStorage.removeItem('rememberMe');
            } else{
                errors.push(data.message);
            }

            // Display the server error messages
            errorBox.innerHTML = errors.join("<br>");
            errorBox.style.display = 'block';
            return;
        }


        // Check if response header contains JSON 
        const contentType = response.headers.get("Content-Type");
    
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            // Handle "Remember Me" functionality
            if (rememberMe.checked && data.message) {
                localStorage.setItem('rememberMe', data.message); // Set local storage when the response contains a string 
            } else {
                localStorage.removeItem('rememberMe'); // If the user does not want to be remembered or the db is empty, remove local storage
            }
        }

        // Redirect to dashboard on successful login
        window.location.href = '/dashboard'; // Adjust the URL as necessary

    } catch (error) {
        console.error('Error:', error.message);
        errorBox.innerHTML = 'An unexpected error occurred. Please try again later.';
        errorBox.style.display = 'block';
    }
});

