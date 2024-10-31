document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const nameInput = document.getElementById('name');
    const organizationInput = document.getElementById('organization');
    const emailInput = document.getElementById('email');
    const productInput = document.getElementById('productInterest');
    const phoneNumberInput = document.getElementById('phoneNumber');
    
    // Get the values from the input fields
    const name = nameInput.value;
    const organization = organizationInput.value;
    const email = emailInput.value;
    const product = productInput.value;
    const phoneNumber = phoneNumberInput.value;



    // Clear previous error messages
    //errorMessage.textContent = '';

    if (name === '' || organization === '' || phoneNumber === '' || email === '' || product === '') {

    if (name === '') {
        
        nameInput.style.border = '2px solid red';

        console.log('missing name')
    } else {
        nameInput.style.border = '2px solid green';
    }

    if (organization === '') {
        
        organizationInput.style.border = '2px solid red';

        console.log('missing organization')
    } else {
        organizationInput.style.border = '2px solid green';
    }

    if (phoneNumber === '') {
        
        phoneNumberInput.style.border = '2px solid red';

        console.log('missing organization')
    } else {
        phoneNumberInput.style.border = '2px solid green';
    }

    if (email === '') {
        
        emailInput.style.border = '2px solid red';

        console.log('missing email')
    } else {
        emailInput.style.border = '2px solid green';
    }

    if (product === '') {
        
        productInput.style.border = '2px solid red';

        console.log('missing product')
    } else {
        productInput.style.border = '2px solid green';
    }
    return;
    }
    
        console.log('Contact Form Sent');
        window.location.href = '/'; // Adjust the URL as necessary
   
});