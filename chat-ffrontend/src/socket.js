import {io} from "socket.io-client"

const socket = io(process.env.REACT_APP_API_URL);
socket.on("connect", () => {
  console.log("✅ Connected to server:", socket.id);
});
socket.on("connect_error", (err) => {
  console.error("❌ Connection failed:", err.message);
});


export default socket;

