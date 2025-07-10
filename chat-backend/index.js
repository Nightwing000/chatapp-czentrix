const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

const { Server } = require("socket.io");

const io = new Server(server, {
  cors:{
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.get("/", (req,res)=> {
  res.send("Server is running")
})

io.on('connection', (socket)=> {
  console.log('Frontend Connected', socket.id);
  socket.on('agent_message', (data)=> {
  console.log('Agent says', data.text);
  io.emit("visitor message", {
    text: data.text,
    time: new Date().toLocaleTimeString(),
    from: "visitor",
  });
  });
  socket.on('disconnect',()=>{
  console.log('Disconnected', socket.id);
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
const activeVisitors = [];

let visitorInterval = setInterval(() => {
  if (visitorIndex < fakeVisitors.length) {
  const visitor = fakeVisitors[visitorIndex];
  io.emit("new_visitor", visitor);
  console.log(`🚶 New visitor: ${visitor.name}`);
  activeVisitors.push(visitor);
  visitorIndex++;
  } else {
  clearInterval(visitorInterval); 
  }
}, 10000);


// Emit random visitor message every 3 seconds
const visitorReplies = [
  "Hello there!",
  "Just checking the site.",
  "Can someone help me?",
  "Thanks!",
  "Interesting product...",
  "Bye for now!",
];

setInterval(() => {
  if (activeVisitors.length > 0) {
  const randomVisitor = activeVisitors[Math.floor(Math.random() * activeVisitors.length)];
  const text = visitorReplies[Math.floor(Math.random() * visitorReplies.length)];
  io.emit("visitor message", {
    text,
    time: new Date().toLocaleTimeString(),
    from: "visitor",
    visitorId: randomVisitor.id,
  });
  console.log(`💬 ${randomVisitor.name}: ${text}`);
  }
}, 3000);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
