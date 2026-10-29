import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

// One shared connection for the whole app
export const socket = io(SOCKET_URL)