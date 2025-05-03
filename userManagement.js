const readline = require('readline');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Dont1peak!!1',
    database: 'demo'
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class User {
    constructor(netId, password, preferences = {}) {
        this.netId = netId;
        this.password = password;
        this.preferences = preferences;
    }
}

let pool;

async function initializeDB() {
    try {
        pool = await mysql.createPool(dbConfig);
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
                username VARCHAR(255) UNIQUE NOT NULL,
                netId VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                gender VARCHAR(50),
                race VARCHAR(50),
                year VARCHAR(50),
                preferred_campus VARCHAR(50),
                preferences TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    } finally {
        connection.release();
    }
}

function validateNetId(netId) {
    return /^[a-zA-Z0-9._%+-]+$/.test(netId);
}

async function createAccount() {
    console.log('\n=== Register New Account ===');
    
    const username = await new Promise(resolve => {
        rl.question('Choose a username: ', resolve);
    });

    const netId = await new Promise(resolve => {
        rl.question('Enter your Rutgers NetID (email): ', resolve);
    });

    if (!validateNetId(netId)) {
        console.log('Invalid NetID format. Please use your Rutgers email address.');
        return;
    }

    const password = await new Promise(resolve => {
        rl.question('Enter password: ', resolve);
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const connection = await pool.getConnection();
        await connection.query(
            'INSERT INTO users (username, netId, password) VALUES (?, ?, ?)',
            [username, netId, hashedPassword]
        );
        connection.release();
        console.log('\nYour account has been successfully created and verified!');
        console.log(`Welcome, ${username}!`);
        
        console.log('\nLet\'s get to know you better:');
        
        console.log('\nSelect your gender:');
        console.log('1. Male');
        console.log('2. Female');
        console.log('3. Other');
        const genderChoice = await new Promise(resolve => {
            rl.question('Enter your choice (1-3): ', resolve);
        });
        const gender = genderChoice === '1' ? 'Male' : 
                      genderChoice === '2' ? 'Female' : 'Other';

        console.log('\nSelect your race:');
        console.log('1. Asian');
        console.log('2. Black or African American');
        console.log('3. Hispanic or Latino');
        console.log('4. White or Caucasian');
        console.log('5. Multiracial');
        console.log('6. Other');
        const raceChoice = await new Promise(resolve => {
            rl.question('Enter your choice (1-6): ', resolve);
        });
        const race = raceChoice === '1' ? 'Asian' :
                    raceChoice === '2' ? 'Black or African American' :
                    raceChoice === '3' ? 'Hispanic or Latino' :
                    raceChoice === '4' ? 'White or Caucasian' :
                    raceChoice === '5' ? 'Multiracial' : 'Other';

        console.log('\nSelect your year:');
        console.log('1. Freshman');
        console.log('2. Sophomore');
        console.log('3. Junior');
        console.log('4. Senior');
        console.log('5. Graduate Student');
        const yearChoice = await new Promise(resolve => {
            rl.question('Enter your choice (1-5): ', resolve);
        });
        const year = yearChoice === '1' ? 'Freshman' :
                    yearChoice === '2' ? 'Sophomore' :
                    yearChoice === '3' ? 'Junior' :
                    yearChoice === '4' ? 'Senior' : 'Graduate Student';

        console.log('\nSelect your preferred campus:');
        console.log('1. Busch');
        console.log('2. College Avenue');
        console.log('3. Cook/Douglass');
        console.log('4. Livingston');
        console.log('5. Off-campus');
        const campusChoice = await new Promise(resolve => {
            rl.question('Enter your choice (1-5): ', resolve);
        });
        const preferred_campus = campusChoice === '1' ? 'Busch' :
                               campusChoice === '2' ? 'College Avenue' :
                               campusChoice === '3' ? 'Cook/Douglass' :
                               campusChoice === '4' ? 'Livingston' : 'Off-campus';

        await connection.query(
            'UPDATE users SET gender = ?, race = ?, year = ?, preferred_campus = ? WHERE netId = ?',
            [gender, race, year, preferred_campus, netId]
        );

        console.log('\nEnter your preferences (e.g., "Clean, Quiet, Night owl"):');
        const preferences = await new Promise(resolve => {
            rl.question('> ', resolve);
        });

        try {
            await connection.query(
                'UPDATE users SET preferences = ? WHERE netId = ?',
                [JSON.stringify({ text: preferences }), netId]
            );
            console.log('Profile information saved successfully!');
        } catch (error) {
            console.log('Error saving preferences. You can set them later from the dashboard.');
        }

        console.log('Redirecting to dashboard...\n');
        await showDashboard(netId, username);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.message.includes('username')) {
                console.log('This username is already taken. Please choose another one.');
            } else {
                console.log('This NetID is already registered.');
            }
        } else {
            console.error('Error creating account:', error);
        }
    }
}

async function showDashboard(netId, username) {
    console.log('=== Welcome to Your Dashboard ===');
    console.log(`Logged in as: ${username} (${netId})`);
    
    try {
        const connection = await pool.getConnection();
        const [users] = await connection.query(
            'SELECT preferences FROM users WHERE netId = ?',
            [netId]
        );
        connection.release();

        if (users.length > 0) {
            const preferences = users[0].preferences || {};
            console.log('\nYour Current Preferences:');
            console.log(JSON.stringify(preferences, null, 2));
        }

        console.log('\nDashboard Options:');
        console.log('1. Update Profile');
        console.log('2. View Account Details');
        console.log('3. Return to Main Menu');
        
        const choice = await new Promise(resolve => {
            rl.question('\nEnter your choice (1-3): ', resolve);
        });

        switch (choice) {
            case '1':
                await updateProfile();
                break;
            case '2':
                console.log('\nAccount Details:');
                console.log(`Username: ${username}`);
                console.log(`NetID: ${netId}`);
                console.log('Account Status: Active');
                break;
            case '3':
                console.log('\nReturning to main menu...');
                break;
            default:
                console.log('Invalid choice. Returning to main menu...');
        }
    } catch (error) {
        console.error('Error accessing dashboard:', error);
    }
}

async function updateProfile() {
    console.log('\n=== Update Profile ===');
    
    const username = await new Promise(resolve => {
        rl.question('Enter your NetID username (before @rutgers.edu): ', resolve);
    });

    const netId = `${username}@rutgers.edu`;

    const password = await new Promise(resolve => {
        rl.question('Enter your password: ', resolve);
    });

    try {
        const connection = await pool.getConnection();
        const [users] = await connection.query(
            'SELECT * FROM users WHERE netId = ?',
            [netId]
        );
        connection.release();

        if (users.length === 0) {
            console.log('User not found.');
            return;
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            console.log('Invalid password.');
            return;
        }

        const currentPreferences = user.preferences ? JSON.parse(user.preferences).text : 'None';
        console.log('\nCurrent preferences:', currentPreferences);
        
        console.log('\nEnter your new preferences (e.g., "Dark theme, Email notifications, English language"):');
        const newPreferences = await new Promise(resolve => {
            rl.question('> ', resolve);
        });

        try {
            await connection.query(
                'UPDATE users SET preferences = ? WHERE netId = ?',
                [JSON.stringify({ text: newPreferences }), netId]
            );
            console.log('Profile updated successfully!');
        } catch (error) {
            console.log('Error updating preferences. Please try again.');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
    }
}

async function showMenu() {
    while (true) {
        console.log('\n=== User Management System ===');
        console.log('1. Register');
        console.log('2. Login');
        console.log('3. Exit');
        
        const choice = await new Promise(resolve => {
            rl.question('Enter your choice (1-3): ', resolve);
        });

        switch (choice) {
            case '1':
                await createAccount();
                break;
            case '2':
                await updateProfile();
                break;
            case '3':
                console.log('Goodbye!');
                rl.close();
                process.exit(0);
            default:
                console.log('Invalid choice. Please try again.');
        }
    }
}

async function start() {
    await initializeDB();
    await showMenu();
}

start().catch(console.error);