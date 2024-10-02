const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);


// Set up MongoDB session store
const store = new MongoDBStore({
  uri: process.env.MONGODB_DATABASE_URL
});

console.log('MongoDBStore created')

// Catch errors
store.on('error', (error) => {
  console.error(error);
});



// Session middleware
app.use(session({
  secret: 'yourSecretKey', // Replace with a strong secret
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60, // Set cookie expiration (1 hour)
  },
}))


module.exports = sessionMiddleware