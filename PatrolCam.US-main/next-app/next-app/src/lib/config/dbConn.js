const mongoose = require('mongoose');
require('dotenv').config();


const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGODB_DATABASE_URL)
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB;

