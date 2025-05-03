const http = require('http');
const url = require('url');
const querystr = require('querystring');
const express = require('express');
const session = require('express-session');
const cas = require('connect-cas');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const db = require('./connect_db');

const regExpGet = new RegExp('^\/get.*');
const regExpPost = new RegExp('^\/post.*');
const regExpPatch = new RegExp('^\/patch.*');
const regExpDelete = new RegExp('^\/delete.*');

const port = 8080;

const app = express();

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

cas.configure({
    casHost: 'cas.rutgers.edu',
    serviceUrl: 'http://localhost:3000/auth/cas'
});

app.use(cas.serviceValidate());
app.use(cas.authenticate());

app.get('/auth/cas', cas.bounce, (req, res) => {
    const user = req.session[cas.session_name];

    if (user && (user.email.endsWith('@rutgers.edu') || user.email.endsWith('@scarletmail.rutgers.edu'))) {
        req.session.user = user;
        res.redirect('/dashboard');
    } else {
        res.status(403).send('Access denied. Only Rutgers emails are allowed.');
    }
});

app.get('/auth/logout', cas.logout, (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

passport.use(new GoogleStrategy({
    clientID: 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect('/dashboard');
});

const setHeader = function (responeMessage) {
    if (!responeMessage.headers || responeMessage.headers === null) {
        responeMessage.headers = {};
    }
    if (!responeMessage.headers["Content-Type"]) {
        responeMessage.headers["Content-Type"] = "application/json";
    }
};

const getURLParts = function (request) {
    let urlParts = [];
    let segments = request.url.split('/');

    for (index = 0, length = segments.length; index < length; ++index) {
        if (segments[index] !== "") {
            urlParts.push(segments[index]);
        }
    }

    return urlParts;
};

const applicationServer = function (request, response) {
    let done = false;
    let responeMessage = {};
    
    const urlParts = getURLParts(request);

    if (request.method === 'GET') {
        try {
            if (regExpGet.test(request.url)) {
                done = true;
            }
        }
        catch (exception) { 
        }
    }
    else if (request.method === 'POST') {
        try {
            if (regExpPost.test(request.url)) {
                done = true;
            }
        }
        catch (exception) { 
        }
    }
    else if (request.method === 'PATCH') {
        try {
            if (regExpPatch.test(request.url)) {
                done = true;
            }
        }
        catch (exception) { 
        }
    }
    else if (request.method === 'DELETE') {
        try {
            if (regExpDelete.test(request.url)) {
                done = true;
            }
        }
        catch (exception) { 
        }
    }
    else {
        abort();
    }

    if (done === false) {
        responeMessage.code = 404;
        responeMessage.body = 'Not found';
        setHeader(responeMessage)
        response.writeHead(404, responeMessage.headers),
        response.end(responeMessage.body);
    }
    else {
        response.end();
    }
};

app.post('/api/register', async (req, res) => {
    const { fullname, username, netid, ruid, email, password } = req.body;

    try {
        const [existingUser] = await db.query('SELECT * FROM useraccounts WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'An account with this email already exists.' });
        }

        let hashedPassword = null;
        if (password && password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        await db.query(
            'INSERT INTO useraccounts (realname, username, netid, ruid, email, password) VALUES (?, ?, ?, ?, ?, ?)',
            [fullname, username, netid, ruid, email, hashedPassword]
        );

        res.status(201).json({ redirect: '/email_login.html' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
});

const webServer = http.createServer(applicationServer);
webServer.listen(port);

module.exports = app;