const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./db');
const apiRoutes = require('./routes/api');
const bcrypt = require('bcryptjs');

const app = express();

// Configure CORS using environment variable
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://127.0.0.1:5500'];
const corsOptions = {
  origin: allowedOrigins, // Allow requests from specified origins
  credentials: true, // Allow cookies or authorization headers if needed
  optionsSuccessStatus: 200 // For legacy browser compatibility
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', apiRoutes);

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
async function startServer() {
  try {
    console.log('Environment Variables:', {
      DATABASE_URL: process.env.DATABASE_URL,
      SSL_ENABLED: process.env.SSL_ENABLED,
      CORS_ORIGIN: process.env.CORS_ORIGIN
    });
    await initializeDatabase(); // Connect to the database
    const PORT = process.env.PORT || 5500;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    throw err;
  }
}

startServer();