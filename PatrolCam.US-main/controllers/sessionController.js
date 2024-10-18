const isSessionExpired = async (req, res) => {

    if (req.session.user) {
        res.status(200); // Session is valid
    } else {
        res.status(401); // Session expired
    }

}

module.exports = isSessionExpired;