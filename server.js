require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const ticketRoutes = require('./src/routes/ticketRoutes');

const app = express();

app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000', // Allow the frontend origin
  credentials: true, // Allow credentials (cookies, HTTP authentication)
};

app.use(cors(corsOptions));

// Routes
app.use((req,res, next) => {
  console.log('api is running');
  next();
});

app.use('/api/auth', authRoutes);

app.use('/api/seat', ticketRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
