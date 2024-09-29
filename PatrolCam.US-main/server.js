require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const { logger, logEvents } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler')
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn');
const createStore = require('./config/createStore');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);





const PORT = process.env.PORT || 3000;


// Connect to MongoDB
connectDB();

console.log('db connected')

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// json handling middleware
app.use(express.json());

// Middleware to handle url encoded data (form data)
app.use(express.urlencoded({ extended: false }));

// Serving static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

// Page Routers
app.use('/', require('./routes/root'));

// API Routers
app.use('/register', require('./routes/api/register'));

// Session Auth Middleware
const store = new MongoDBStore({
    uri: process.env.MONGODB_DATABASE_URL,
    collection: 'sessions',
  });

console.log('store created')
// Configure session middleware
app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret
    resave: false,              // Don't save session if unmodified
    saveUninitialized: false,   // Save uninitialized sessions
    store: store,
    cookie: { secure: false }   // Set to true if using HTTPS
}));
    app.use((req, res, next) => {
        console.log(req.session);
        next();
    });
// Route to create a new session
app.get('/login', (req, res) => {
    req.session.user = {
        id: 1,
        name: 'John Doe'
    };
    res.send('Session created. User logged in.');
});

// Route to delete the session
app.get('/delete-session', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error deleting session.');
        }
        res.send('Session deleted successfully.');
    });
});

// Protected Routers
app.use('/protected', require('./routes/protected/protectedRoute'));

// Protected API
app.use('/test', require('./routes/api/test'));



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));