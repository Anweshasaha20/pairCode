import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/LogoutButton";
import { HelloListener, addListener, sendMessage } from "@/utils/websocket";
import axios from "axios";
import {  useEffect, useState } from "react";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [roomLink, setRoomLink] = useState("");
  
  useEffect(() => {
    addListener("HELLO_ALERT", HelloListener);
  }, []);

  const handleCreateRoom = async () => {
    const roomName = prompt("Enter room name");
    if (!roomName || !roomName.trim()) return;

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/rooms`, {
        roomName: roomName.trim(),
        language: "javascript",
      });

      const roomId = res.data?.room?._id;
      if (!roomId) {
        alert("Room created but id missing");
        return;
      }

      navigate(`/room/${roomId}`);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to create room");
    }
  };

  const handleJoinRoom = async () => {
    const trimmedLink = roomLink.trim();
    if (!trimmedLink) {
      alert("Please enter a room link");
      return;
    }

    const roomId = trimmedLink.split("/").pop();
    if (!roomId) {
      alert("Invalid room link");
      return;
    }

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/join-room`,
      { roomId },
      { withCredentials: true },
    );

    if (res.status === 200) {
      navigate(`/room/${roomId}`);
    } else {
      alert(res.data?.message || "Failed to join room");
    }
  };

  const handleHello = () => {

   
    const isSent = sendMessage({
      type: "HELLO_CLICKED",
      payload: { message: "Hello from Dashboard!" },
    });

    

    if (!isSent) {
      alert("Socket not connected yet");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-600 to-blue-700 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <LogoutButton />
        </div>
        <p className="text-center text-gray-600 mb-8">
          Start a new collaboration or join an existing room to code together in real-time!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={handleCreateRoom}
            className="h-12 text-base bg-blue-600 hover:bg-blue-700"
          >
            Create Room
          </Button>
          <Button
            onClick={handleHello}
            className="h-12 text-base bg-emerald-600 hover:bg-emerald-700"
          >
            Hello
          </Button>

          
        </div>
         <div className="mt-8">
          <label htmlFor="roomLink" className="block text-gray-700 font-medium mb-2">
            Enter Room Link:
          </label>
          <input
            id="roomLink"
            type="text"
            value={roomLink}
            onChange={(e) => setRoomLink(e.target.value)}
            placeholder="Enter room link here"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleJoinRoom}
            className="w-full mt-4 h-12 text-base bg-blue-600 hover:bg-blue-700"
          >
            Join Room
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
