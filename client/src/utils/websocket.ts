
  export type WSpayload = {
    type: string;
    payload?: any;
  }

let socket : WebSocket | null = null;
  type listener = (data:any)=>void;
  const listeners : Record<string, listener[]> = {};

export function initSocket() {
  if(socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }

  socket = new WebSocket(`${import.meta.env.VITE_WS_URL}`);

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      const handlers = listeners[data.type] || [];
      handlers.forEach((handler) => handler(data));
    } catch (error) {
      console.error("Invalid WS message:", error);
    }
  };
  return socket;
}

export function getsocket() {
  if(!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn("WebSocket is not connected");
    return null;
  }
  return socket;
}

export function sendMessage(data:WSpayload){
  if(!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn("WebSocket is not connected");
    return false;
  }
  socket.send(JSON.stringify(data));
  return true;
}

export function addListener(type:string , listener:(data:any)=>void){
  if(!listeners[type]) {
    listeners[type] = [];
  }
  listeners[type].push(listener);
}

export const HelloListener = (data: WSpayload) => {alert(data.payload?.message)}; 