import React from 'react';
import io from "socket.io-client"; 

const ENDPOINT = "http://127.0.0.1:5000";
export const socket = io(ENDPOINT, { transports: ['websocket'] });
export const SocketContext = React.createContext();