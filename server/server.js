const express = require('express');
const cors = require('cors');
const { initializeDatabase, testConnection } = require('./db');
const apiRoutes = require('./routes/api');

const bcrypt = require('bcryptjs'); // Instead of 'bcrypt'

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS to allow requests from the frontend running on port 5500
const corsOptions = {
  origin: 'http://127.0.0.1:5501', // Allow requests from this origin
  credentials: true, // Allow cookies or authorization headers if needed
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions)); // Apply the CORS configuration
app.use(express.json());
app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

async function startServer() {
  try {
    await initializeDatabase(); // This connects to the database
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