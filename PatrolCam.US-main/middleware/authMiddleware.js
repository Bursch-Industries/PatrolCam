function requireAuth(req, res, next) {

    if (req.session.user) {
        // User is authenticated, proceed to the next middleware or route handler
        return next();
    } else {
        // User is not authenticated, respond with an error or redirect
        return res.redirect('/login')
    }
}

module.exports = requireAuth;