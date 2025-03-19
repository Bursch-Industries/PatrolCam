// Check to see if the User has an existing session. Differs from authMiddlware in that it returns a 200 status instead next()

const isSessionExpired = async (req, res) => {

    if (req.session.user) {
        res.sendStatus(200); // Session is valid
    } else {
        res.sendStatus(401); // Session expired
    }

}

module.exports = isSessionExpired;