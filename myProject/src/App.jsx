import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Home';
import CreateLeaveRequest from './pages/CreateLeaveRequest';
import MyLeaveRequests from './pages/MyLeaveRequests';
import MyEquipmentRequests from './pages/MyEquipmentRequests';
import CreateEquipmentRequest from './pages/CreateEquipmentRequest';
import Pending2 from './pages/Pending2';

import Pending from './pages/Pending';

// Basit rol kontrol fonksiyonu
function getUserRoleFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  } catch {
    return null;
  }
}

// Koruma için basit private route component'i
function PrivateRoute({ children }) {
  const role = getUserRoleFromToken();
  if (!role) {
    // Giriş yoksa login sayfasına yönlendir
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
            {getUserRoleFromToken() === 'Admin' || getUserRoleFromToken() === 'It' ? (
              <Pending2 />
            ) : (
              <Navigate to="/home" replace />
            )}
          </PrivateRoute>
        }
      />



      {/* İstersen buraya Admin sayfaları için ek route ve PrivateRoute içine rol kontrolü koyabilirsin */}
      {/* Örnek: */}
      {/* <Route
          path="/manage-leaves"
          element={
            <PrivateRoute>
              {getUserRoleFromToken() === 'Admin' ? <ManageLeaves /> : <Navigate to="/home" replace />}
            </PrivateRoute>
          }
        /> */}

    </Routes>
  );
}
