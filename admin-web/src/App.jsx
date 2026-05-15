import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Certifications from './pages/Certifications';
import Students from './pages/Students';
import Verify from './pages/Verify';
import PublicVerify from './pages/PublicVerify';
import GraduatePortal from './pages/GraduatePortal';
import AdminLayout from './components/AdminLayout';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/verify" element={<PublicVerify />} />
        <Route path="/graduate" element={<GraduatePortal />} />

        {/* Page de connexion admin */}
        <Route path="/admin" element={<Login />} />

        {/* Espace admin protégé avec sidebar */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="certifications" element={<Certifications />} />
          <Route path="students" element={<Students />} />
          <Route path="verify-admin" element={<Verify />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
