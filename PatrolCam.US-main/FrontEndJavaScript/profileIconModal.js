document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('profileIcon').addEventListener('click', function() {
        const formContainer = document.getElementById('profile-modal');
        // Toggle visibility
        if (formContainer.style.display === 'none' || formContainer.style.display === '') {
            formContainer.style.display = 'block';
        } else {
            formContainer.style.display = 'none';
        }
    });
});
