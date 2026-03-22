import CodeEditor from "@/components/CodeEditor";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import { Navigate, useParams } from "react-router-dom";


export default function RoomEditorPage() {
  const { roomId } = useParams();

  if (!roomId) {
    return <Navigate to="/" replace />;
  }

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<div>Loading...</div>}>
        <CodeEditor />
      </ClientSideSuspense>
    </RoomProvider>
  );
}