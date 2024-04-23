const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const authenticateToken =require("./middleware/authenticateToken")
const authRoutes = require('./routes/authRoutes'); 
const drawingRoutes = require('./routes/drawingRoutes');
const socketManager = require('./sockets/socketManager');
// const logger = require('./middleware/logger');
// const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();
const cors=require("cors")
const app = express();
const server = http.createServer(app);
 
 //{
//     cors: {
//         origin: "http://localhost:3000",  // This should match the URL of your frontend application
//         methods: ["GET", "POST"],
//         allowedHeaders: ["my-custom-header"],
//         credentials: true
//     }
// });
// app.use(cors({
//     origin: 'http://localhost:3000',  // Allow access from the frontend
//     credentials: true  // Allow cookies (if using)
// }));
const corsOptions = {
    origin: "http://localhost:3000",  // Make sure this matches your front-end URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
};

app.use(cors(corsOptions));
const io = socketIo(server, {
    cors: corsOptions
});
// app.use(logger);
app.use(express.json());
app.use('/api/auth', authRoutes); // Use auth routes
app.use('/api/drawings', drawingRoutes);
app.use('/api/private', authenticateToken);
// app.use(errorHandler);
mongoose.connect("your_mongodb_connection_string").then(()=>console.log("Db connected")).catch((err)=>{
    console.log("Db Error",err)
});
// mongoose.connection.on('connected', () => {
//     console.log('Connected to MongoDB');
// });

io.on('connection', socket => {
    console.log('New client connected:', socket.id);

    socket.on('drawing', (data) => {
        socket.broadcast.emit('drawing', data);
    });
    socket.on('undo', (data) => {
        socket.broadcast.emit('undo', data);  // Broadcast the undo with the last state
    });
    socket.on('redo', (data) => {
        socket.broadcast.emit('redo', data);  // Broadcast the redo with the next state
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT =5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
