export type WSMessage = {
  type: string;
  message?: string;
};

export function createDashboardSocket(onHelloAlert: (message: string) => void) {
  const socket = new WebSocket("ws://localhost:3000");

  socket.onmessage = (event) => {
    try {
      const data: WSMessage = JSON.parse(event.data);
      if (data.type === "HELLO_ALERT") {
        onHelloAlert(data.message || "Another user clicked Hello");
      }
    } catch (error) {
      console.error("Invalid WS message:", error);
    }
  };

  return socket;
}

export function sendHello(socket: WebSocket | null) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return false;

  socket.send(
    JSON.stringify({
      type: "HELLO_CLICKED",
      message: "Hello button was clicked",
    }),
  );

  return true;
}
