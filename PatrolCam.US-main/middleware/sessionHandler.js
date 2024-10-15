const session = require('express-session');
const MongoStore = require("connect-mongo")

const sessionMiddleware = session({
  secret: 'your-secret-key', // Replace with a strong secret
  resave: false,              // Don't save session if unmodified
  saveUninitialized: false,   // Save uninitialized sessions
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_DATABASE_URL,
    collectionName: 'sessions',
  }),
  cookie: { secure: false, 
            maxAge: 1000 * 30 } // Set cookie expiration (ms)
  
})


function sessionRefresh(req, res, next) {

  
  if (req.session.user) {
      req.session.cookie.maxAge = 1000 * 30;
  }
  next();
}

module.exports = { sessionMiddleware, sessionRefresh }