const mongoose = require('mongoose');
const Schema = mongoose.Schema

const errorLogSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now, // Automatically set to current date/time
      },
      level: {
        type: String,
        enum: ['TRACE', 'FATAL', 'INFO', 'WARN', 'ERROR', 'DEBUG'], // Allowed log levels
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      // Service / function throwing the error
      source: {  
        type: String,
        required: true,
      },
      // If user is logged in, track 
      userId: {
        type: String,
        required: false, 
      },
      code: {
          type: String,
          required: false,
      },
      meta: {
        type: String,
        required: false // Optional field for extra context as needed
      },
    });
    

module.exports = mongoose.model('errorLog', errorLogSchema);