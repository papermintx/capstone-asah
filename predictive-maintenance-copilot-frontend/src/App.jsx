import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { SimulatorProvider } from "./context/SimulatorContext"; 

import Overview from "./pages/Overview";
import Machine from "./pages/Machine";
import MachineDetail from "./pages/MachineDetail";
import Chat from "./pages/Chat";
import Ticket from "./pages/Ticket";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import Technician from "./pages/Technician";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Documents from "./pages/Documents";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" />
      
      <AuthProvider>     
        <SimulatorProvider>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* PROTECTED LAYOUT */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              
              {/* Dashboard: Hanya untuk Admin, Operator, Viewer */}
              <Route index element={
                 <ProtectedRoute allowedRoles={['admin', 'operator', 'viewer']}>
                    <Overview />
                 </ProtectedRoute>
              } />
              
              {/* Menu Umum */}
              <Route path="machines" element={<Machine />} />
              <Route path="machines/:id" element={<MachineDetail />} />
              <Route path="chat" element={<Chat />} />
              <Route path="ticket" element={<Ticket />} />
              <Route path="settings" element={<Settings />} />

              <Route path="documents" element={
                <ProtectedRoute allowedRoles={['admin', 'technician', 'operator', 'viewer']}>
                    <Documents />
                </ProtectedRoute>
              } />

              {/* Admin Only */}
              <Route path="admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Admin />
                </ProtectedRoute>
              } />
              
              {/* Technician Only */}
              <Route path="technician" element={
                <ProtectedRoute allowedRoles={['technician', 'admin']}>
                  <Technician />
                </ProtectedRoute>
              } />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </SimulatorProvider>
      </AuthProvider>
    </div>
  );
}

export default App;