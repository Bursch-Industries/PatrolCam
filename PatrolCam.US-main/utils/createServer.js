require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const corsOptions = require('../config/corsOptions')
const sessionMiddleware = require('../middleware/sessionHandler');


function createServer() {

const app = express();

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// json handling middleware
app.use(express.json());

// Middleware to handle url encoded data (form data)
app.use(express.urlencoded({ extended: false }));

// Session Middleware
app.use(sessionMiddleware.sessionMiddleware);

// Serving static files
app.use('/', express.static(path.join(__dirname, '../public')));
app.use('/FrontEndJavaScript', express.static(path.join(__dirname, '../FrontEndJavaScript')));

// Page Routers
app.use('/', require('../routes/root'));

// API Routers
app.use('/register', require('../routes/api/register'));

// Email API
app.use('/', require('../routes/api/emailAPI'));

// Login API
app.use('/login', require('../routes/api/loginAPI'));

// Query API
app.use('/api/user', require('../routes/api/userAPI'));

// Refresh session on server action
app.use(sessionMiddleware.sessionRefresh);

// Universal 404 Catch
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});


return app;
}

module.exports = createServer;