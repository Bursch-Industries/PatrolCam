const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);


// Session Auth Middleware
const store = new MongoDBStore({
  uri: process.env.MONGODB_DATABASE_URL,
  collection: 'sessions',
});

const sessionMiddleware = session({
  secret: 'your-secret-key', // Replace with a strong secret
  resave: false,              // Don't save session if unmodified
  saveUninitialized: false,   // Save uninitialized sessions
  store: store,
  cookie: { secure: false },   // Set to true if using HTTPS
  maxAge: 1000 * 60 * 60, // Set cookie expiration (1 hour)
})

module.exports = sessionMiddleware