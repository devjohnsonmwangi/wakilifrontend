import { io, Socket } from 'socket.io-client';

const URL='wss://https://wakili-app-api.onrender.com'

console.log(`Socket connecting to: ${URL}`);


// autoConnect: false is crucial to manually connect only when the user is logged in.
export const socket: Socket = io(URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'] 
});