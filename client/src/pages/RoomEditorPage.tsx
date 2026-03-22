import CodeEditor from "@/components/CodeEditor";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import { Navigate, useParams } from "react-router-dom";


export default function RoomEditorPage() {
  const { roomId } = useParams<{ roomId: string }>();
  if (!roomId) {
    return <Navigate to="/" replace />;
  }
  console.log("Rendering RoomEditorPage with roomId:", roomId);
  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<div>Loading...</div>}>
        <CodeEditor Id={roomId} />
      </ClientSideSuspense>
    </RoomProvider>
  );
}