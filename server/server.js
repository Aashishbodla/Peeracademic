require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./db');
const apiRoutes = require('./routes/api');
const bcrypt = require('bcryptjs');

const app = express();


const path = require('path');
app.use(express.static(path.join(__dirname, 'public'))); // or 'dist'

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Configure CORS using environment variable
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://127.0.0.1:5500'];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', apiRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

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
    await initializeDatabase();
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