const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const os = require('os');

const app = express();
const port = 3000;

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Dont1peak!!1',
    database: 'user_management'
};

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            if (interface.internal || interface.family !== 'IPv4') {
                continue;
            }
            return interface.address;
        }
    }
    return 'localhost';
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

let pool;

async function initializeDB() {
    try {
        pool = await mysql.createPool({
            ...dbConfig,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        pool.on('error', (err) => {
            console.error('Unexpected database error:', err);
        });

        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        
        await createTables();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

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
                fullname VARCHAR(100),
                ruid VARCHAR(50),
                email VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    } finally {
        connection.release();
    }
}

async function createLoginLogsTable() {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS login_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);
    } finally {
        connection.release();
    }
}

function validateNetId(netId) {
    return /^[a-zA-Z0-9._%+-]+$/.test(netId);
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'frontpage.html'));
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

app.get('/preferences', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'preferences.html'));
});

app.post('/api/register', async (req, res) => {
    const { fullname, username, netid, ruid, email, password } = req.body;

    if (!validateNetId(netid)) {
        return res.status(400).json({ error: 'Invalid NetID format.' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
            error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)' 
        });
    }

    try {
        const connection = await pool.getConnection();

        const [existingUsers] = await connection.query(
            'SELECT * FROM users WHERE username = ? OR netId = ? OR email = ?',
            [username, netid, email]
        );

        if (existingUsers.length > 0) {
            connection.release();
            return res.status(400).json({ error: 'An account with this username, NetID, or email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.query(
            'INSERT INTO users (username, netId, password, gender, race, year, preferred_campus, fullname, ruid, email) VALUES (?, ?, ?, NULL, NULL, NULL, NULL, ?, ?, ?)',
            [username, netid, hashedPassword, fullname, ruid, email]
        );
        connection.release();

        res.redirect('/preferences.html');
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Error during registration' });
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

        if (users.length === 0) {
            connection.release();
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            connection.release();
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        await connection.query(
            'INSERT INTO login_logs (user_id) VALUES (?)',
            [user.id]
        );

        connection.release();

        req.session.user = {
            id: user.id,
            username: user.username,
            netId: user.netId,
            preferences: user.preferences
        };

        res.json({ message: 'Login successful!' });
    } catch (error) {
        console.error('Error during login:', error);
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

initializeDB().then(async () => {
    await createLoginLogsTable();
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
