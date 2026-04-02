import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
interface WSMessage {
  type: string;
  payload?: any;
}

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  const roomSockets = new Map<string, Set<WebSocket>>();
  const socketRooms = new Map<WebSocket, Set<string>>();
  const roomLanguages = new Map<string, string>();

  wss.on("connection", (socket) => {
    socket.on("message", (rawData) => {
      try {
        const data = JSON.parse(rawData.toString()) as WSMessage;
        if (data.type === "JOIN_ROOM") {
          const roomId = data.payload?.roomId as string | undefined;
          if (!roomId) return;
          if (!roomSockets.has(roomId)) {
            roomSockets.set(roomId, new Set());
          }
          roomSockets.get(roomId)!.add(socket);

          if (!socketRooms.has(socket)) {
            socketRooms.set(socket, new Set());
          }
          socketRooms.get(socket)!.add(roomId);

          const currentLanguage = roomLanguages.get(roomId);
          if (currentLanguage && socket.readyState === WebSocket.OPEN) {
            socket.send(
              JSON.stringify({
                type: "LANGUAGE_CHANGED",
                payload: { roomId, language: currentLanguage },
              }),
            );
          }
        }
        if (data.type === "LANGUAGE_CHANGED") {
          const roomId = data.payload?.roomId as string | undefined;
          const language = data.payload?.language as string | undefined;
          if (!roomId || !language) return;

          roomLanguages.set(roomId, language);

          const sendData = JSON.stringify({
            type: "LANGUAGE_CHANGED",
            payload: { roomId, language },
          });
          const clients = roomSockets.get(roomId);
          if (!clients) return;
          clients.forEach((client) => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
              client.send(sendData);
            }
          });
        }
      } catch (error) {
        console.error("Invalid WS message:", error);
      }
    });

    socket.on("close", () => {
      const rooms = socketRooms.get(socket);
      if (rooms) {
        rooms.forEach((roomId) => {
          const clients = roomSockets.get(roomId);
          if (!clients) return;

          clients.delete(socket);
          if (clients.size === 0) {
            roomSockets.delete(roomId);
            roomLanguages.delete(roomId);
          }
        });
      }
      socketRooms.delete(socket);
    });
  });
}
