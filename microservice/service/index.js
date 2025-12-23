 
const express = require('express');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Use routes
app.use('/', routes);

// Start server
app.listen(PORT, () => {
    console.log(`Microservice running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});