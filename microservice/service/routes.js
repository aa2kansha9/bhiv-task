const express = require('express');
const router = express.Router();
const validation = require('./validation');
const fs = require('fs').promises;
const path = require('path');

// In-memory storage for items (for demo purposes)
let items = [];
let requestCount = 0;

// Path for log file
const LOG_FILE_PATH = path.join(__dirname, '..', 'requests.log.json');

// Function to log to file
const logToFile = async (logEntry) => {
    try {
        // Create log entry with proper JSON format
        const logLine = JSON.stringify(logEntry) + ',\n';
        
        // Append to log file
        await fs.appendFile(LOG_FILE_PATH, logLine);
    } catch (error) {
        console.error('Failed to write to log file:', error.message);
    }
};

// Initialize log file
const initializeLogFile = async () => {
    try {
        // Check if file exists
        try {
            await fs.access(LOG_FILE_PATH);
        } catch {
            // File doesn't exist, create it with initial array
            await fs.writeFile(LOG_FILE_PATH, '[\n');
        }
    } catch (error) {
        console.error('Failed to initialize log file:', error.message);
    }
};

// Initialize log file on server start
initializeLogFile();

// Simple request logger middleware
const requestLogger = async (req, res, next) => {
    requestCount++;
    const timestamp = new Date().toISOString();
    
    const logEntry = {
        timestamp: timestamp,
        method: req.method,
        url: req.url,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent') || 'Unknown',
        requestId: requestCount,
        body: req.method === 'POST' ? req.body : undefined
    };
    
    // Log to console
    console.log(`[${timestamp}] ${req.method} ${req.url} - ID: ${requestCount}`);
    
    // Store in request for use in routes
    req.logEntry = logEntry;
    
    // Log to file (non-blocking)
    logToFile(logEntry);
    
    next();
};

// Apply request logger to all routes
router.use(requestLogger);

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        requestCount: requestCount,
        memoryUsage: process.memoryUsage()
    });
});

// Submit endpoint with validation
router.post('/submit', validation.validateSubmit, (req, res) => {
    const newItem = {
        id: items.length + 1,
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    items.push(newItem);
    
    res.status(201).json({
        message: 'Item submitted successfully',
        item: newItem,
        requestId: req.logEntry.requestId
    });
});

// Get all items endpoint
router.get('/items', (req, res) => {
    res.json({
        count: items.length,
        items: items,
        requestId: req.logEntry.requestId
    });
});

// Add an endpoint to view logs (optional, for debugging)
router.get('/logs', async (req, res) => {
    try {
        const logData = await fs.readFile(LOG_FILE_PATH, 'utf8');
        // Note: The log file has a trailing comma, so we need to handle it
        const logs = JSON.parse(logData.replace(/,\s*$/, '') + '\n]');
        res.json({
            logCount: logs.length,
            logs: logs.slice(-50) // Return last 50 logs
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to read logs',
            message: error.message
        });
    }
});

module.exports = router;