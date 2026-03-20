import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });
  const clients = new Set<WebSocket>();

  wss.on("connection", (socket) => {
    clients.add(socket);

    socket.on("message", (rawData) => {
      try {
        const data = JSON.parse(rawData.toString());

        if (data.type === "HELLO_CLICKED") {
          const payload = JSON.stringify({
            type: "HELLO_ALERT",
            message: data.message || "Another user clicked Hello",
          });

          clients.forEach((client) => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
              client.send(payload);
            }
          });
        }
      } catch (error) {
        console.error("Invalid WS message:", error);
      }
    });

    socket.on("close", () => {
      clients.delete(socket);
    });
  });
}
