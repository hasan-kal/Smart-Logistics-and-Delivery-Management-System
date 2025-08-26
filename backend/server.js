const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express() ;
const PORT = process.env.PORT || 5000 ;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const shipmentRoutes = require('./routes/shipmentRoutes');
app.use('/api/shipments', shipmentRoutes);

app.get('/', (req, res) => {
    res.send('Backend is running...');
});

const connectDB = require('./config/db');
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});