const whitelist = ['https://patrol-cam-production-75e679f974e1.herokuapp.com', 'http://agile-crow-usoj23gwgmlexirrdv42lwyh.herokudns.com/', 'http://patrolcam.us', 'http://localhost:3000', 'https://api.patrolcam.us']; // A list of domains that are ALLOWED to access backend API
// Checks for domains in the above list. 
const corsOptions = {  
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) { 
            callback(null, true)
        } 
        else {
            callback(new Error ('Error: Not allowed by CORS'))
        } 
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions