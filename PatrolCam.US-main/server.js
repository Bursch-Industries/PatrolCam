require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const { logger, logEvents } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler')
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const sessionMiddleware = require('./middleware/sessionHandler');




const PORT = process.env.PORT || 3000;


// Connect to MongoDB
connectDB();

// Session Auth Middleware

app.use(sessionMiddleware);

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
app.use('/test', require('./routes/api/test'));
//app.use('/protected', require('./routes/api/auth'));
//app.use(checkAuth(session));
//app.use('/protected', require('./routes/protected/protectedRoute'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));