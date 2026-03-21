
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/LogoutButton";
import { HelloListener, addListener , sendMessage } from "@/utils/websocket";


const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate("/create-room");
  };

  const handleJoinRoom = () => {
    // replace with your join-room flow
    navigate("/join-room");
  };

  const handleHello = () => {
    const isSent = sendMessage(
      {
        type: "HELLO_CLICKED",
        payload: { message: "Hello from Dashboard!" }
      }
    );

    addListener("HELLO_ALERT", HelloListener);

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
          Start a new collaboration
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

          <Button
            onClick={handleJoinRoom}
            variant="outline"
            className="h-12 text-base border-blue-600 text-blue-700 hover:bg-blue-50"
          >
            Join Room
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
