$(function() {
    // Show modal when profile picture is clicked
    $('#logout-show').click(function(event) {
        event.preventDefault(); // Prevent default anchor behavior
        $('#logout-modal').fadeIn();
    });

    // Close modal when close button is clicked
    $('.close-out-modal').click(function() {
        $('#logout-modal').fadeOut();
    });

    // Optional: close modal when clicking outside of it
    $(window).click(function(event) {
        if ($(event.target).is('#logout-modal')) {
            $('#logout-modal').fadeOut();
        }
    });
});