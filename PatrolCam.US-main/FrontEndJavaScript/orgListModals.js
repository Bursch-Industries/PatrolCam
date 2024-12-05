// Script to show/hide form that is used to add a new organization

const formContainer = document.getElementById('orgFormContainer');
const formButton = document.getElementById('orgFormButton');

// Event listener for button that shows/hides the form for adding a new organization
document.getElementById('orgFormButton').addEventListener('click', function() {
    // Toggle visibility
    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'block';
        this.textContent = '-'; // Change button text
    } else {
        formContainer.style.display = 'none';
        this.textContent = '+'; // Reset button text
    }
});

// Hide the form if user clicks anywhere outside the form or button
document.addEventListener('click', function(event) {
    if (!formContainer.contains(event.target) && event.target !== formButton) {
        formContainer.style.display = 'none'; // Hide form
        formButton.textContent = '+'; // Reset button text
    }
});

// Prevent clicks inside the form from closing the form
formContainer.addEventListener('click', function(event) {
    event.stopPropagation(); // Prevent the click from propagating to the document
});

// Event listener for button that hides/shows the advanced filter form
document.getElementById('filterFormToggle').addEventListener('click', function() {
    const formContainer = document.getElementById('filterContainer');
    // Toggle visibility
    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'flex';
    } else {
        formContainer.style.display = 'none';
    }
});


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
const inputElement = document.getElementById('orgPhone');
inputElement.addEventListener('keydown',enforceFormat);
inputElement.addEventListener('input',formatToPhone);
