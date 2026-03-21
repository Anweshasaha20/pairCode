import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login_new";
import Dashboard from "./pages/Dashboard";
import RegisterPage from "./pages/register";
import ProtectedRoute from "./components/ProtectedRoute";
import  CodeEditor from "./components/CodeEditor";
import { initSocket } from "./utils/websocket";
import { useEffect } from "react";
function App() {
  useEffect(() => {
    initSocket(); // Initialize WebSocket on app load
  }, []);
  return (
    <>
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
                <CodeEditor />
              </ProtectedRoute>
            }
          />
          <Route path="/editor" element={<ProtectedRoute><CodeEditor/></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
