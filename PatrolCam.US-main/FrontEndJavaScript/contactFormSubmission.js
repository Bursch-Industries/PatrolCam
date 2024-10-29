document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission


    // Create an array of all inputs that are being validated
    const inputs = [
        {element: document.getElementById('name'), name: 'name'},
        {element: document.getElementById('organization'), name: 'organization'},
        {element: document.getElementById('email'), name: 'email'},
        {element: document.getElementById('productInterest'), name: 'product'},
        {element: document.getElementById('phoneNumber'), name: 'phoneNumber'},
    ]
   
    // Clear previous styling
    inputs.forEach(input => {
        input.element.style.border = ''; // REPLACE with default border
    });

    let isInvalid = false;

    // Loop through array of inputs, check for empty fields. Empty fields are marked with red border. 
    inputs.forEach(input => {
        if (input.element.value.trim() === '') {
            input.element.style.border = '2px solid red';
            console.log(`missing ${input.name}`);
            isInvalid = true;
        } else {
            input.element.style.border = '2px solid green';
        }
    });

    // If any input is invalid, return stops redirect
    if(isInvalid) {
        return;
    }

        console.log('Contact Form Sent');
        window.location.href = '/'; // Adjust the URL as necessary
   
});