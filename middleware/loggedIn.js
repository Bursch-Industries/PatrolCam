// Checks if user is logged in. Used for routing purposes where role does not matter and we need the navbar to be different

function loggedIn(req, res, next) {

    if (req.session && req.session.user) {
        // User is authenticated, proceed to the next middleware or route handler
        return true;
    } else {
        // User is not authenticated, respond with an error or redirect
        return false;
    }
}

module.exports = loggedIn;