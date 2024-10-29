
// Phone Number Formatting by user Legendary_Linux -- https://stackoverflow.com/questions/30058927/format-a-phone-number-as-a-user-types-using-pure-javascript

// Allows numeric input in phone number field
const isNumericInput = (event) => {
    const key = event.keyCode;
    return ((key >= 48 && key <= 57) || // Allow number line
        (key >= 96 && key <= 105) // Allow number pad
    );
};

// Allows modifier keys to be used in phone number field
const isModifierKey = (event) => {
    const key = event.keyCode;
    return (event.shiftKey === true || key === 35 || key === 36) || // Allow Shift, Home, End
        (key === 8 || key === 9 || key === 13 || key === 46) || // Allow Backspace, Tab, Enter, Delete
        (key > 36 && key < 41) || // Allow left, up, right, down
        (
            // Allow Ctrl/Command + A,C,V,X,Z
            (event.ctrlKey === true || event.metaKey === true) &&
            (key === 65 || key === 67 || key === 86 || key === 88 || key === 90)
        )
};

// Combines the allowed keys into one event
const enforceFormat = (event) => {
    // Input must be of a valid number format or a modifier key, and not longer than ten digits
    if(!isNumericInput(event) && !isModifierKey(event)){
        event.preventDefault();
    }
};

// Formats the input into desired structure
const formatToPhone = (event) => {
    if(isModifierKey(event)) {return;}

    const input = event.target.value.replace(/\D/g,'').substring(0,10); // First ten digits of input only
    const areaCode = input.substring(0,3);
    const middle = input.substring(3,6);
    const last = input.substring(6,10);

    if(input.length > 6){event.target.value = `(${areaCode}) - ${middle} - ${last}`;}
    else if(input.length > 3){event.target.value = `(${areaCode}) - ${middle}`;}
    else if(input.length > 0){event.target.value = `(${areaCode}`;}
};

// Event listeners for phone number formatting "as you type"
const inputElement = document.getElementById('phoneNumber');
inputElement.addEventListener('keydown',enforceFormat);
inputElement.addEventListener('keydown',formatToPhone);


// Resets the form fields to their default values when page is loaded/refreshed
window.addEventListener('load', function() {
    const contactForm = document.getElementById('contactForm');
    contactForm.reset(); 
});

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