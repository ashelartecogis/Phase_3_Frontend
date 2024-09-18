import React from "react";

import socketio from "socket.io-client";
import { base_url } from "../config";

export const socket = socketio.connect(base_url,{transports: ["websocket"],});
export const SocketContext = React.createContext();