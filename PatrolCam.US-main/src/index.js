const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Set the folder for static files like CSS, JS, images
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

app.get('/patrolcam-demo', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'patrolcam-demo.html'));
});

app.get('/sign-up', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'sign-up.html'));
});

app.post('/register', (req, res) => {
    const { name, organization, email } = req.body;

    // Process the data (e.g., store it in a database)
    // For demonstration purposes, let's print the data
    console.log('Name:', name);
    console.log('Organization:', organization);
    console.log('Email:', email);

    // Redirect to the "Thank you" page
    res.redirect('/thank-you');
});

app.get('/thank-you', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'thank-you.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
