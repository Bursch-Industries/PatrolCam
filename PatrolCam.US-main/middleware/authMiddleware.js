function requireAuth(req, res, next) {

    if (req.session.user) {
        // User is authenticated, proceed to the next middleware or route handler
        return next();
    } else {
        // User is not authenticated, respond with an error or redirect
<<<<<<< HEAD
        return res.redirect('/login')
=======
        return res.redirect('/401')
>>>>>>> Ethan_Off_Midterm
    }
}

module.exports = requireAuth;