import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) {
      // Connect to the custom server (running on the same port)
      socket = io();

      socket.on("connect", () => {
        setIsConnected(true);
        console.log("Connected to Socket.io server");
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
        console.log("Disconnected from Socket.io server");
      });
    }

    return () => {
      // We don't necessarily want to disconnect on component unmount 
      // if we want a global connection, but for strict mode we might need to handle this.
    };
  }, []);

  return { socket, isConnected };
};
