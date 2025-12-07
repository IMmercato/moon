const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const admin = require('firebase-admin');

const serviceAccountJsonString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

let serviceAccount;
try {
    if (!serviceAccountJsonString) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
    }

    serviceAccount = JSON.parse(serviceAccountJsonString);

    // Initialize the Admin SDK
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized successfully.');

} catch (e) {
    console.error('Failed to initialize Firebase Admin SDK. Error:', e.message);
    console.error('Ensure FIREBASE_SERVICE_ACCOUNT_KEY is set correctly as a JSON string on your hosting platform (Render).');
}

const db = admin.firestore();


const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'a_strong_fallback_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

const requireAdmin = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

app.use(express.static(path.join(__dirname, 'mar')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'mar', 'mar.html'));
});

app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'mar', 'blog.html'))
});


app.get('/admin/login', (req, res) => {
    res.send('<h1>Admin Login</h1><form method="POST" action="/admin/login"><input name="name" placeholder="Username"><input name="password" type="password" placeholder="Password"><button type="submit">Login</button></form>')
});

app.post('/admin/login', (req, res) => {
    const { name, password } = req.body;
    if (name === process.env.ADMIN_NAME && password === process.env.ADMIN_PASSWORD) {
        req.session.loggedIn = true;
        console.log('Logged in');
        res.redirect('/admin/write');
    } else {
        res.send('Invalid username or password. <a href="/admin/login">Try again</a>');
    }
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        console.log('Session destroyed, logged out');
        res.redirect('/');
    });
});

app.get('/admin/write', requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'mar', 'admin-write.html'));
});

app.post('/admin/post', requireAdmin, async (req, res) => {
    const { title, content, author, quadruped_progress, speedy_progress } = req.body;

    if (!title || !content || !author) {
        return res.status(400).send('Missing required fields: title, content, and author.');
    }

    try {
        const newPost = {
            title: title,
            content: content,
            author: author,
            progress: {
                quadruped: parseInt(quadruped_progress) || 0,
                speedy: parseInt(speedy_progress) || 0
            },
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('blogs').add(newPost);

        res.send(`<h1>Success!</h1><p>Blog post "${title}" successfully published to Firestore.</p>
                <p><a href="/admin/write">Write another post</a> | <a href="/blog">View blog</a> | <a href="/admin/logout">Logout</a></p>`);

    } catch (error) {
        console.error('Error adding document: ', error);
        res.status(500).send('Failed to publish post. Check server logs.');
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});