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
  cookie: { secure: false, 
            maxAge: 1000 * 30} // Set cookie expiration (1 hour) },   // Set to true if using HTTPS
  
})


function sessionRefresh(req, res, next) {

  
  if (req.session.user) {
      req.session.cookie.maxAge = 1000 * 30;
  }
  next();
}

module.exports = { sessionMiddleware, sessionRefresh }