import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getUserRoleFromToken } from './utils/auth';

import Login from './pages/Login';
import Home from './pages/Home';
import CreateLeaveRequest from './pages/CreateLeaveRequest';
import MyLeaveRequests from './pages/MyLeaveRequests';
import MyEquipmentRequests from './pages/MyEquipmentRequests';
import CreateEquipmentRequest from './pages/CreateEquipmentRequest';
import Pending2 from './pages/Pending2';
import Pending from './pages/Pending';

// Koruma için basit private route component'i
function PrivateRoute({ children }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [role, setRole] = React.useState(null);

  React.useEffect(() => {
    const checkAuth = () => {
      const currentRole = getUserRoleFromToken();
      setRole(currentRole);
      setIsLoading(false);
    };

    // İlk kontrol için kısa bir gecikme
    setTimeout(checkAuth, 150);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-indigo-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-indigo-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Private route: rol varsa Home'u göster */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      <Route
        path="/create-leave"
        element={
          <PrivateRoute>
            <CreateLeaveRequest />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-leave-requests"
        element={
          <PrivateRoute>
            <MyLeaveRequests />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-equipment-requests"
        element={
          <PrivateRoute>
            <MyEquipmentRequests />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-equipment"
        element={
          <PrivateRoute>
            <CreateEquipmentRequest />
          </PrivateRoute>
        }
      />
      <Route
        path="/manage-leaves"
        element={
          <PrivateRoute>
            {getUserRoleFromToken() === 'Admin' ? <Pending /> : <Navigate to="/home" replace />}
          </PrivateRoute>
        }
      />
      <Route
        path="/manage-equipments"
        element={
          <PrivateRoute>
            {getUserRoleFromToken() === 'Admin' || getUserRoleFromToken() === 'It' ? <Pending2 /> : <Navigate to="/home" replace />}
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
