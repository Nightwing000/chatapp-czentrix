import {io} from "socket.io-client"

const socket = io("http://localhost:3000");
socket.on("connect", () => {
  console.log("✅ Connected to server:", socket.id);
});
socket.on("connect_error", (err) => {
  console.error("❌ Connection failed:", err.message);
});


export default socket;

