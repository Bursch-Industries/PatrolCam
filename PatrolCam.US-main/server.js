require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const { logger, logEvents } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler')
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// json handling middleware
app.use(express.json());

// Middleware to handle url encoded data (form data)
app.use(express.urlencoded({ extended: false }));

// Serving static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

// Routers
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/api/register'));


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));