// app.js
const express = require('express');
const app = express();
const axios = require('axios');

// Middleware: Express built-in JSON parser
app.use(express.json()); // Built-in middleware for parsing JSON request bodies

// Custom Async Middleware: Simulate fetching data from the JSONPlaceholder API
async function fetchUserDataFromAPI(req, res, next) {
    try {
        const userId = req.body.userId || 1; // Default userId is 1 if not provided in body

        // Fetch user data from JSONPlaceholder API
        const userResponse = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`);

        // Attach the user data to the request object
        req.userData = userResponse.data;
        
        next(); // Pass control to the next middleware or route handler
    } catch (error) {
        // Handle any errors during the async operation
        next(error);
    }
}

// Route for GET request: Fetch all users
app.get('/users', async (req, res) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Route for GET request: Fetch specific user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${req.params.id}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
});

// Route for PUT request: Update user data
app.put('/users/:id', async (req, res) => {
    try {
        const updatedUserData = req.body; // Get updated user data from the request body

        const response = await axios.put(`https://jsonplaceholder.typicode.com/users/${req.params.id}`, updatedUserData);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error updating user data' });
    }
});

// Route for POST request: Process data and fetch user data
app.post('/process', fetchUserDataFromAPI, (req, res) => {
    const incomingData = req.body;
    const userData = req.userData;

    if (userData) {
        res.status(200).json({
            message: 'Processing completed successfully',
            incomingData: incomingData,
            fetchedData: userData
        });
    } else {
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
});

module.exports = app;
