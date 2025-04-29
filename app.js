const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');
const os = require('os');

const app = express();
const port = 3000;

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Dont1peak!!1',
    database: 'user_management'
};

// Get local IP address
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            // Skip internal and non-IPv4 addresses
            if (interface.internal || interface.family !== 'IPv4') {
                continue;
            }
            return interface.address;
        }
    }
    return 'localhost';
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Database connection pool
let pool;

// Initialize database connection
async function initializeDB() {
    try {
        pool = await mysql.createPool({
            ...dbConfig,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Add error handler for the pool
        pool.on('error', (err) => {
            console.error('Unexpected database error:', err);
        });

        // Test the connection
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        
        await createTables();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1); // Exit if database connection fails
    }
}

// Create necessary tables
async function createTables() {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                netId VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                gender VARCHAR(50),
                race VARCHAR(50),
                year VARCHAR(50),
                preferred_campus VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    } finally {
        connection.release();
    }
}

// Validate Rutgers NetID format
function validateNetId(netId) {
    const netIdRegex = /^[a-zA-Z0-9._%+-]+@(?:scarletmail\.)?rutgers\.edu$/;
    return netIdRegex.test(netId);
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'frontpage.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Serve preferences page
app.get('/preferences', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'preferences.html'));
});

// API endpoints
app.post('/api/register', async (req, res) => {
    const { username, netId, password, gender, race, year, preferred_campus } = req.body;

    if (!validateNetId(netId)) {
        return res.status(400).json({ error: 'Invalid NetID format. Please use your Rutgers email (@rutgers.edu or @scarletmail.rutgers.edu)' });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
            error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
        });
    }

    try {
        const connection = await pool.getConnection();
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await connection.query(
            'INSERT INTO users (username, netId, password, gender, race, year, preferred_campus) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [username, netId, hashedPassword, gender, race, year, preferred_campus]
        );
        connection.release();
        res.json({ message: 'Registration successful' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.message.includes('username')) {
                res.status(400).json({ error: 'Username already taken' });
            } else {
                res.status(400).json({ error: 'NetID already registered' });
            }
        } else {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Error during registration' });
        }
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const connection = await pool.getConnection();
        const [users] = await connection.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        connection.release();

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            netId: user.netId,
            preferences: user.preferences
        };

        res.json({ message: 'Login successful!' });
    } catch (error) {
        res.status(500).json({ error: 'Error during login.' });
    }
});

app.post('/api/update-preferences', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const { preferences } = req.body;
    const netId = req.session.user.netId;

    try {
        const connection = await pool.getConnection();
        await connection.query(
            'UPDATE users SET preferences = ? WHERE netId = ?',
            [JSON.stringify({ text: preferences }), netId]
        );
        connection.release();
        res.json({ message: 'Preferences updated successfully' });
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({ error: 'Error updating preferences' });
    }
});

app.get('/api/user-data', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated.' });
    }
    res.json(req.session.user);
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully.' });
});

// Start the server
initializeDB().then(() => {
    const localIP = getLocalIP();
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server running at:`);
        console.log(`- Local: http://localhost:${port}`);
        console.log(`- Network: http://${localIP}:${port}`);
        console.log('\nShare this link with others on your network:');
        console.log(`http://${localIP}:${port}`);
    });
}).catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
}); 
