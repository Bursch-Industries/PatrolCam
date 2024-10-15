const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const createStore = async () => {

    const store = new MongoDBStore({
        uri: process.env.MONGODB_DATABASE_URL,
        collection: 'sessions',
      });

    return store;
  }
module.exports = createStore;