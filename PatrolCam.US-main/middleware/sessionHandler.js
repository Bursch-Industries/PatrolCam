const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const sessionMaxAge = 1000 * 30 // Time in ms

// Session Auth Middleware
const store = new MongoDBStore({
  uri: process.env.MONGODB_DATABASE_URL,
  collection: 'sessions',
});

const sessionMiddleware = session({
  
  secret: 'your-secret-key', // Replace with a strong secret
  resave: false,              // False = Don't save session if unmodified
  saveUninitialized: false,   // False = Don't save uninitialized sessions
  store: store,
  cookie: { secure: false, 
            maxAge: sessionMaxAge} // Set cookie expiration }
  
})


function sessionRefresh(req, res, next) {

  
  if (req.session.user) {
      req.session.cookie.maxAge = sessionMaxAge;
  }
  next();
}

module.exports = { sessionMiddleware, sessionRefresh }