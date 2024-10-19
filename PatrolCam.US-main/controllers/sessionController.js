const isSessionExpired = async (req, res) => {

    if (req.session.user) {
        res.sendStatus(200); // Session is valid
    } else {
        res.sendStatus(401); // Session expired
    }

}

module.exports = isSessionExpired;