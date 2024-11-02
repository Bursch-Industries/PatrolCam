$(function() {
    // Show modal when profile picture is clicked
    $('#logout-show').click(function(event) {
        event.preventDefault();
        $('#logout-modal').fadeIn().attr('aria-hidden', 'false');
    });

    // Close modal when close button is clicked
    $('.close-out-modal').click(function() {
        $('#logout-modal').fadeOut().attr('aria-hidden', 'true');
    });

    // Close modal when clicking outside of it
    $(window).click(function(event) {
        if ($(event.target).is('#logout-modal')) {
            $('#logout-modal').fadeOut().attr('aria-hidden', 'true');
        }
    });
});