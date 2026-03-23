"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = setupWebSocket;
const ws_1 = require("ws");
function setupWebSocket(server) {
    const wss = new ws_1.WebSocketServer({ server });
    const clients = new Set();
    wss.on("connection", (socket) => {
        clients.add(socket);
        socket.on("message", (rawData) => {
            try {
                const data = JSON.parse(rawData.toString());
                if (data.type === "HELLO_CLICKED") {
                    const sendData = JSON.stringify({
                        type: "HELLO_ALERT",
                        payload: {
                            message: data.payload.message || "Another user clicked Hello",
                        },
                    });
                    clients.forEach((client) => {
                        if (client !== socket && client.readyState === ws_1.WebSocket.OPEN) {
                            client.send(sendData);
                        }
                    });
                }
            }
            catch (error) {
                console.error("Invalid WS message:", error);
            }
        });
        socket.on("close", () => {
            clients.delete(socket);
        });
    });
}
