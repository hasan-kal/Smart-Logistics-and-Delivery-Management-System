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

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("New client connected: " + socket.id);

  socket.on("updateLocation", (data) => {
    io.emit("agentLocationUpdated", data);
  });

  socket.on("updateStatus", (data) => {
    io.emit("shipmentStatusUpdated", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected: " + socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});