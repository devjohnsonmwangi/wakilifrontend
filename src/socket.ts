import { io, Socket } from 'socket.io-client';

// The URL of your backend server running on Render.
// IMPORTANT: Use 'wss://' for a secure WebSocket connection in production.
const URL = process.env.NODE_ENV === 'production' 
  ? 'wss://https://wakili-app-api.onrender.com' // Replace with your actual Render backend URL
  : 'http://localhost:8000'; // Your local backend URL

console.log(`Socket connecting to: ${URL}`);

// We create a single socket instance and export it.
// autoConnect: false is crucial. We want to manually connect only when the user is logged in.
export const socket: Socket = io(URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'] 
});