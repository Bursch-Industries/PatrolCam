const connectDB = require('./config/dbConn');
const createServer = require('./utils/createServer')


const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Create the server
const app = createServer();

<<<<<<< HEAD

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
=======
// Serving static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

// Page Routers
app.use('/', require('./routes/root'));

// API Routers
app.use('/register', require('./routes/api/register'));

// Email API
app.use('/', require('./routes/api/emailAPI'));

// Login API
app.use('/login', require('./routes/api/loginAPI'));

// Protected Routers
app.use('/protected', require('./routes/protected/protectedRoute'));

// Universal 404 Catch
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'pages', '404.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
>>>>>>> Ethan_Off_Midterm
