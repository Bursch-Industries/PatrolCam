const connectDB = require('./config/dbConn');
const createServer = require('./utils/createServer')


const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Create the server
const app = createServer();


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
