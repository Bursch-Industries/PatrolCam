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