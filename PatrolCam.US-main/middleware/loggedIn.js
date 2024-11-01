// Checks if user is logged in. Used for routing purposes where role does not matter and we need the navbar to be different

function loggedIn(req, res, next) {

    console.log('Entering loggedIn.js');

    if (req.session && req.session.user) {
        // User is authenticated, proceed to the next middleware or route handler
        console.log('User is logged in');
        return true;
    } else {
        // User is not authenticated, respond with an error or redirect
        console.log('User is not logged in');
        return false;
    }
}

module.exports = loggedIn;