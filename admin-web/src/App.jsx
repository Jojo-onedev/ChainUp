import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Certifications from './pages/Certifications';
import Students from './pages/Students';
import Verify from './pages/Verify';
import AdminLayout from './components/AdminLayout';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route publique : Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Route Admin Login (pas de sidebar) */}
        <Route path="/admin/login" element={<Login />} />
        
        {/* Routes Admin avec Layout (Sidebar commune) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="certifications" element={<Certifications />} />
          <Route path="students" element={<Students />} />
          <Route path="verify" element={<Verify />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
