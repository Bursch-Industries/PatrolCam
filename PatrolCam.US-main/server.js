require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const { logger, logEvents } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler')
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn');
const sessionMiddleware = require('./middleware/sessionHandler');
const requireAuth = require('./middleware/authMiddleware');


const PORT = process.env.PORT || 3000;


// Connect to MongoDB
connectDB();

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// json handling middleware
app.use(express.json());

// Middleware to handle url encoded data (form data)
app.use(express.urlencoded({ extended: false }));

// Set up session
app.use(sessionMiddleware);



// Serving static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

// Page Routers
app.use('/', require('./routes/root'));

// API Routers
app.use('/register', require('./routes/api/register'));

// Test API
app.use('/test', require('./routes/api/loginAPI'));

// Email API
app.use('/', require('./routes/api/emailAPI'));

// Login API
app.use('/login', require('./routes/api/loginAPI'));

app.use(requireAuth);

// Protected Routers
app.use('/protected', require('./routes/protected/protectedRoute'));



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));