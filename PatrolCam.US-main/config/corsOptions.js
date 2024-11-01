const whitelist = ['https://www.patrolcam.com', 'http://agile-crow-usoj23gwgmlexirrdv42lwyh.herokudns.com/', 'http://patrolcam.us', 'http://localhost:3000']; // A list of domains that are ALLOWED to access backend API
// Checks for domains in the above list. 
const corsOptions = {  
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) { //Take out - || !origin - for prod
            callback(null, true)
        } 
        else {
            callback(new Error ('Error: Not allowed by CORS'))
        } 
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions