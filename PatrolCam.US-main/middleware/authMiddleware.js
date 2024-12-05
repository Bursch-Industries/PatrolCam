const fs = require('fs')
const path = require('path');

function requireAuth(req, res, next) {

    // Check if the user is logged in by checking for session and user info in session
    if (req.session && req.session.user) {

        // Dynamically generate the file to search for based on the user role and the intended page being requested
        const filePath = `./pages/${req.session.user.role}${req.path}.html`;
        fs.stat(filePath, (err, stats) => {
            if (err) {
                // If the file does not exist, send a 404 response
                if (err.code === 'ENOENT') {
                    return res.redirect('/404');
                }
                // Send 500 status for any other errors
                return res.status(500).send('Server Error');
            } else if(stats.isFile()) {
                return next(); // If the file does exist, continue serving
            }
        })
}
    else return res.redirect('/login')
}

module.exports = requireAuth;