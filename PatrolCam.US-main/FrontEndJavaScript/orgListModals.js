// Script to show/hide form that is used to add a new organization

document.getElementById('orgFormButton').addEventListener('click', function() {
    const formContainer = document.getElementById('orgFormContainer');
    // Toggle visibility
    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'block';
        this.textContent = '-'; // Change button text
    } else {
        formContainer.style.display = 'none';
        this.textContent = '+'; // Reset button text
    }
});

document.getElementById('filterFormToggle').addEventListener('click', function() {
    console.log('filter button clicked')
    const formContainer = document.getElementById('filterContainer');
    console.log(formContainer.style.display)
    // Toggle visibility
    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'flex';
    } else {
        formContainer.style.display = 'none';
    }
});