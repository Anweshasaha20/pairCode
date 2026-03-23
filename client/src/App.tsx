import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LiveblocksProvider } from "@liveblocks/react/suspense";
import LoginPage from "./pages/Login_new";
import Dashboard from "./pages/Dashboard";
import RegisterPage from "./pages/register";
import ProtectedRoute from "./components/ProtectedRoute";

import { initSocket } from "./utils/websocket";
import { useEffect } from "react";
import RoomEditorPage from "./pages/RoomEditorPage";

function App() {
  useEffect(() => {
    initSocket(); // Initialize WebSocket on app load
  }, []);

  return (
    <LiveblocksProvider
      publicApiKey={
        "pk_dev_kwl_UDz22TSg-quMcRzBFIHwV4UmLObkpVKdFiDdnGZ8GypX0gY3CJXBFUKsprIr"
      }
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/room/:roomId"
            element={
              <ProtectedRoute>
                <RoomEditorPage />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/editor"
            element={
              <ProtectedRoute>
                <RoomProvider id="my-room">
                  <ClientSideSuspense fallback={<div>Loading...</div>}>
                    <CodeEditor />
                  </ClientSideSuspense>
                </RoomProvider>
              </ProtectedRoute>
            }
          /> */}
        </Routes>
      </BrowserRouter>
    </LiveblocksProvider>
  );
}

export default App;
