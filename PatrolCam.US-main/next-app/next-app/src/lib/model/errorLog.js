// const mongoose = require('mongoose');
// const Schema = mongoose.Schema

import mongoose, { Schema } from "mongoose";

const errorLogSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now, // Automatically set to current date/time
      },
      level: {
        type: String,
        enum: ['TRACE', 'FATAL', 'INFO', 'WARN', 'ERROR', 'DEBUG'], // Allowed log levels. See https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels for details
        required: true,
      },
      desc: {
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
        message: {
          type: String,
          required: false
        }, 
        stack: {
        type: String,
        required: false 
      }
    }
    });
    
const ErrorLog = mongoose.model("errorLog", errorLogSchema);
export default ErrorLog;

// module.exports = mongoose.model('errorLog', errorLogSchema);