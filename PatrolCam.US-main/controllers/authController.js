

const handleAuth = async (req, res) => {

const { username } = "test"; // Simplified login logic
// Here you would validate the user
console.log('posting')
req.session.user = { username }; // Store user info in session
res.redirect('/sign-up');

}

module.exports = handleAuth;