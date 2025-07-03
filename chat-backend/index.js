const express = require('express');
const http = require('http');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for simplicity; adjust as needed
    methods: ['GET', 'POST'],
  }
});
app.get("/", (req, res) => res.send("Server is running"));

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('agent message', (data) => {
        socket.broadcast.emit("visitor message", {
            text: data.text,
            time: new Date().toLocaleTimeString(),
        });
        });
    socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const fakeVisitors = [
  { id: 1, name: "Alice Smith" },
  { id: 2, name: "Bob Johnson" },
  { id: 3, name: "Charlie Lee" },
  { id: 4, name: "Diana Patel" },
  { id: 5, name: "Ethan Garcia" },
];

let visitorIndex = 0;

setInterval(() => {
  if (visitorIndex < fakeVisitors.length) {
    const visitor = fakeVisitors[visitorIndex];
    io.emit("new_visitor", visitor); // 🔔 Send to all connected clients
    console.log("🚶 New visitor:", visitor.name);
    visitorIndex++;
  }
}, 5000); // every 5 seconds


server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  
});

